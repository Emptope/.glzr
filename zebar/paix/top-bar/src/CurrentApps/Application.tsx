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

function getIconSrc(processName: string): string {
  const key = processName.toLowerCase().trim();
  const fileName = ICON_MAP[key] ?? DEFAULT_ICON_FILE;
  return `${ICON_BASE}${fileName}`;
}

function renderIcon(processName: string) {
  return (
    <img
      src={getIconSrc(processName)}
      class="app-icon"
      alt={`${processName} icon`}
    />
  );
}

const Application: Component<ApplicationProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  const handleAppClick = () => {
    handleClick();
    props.glazewm.runCommand(
      `shell-exec %userprofile%/.glzr/zebar/paix/top-bar/dist/assets/scripts/FocusWindow.ahk ${props.window.handle}`
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
