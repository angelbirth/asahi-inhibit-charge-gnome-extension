import GObject from "gi://GObject";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as QuickSettings from "resource:///org/gnome/shell/ui/quickSettings.js";
import GLib from "gi://GLib";
import Gio from "gi://Gio";

const { QuickToggle, SystemIndicator } = QuickSettings;

// ✅ Toggle
const ChargeToggle = GObject.registerClass(
  class ChargeToggle extends QuickToggle {
    _init() {
      super._init({
        title: "Charge Limit",
        iconName: "battery-symbolic",
        toggleMode: true,
      });

      this.connect("clicked", () => {
        let state = this.checked ? "on" : "off";

        try {
          GLib.spawn_command_line_async(
            `/usr/bin/sudo /usr/local/bin/asahi-charge-toggle ${state}`,
          );
        } catch (e) {
          log(`Command failed: ${e}`);
        }
      });
    }

    _syncState() {
      try {
        const file = Gio.File.new_for_path(
          "/sys/class/power_supply/macsmc-battery/charge_behaviour",
        );
        const [, bytes] = file.load_contents(null);
        const text = new TextDecoder().decode(bytes).trim();
        // Active mode is wrapped in brackets, e.g. "auto [inhibit-charge]"
        this.checked = text.includes("[inhibit-charge]");
      } catch (e) {
        log(`failed to read charge behaviour: ${e}`);
      }
    }
  },
);

const Indicator = GObject.registerClass(
  class Indicator extends SystemIndicator {
    _init() {
      super._init();

      this._toggle = new ChargeToggle();
      this.quickSettingsItems.push(this._toggle);
    }
  },
);

export default class Extension {
  enable() {
    if (this._indicator) return;
    this._indicator = new Indicator();

    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    this._indicator._toggle._syncState();
    this._syncId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
      this._indicator._toggle._syncState();
      return GLib.SOURCE_CONTINUE;
    });
  }

  disable() {
    if (this._indicator) {
      this._indicator.quickSettingsItems.forEach((item) => item.destroy());
      this._indicator.destroy();
      this._indicator = null;
    }
    if (this._syncId) {
      GLib.Source.remove(this._syncId);
      this._syncId = null;
    }
  }
}
