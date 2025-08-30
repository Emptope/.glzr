import "./style.css";
import { Component } from "solid-js";
import { DateOutput, GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface TimeStatusProps {
  date: DateOutput;
  glazewm: GlazeWmOutput;
}

const TimeStatus: Component<TimeStatusProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  // Opens Windows Notification Center (Calendar/Time panel).
  // Use glazewm.runCommand to be consistent with other buttons and avoid explorer protocol issues.
  const handleTimeClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/attaquer-modified/top-bar/dist/assets/scripts/OpenNotificationCenter.ahk",
    );
  };

  return (
    <button
      class={`date ${isActive() ? "clicked-animated" : ""}`}
      title={props.date?.formatted}
      onClick={handleTimeClick}
    >
      <span class="content">
        <img src="./assets/icons/icons8-time-32.png"></img>
        <span class="time">{props.date?.formatted.substring(0, 5)}</span>
      </span>
    </button>
  );
};

export default TimeStatus;
