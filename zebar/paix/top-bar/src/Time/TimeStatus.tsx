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

  const handleTimeClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/paix/top-bar/dist/assets/scripts/OpenNotificationCenter.ahk"
    );
  };

  return (
    <button
      class={`date ${isActive() ? "clicked-animated" : ""}`}
      title={props.date?.formatted}
      onClick={handleTimeClick}
    >
      <span class="content">
        <span class="time">{props.date?.formatted}</span>
      </span>
    </button>
  );
};

export default TimeStatus;
