import "./style.css";
import { Component } from "solid-js";
import { GlazeWmOutput } from "zebar";
import { Window } from "glazewm";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface ApplicationProps {
  glazewm: GlazeWmOutput;
  window: Window;
}

/**
 * Normalize OS process name to a canonical key used in ICON_MAP.
 * This makes matching case-insensitive and robust to leading/trailing spaces.
 *
 * @param name - The raw process name from the window info.
 * @returns A normalized, lowercased, trimmed process key.
 */
function normalizeProcessName(name: string): string {
  return (name ?? "").toLowerCase().trim();
}

/**
 * Centralized icon registry: process name (normalized) -> icon file name.
 * To add a new icon, append a new entry here with the normalized process name as the key.
 */
const ICON_MAP: Record<string, string> = {
  "7zfm": "icons8-7zip-32.png",
  "docker desktop": "icons8-docker-32.png",
  "feather launcher": "Feather-Launcher-32.png",
  "universal x86 tuning utility": "Universal-x86-Tuning-Utility-32.png",
  applicationframehost: "icons8-settings-32.png",
  autohotkeyux: "AutoHotkeyUX-32.png",
  brave: "icons8-brave-32.png",
  code: "icons8-visual-studio-code-32.png",
  cursor: "cursor.png",
  devenv: "icons8-visual-studio-32.png",
  discord: "icons8-discord-new-32.png",
  dnplayer: "LDPlayer-9-32.png",
  explorer: "icons8-file-explorer-new-32.png",
  fanspeedsetting: "icons8-fan-32.png",
  firefox: "Firefox-32.png",
  medibangpaintpro: "icons8-medibang-paint-32.png",
  messenger: "icons8-facebook-messenger-32.png",
  msedgewebview2: "icons8-edge-32.png",
  obs64: "icons8-obs-32.png",
  obsidian: "Obsidian-32.png",
  postman: "Postman-32.png",
  rider64: "rider64-32.png",
  signal: "Signal-32.png",
  spotify: "icons8-spotify-32.png",
  steamwebhelper: "icons8-steam-32.png",
  sublime_text: "icons8-sublime-text-32.png",
  systeminformer: "systeminformer-32x32.png",
  trae: "Trae-32.png",
  virtualbox: "VirtualBox-32.png",
  vmware: "VMware-Workstation-Pro-32.png",
  windhawk: "windhawk-32.png",
  windowsterminal: "icons8-terminal-32.png",
  zed: "zed.png",
};

/** Base folder for icons (relative to this component's bundle output). */
const ICON_BASE = "./assets/icons/";
/** Default icon file name when no mapping is found. */
const DEFAULT_ICON_FILE = "icons8-application-32.png";

/**
 * Resolve the icon src for a given process name with a safe default.
 *
 * @param processName - The raw process name from the window.
 * @returns The full icon path to be used in the <img> src attribute.
 */
function getIconSrc(processName: string): string {
  const key = normalizeProcessName(processName);
  const fileName = ICON_MAP[key] ?? DEFAULT_ICON_FILE;
  return `${ICON_BASE}${fileName}`;
}

/**
 * Render an app icon <img> element for the given process name.
 *
 * @param processName - The raw process name.
 * @returns The icon element for the process, falling back to a default icon.
 */
function renderIcon(processName: string) {
  return (
    <img
      src={getIconSrc(processName)}
      class="app-icon"
      alt={`${processName} icon`}
    />
  );
}

/**
 * Application component rendering each app button with its icon.
 * It also triggers a command to focus the window on click with a small click animation.
 */
const Application: Component<ApplicationProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  /**
   * Handle click on an app to focus the corresponding window.
   * Executes an external AHK script, passing the window handle.
   */
  const handleAppClick = () => {
    handleClick();
    props.glazewm.runCommand(
      `shell-exec %userprofile%/.glzr/zebar/attaquer-modified/top-bar/dist/assets/scripts/FocusWindow.ahk ${props.window.handle}`
    );
  };

  return (
    <button
      classList={{
        element: true,
        focus: props.window.hasFocus,
        "clicked-animated": isActive(),
      }}
      title={props.window.title}
      onClick={handleAppClick}
    >
      {renderIcon(props.window.processName)}
    </button>
  );
};

export default Application;