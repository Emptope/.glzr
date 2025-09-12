import "./style.css";
import { Component } from "solid-js";
import { CpuOutput, GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface CpuStatusProps {
  cpu: CpuOutput;
  glazewm: GlazeWmOutput;
}

const CpuStatus: Component<CpuStatusProps> = (props) => {
  const getCpuUsageRate = (usage: number) => {
    if (usage > 90) return "extreme-usage";
    else if (usage > 65) return "high-usage";
    else if (usage > 30) return "medium-usage";
    else return "low-usage";
  };

  const { isActive, handleClick } = useAnimatedClick();

  const handleCpuClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %windir%/system32/taskmgr.exe",
    );
  };

  return (
    <button
      classList={{
        cpu: true,
        [getCpuUsageRate(Math.round(props.cpu?.usage))]: true,
        "clicked-animated": isActive(),
      }}
      onClick={handleCpuClick}
    >
      <span class="content">
        <span class="i-cpu"></span>
        <span class="cpu-bar">{Math.round(props.cpu?.usage)}%</span>
      </span>
    </button>
  );
};

export default CpuStatus;