# Asahi Charge Toggle (GNOME Extension)

Toggle Asahi Linux charge inhibition from GNOME Shell Quick Settings.

## Requirements
- GNOME Shell 49 (you can try in different version, this is just my current version. Don't forget to update metadata.json)
- Asahi Linux with the charge control file:
  - `/sys/class/power_supply/macsmc-battery/charge_behaviour`
- Helper script installed at:
  - `/usr/local/bin/asahi-charge-toggle` (copy provided script below)
- Passwordless sudo for that helper (because GNOME Shell extensions cannot
  interactively prompt for sudo)

Preferred: put this in its own file under `/etc/sudoers.d/`:
```
sudo visudo -f /etc/sudoers.d/asahi-charge-toggle
```
Then add (replace `user` with your actual username):
```
user ALL=(root) NOPASSWD: /usr/local/bin/asahi-charge-toggle
```

## Install (manual)
1. Clone or copy this repo somewhere on your system.
2. Install the helper script:
```
sudo install -m 0755 bin/asahi-charge-toggle /usr/local/bin/asahi-charge-toggle
```
Note: do not blindly trust foreign scripts. Inspect `bin/asahi-charge-toggle`
before installing it, and only proceed if you understand and trust it.
3. Symlink (or copy) the folder to your GNOME extensions directory:
```
ln -s /path/to/inhibit-charge-extension \
  ~/.local/share/gnome-shell/extensions/asahi-charge-toggle@example.com
```
Or copy instead of symlink:
```
cp -r /path/to/inhibit-charge-extension \
  ~/.local/share/gnome-shell/extensions/asahi-charge-toggle@example.com
```
4. Optional: change the UUID to anything you want, but it must match both:
  - The folder name under `~/.local/share/gnome-shell/extensions/`
  - The `uuid` field in `metadata.json`
5. Restart GNOME Shell (log out/in, or press `Alt+F2`, type `r`, press Enter on X11).
6. Enable the extension (via `gnome-extensions` CLI or the GNOME Extensions app; see
[Install the GNOME Extensions App](#install-the-gnome-extensions-app) below):
```
gnome-extensions enable asahi-charge-toggle@example.com
```

## Install the GNOME Extensions App
Package names vary by distro. Pick the option that matches your system:

Fedora:
```
sudo dnf install gnome-extensions-app
```

Debian (and derivatives that package it this way):
```
sudo apt install gnome-shell-extension-prefs
```

Any distro (via Flathub):
```
flatpak install flathub org.gnome.Extensions
```

## Usage
- Open Quick Settings.
- Toggle “Charge Limit”.
- The switch reflects the current kernel state by polling
  `/sys/class/power_supply/macsmc-battery/charge_behaviour`.

## Troubleshooting
- If `gnome-extensions enable ...` says “does not exist”, check:
  - The directory name matches the UUID exactly.
  - `metadata.json` is readable inside the extension folder.
  - You are enabling as the same user running GNOME Shell.
- If the toggle does nothing:
  - Verify `/usr/local/bin/asahi-charge-toggle` exists and works in a terminal.
  - Verify your sudoers entry is correct and passwordless.

## License
MIT. See `LICENSE`.
