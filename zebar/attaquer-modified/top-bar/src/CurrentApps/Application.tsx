import "./style.css";
import { Component } from "solid-js";
import { GlazeWmOutput } from "zebar";
import { Window } from "glazewm";
import { useAnimatedClick } from "../hooks/useAnimatedClick";
import { ICON_MAP, ICON_BASE, DEFAULT_ICON_FILE } from "./IconConfig";

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
  if (!name) return "";
  
  let normalized = name.toLowerCase().trim();
  
  // Remove file extensions
  normalized = normalized.replace(/\.(exe|msi|app|dmg|pkg)$/i, "");
  
  // Remove content in parentheses (version info, architecture, etc.)
  // Handles both regular parentheses and full-width parentheses
  normalized = normalized.replace(/[\(（][^\)）]*[\)）]/g, "");
  
  // Remove content in square brackets
  normalized = normalized.replace(/\[[^\]]*\]/g, "");
  
  // Remove version numbers (e.g., "v1.0", "2023", "64bit", "32bit")
  normalized = normalized.replace(/\b(v?\d+(\.\d+)*|\d{4}|64bit|32bit|x64|x86)\b/g, "");
  
  // Remove common suffixes and prefixes
  normalized = normalized.replace(/\b(setup|installer|portable|final|release|beta|alpha|pro|premium|free|trial)\b/g, "");
  
  // Remove special characters and replace with spaces
  normalized = normalized.replace(/[_\-\.\+\&\#\@\!\%\^\*\=\|\\\/<>\?\:;"'`~]/g, " ");
  
  // Remove extra spaces and trim
  normalized = normalized.replace(/\s+/g, " ").trim();
  
  return normalized;
}

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