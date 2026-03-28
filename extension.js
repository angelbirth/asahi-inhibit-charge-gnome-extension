import {
  QuickToggle,
  SystemIndicator,
} from "resource:///org/gnome/shell/ui/quickSettings.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import GLib from "gi://GLib";

class ChargeToggle extends QuickToggle {
  constructor() {
    super({
      title: "Charge Limit",
      iconName: "battery-symbolic",
      toggleMode: true,
    });

    this.connect("clicked", () => {
      this.checked = !this.checked;

      if (this.checked) {
        this._runCommand("on");
      } else {
        this._runCommand("off");
      }
    });
  }

  _runCommand(state) {
    try {
      GLib.spawn_command_line_async(
        `/usr/bin/sudo /usr/local/bin/asahi-charge-toggle ${state}`,
      );
    } catch (e) {
      log(`Failed to run command: ${e}`);
    }
  }
}

class Indicator extends SystemIndicator {
  constructor() {
    super();

    this._toggle = new ChargeToggle();
    this.quickSettingsItems.push(this._toggle);
  }
}

export default class Extension {
  enable() {
    this._indicator = new Indicator();
    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}
