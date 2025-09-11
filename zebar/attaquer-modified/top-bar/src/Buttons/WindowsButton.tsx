import "./style.css";
import { Component } from "solid-js";
import { GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface WindowsButtonProps {
  glazewm: GlazeWmOutput;
}

const WindowsButton: Component<WindowsButtonProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  const handleWindowsClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/attaquer-modified/top-bar/dist/assets/scripts/OpenStartMenu.ahk",
    );
  };
  return (
    <button
      class={`logo ${isActive() ? "clicked-animated" : ""}`}
      onClick={handleWindowsClick}
    >
      <span class="content"></span>
    </button>
  );
};

export default WindowsButton;