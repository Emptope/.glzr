/**
 * Centralized icon registry: process name (normalized) -> icon file name.
 * To add a new icon, append a new entry here with the normalized process name as the key.
 */
export const ICON_MAP: Record<string, string> = {
  "clash for windows": "Clash-32.png",
  applicationframehost: "settings-32.png",
  autohotkeyux: "AutoHotkeyUX-32.png",
  axglyph: "AxGlyph-32.png",
  chrome: "chrome-32.png",
  cloudmusic: "cloudmusic-32.png",
  code: "visual-studio-code-32.png",
  controlpanel: "control-panel-32.png",
  cursor: "cursor.png",
  devenv: "visual-studio-32.png",
  everything: "Everything-32.png",
  excel: "EXCEL-32.png",
  explorer: "file-explorer-32.png",
  firefox: "Firefox-32.png",
  geogebracalculator: "GeoGebraCalculator-32.png",
  ghelper: "GHelper-32.png",
  happ: "happ-32.png",
  matlab: "matlab-32.png",
  msedgewebview2: "edge-32.png",
  obs64: "obs-32.png",
  obsidian: "Obsidian-32.png",
  okular: "okular-32.png",
  origin64: "Origin64-32.png",
  powerpnt: "POWERPNT-32.png",
  qq: "QQ-32.png",
  spotify: "spotify-32.png",
  steamwebhelper: "steam-32.png",
  sublime_text: "sublime-text-32.png",
  taskmgr: "Taskmgr-32.png",
  trae: "Trae-32.png",
  virtualbox: "VirtualBox-32.png",
  vmware: "VMware-Workstation-Pro-32.png",
  weixin: "Weixin-32.png",
  windhawk: "Windhawk-32.png",
  windowsterminal: "Terminal-32.png",
  winword: "WINWORD-32.png",
};

/** Base folder for icons (relative to this component's bundle output). */
export const ICON_BASE = "./assets/icons/";

/** Default icon file name when no mapping is found. */
export const DEFAULT_ICON_FILE = "Application-32.png";