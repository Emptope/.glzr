import "./style.css";
import { Component, createMemo } from "solid-js";
import { BatteryOutput, GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface BatteryStatusProps {
  battery: BatteryOutput;
  glazewm: GlazeWmOutput;
}

const ICON_BASE = "./assets/icons/";

const ICONS = {
  full: "battery-max-charged-32.png",
  charging: "battery-charging-32.png",
  discharging4: "battery-4-32.png",
  discharging3: "battery-3-32.png",
  discharging2: "battery-2-32.png",
  discharging1: "battery-1-32.png",
  discharging0: "battery-32.png",
} as const;

function getBatteryUsageRate(chargePercent?: number): string {
  const pct = chargePercent ?? 0;
  if (pct >= 70) return "low-usage";
  if (pct >= 40) return "medium-usage";
  if (pct >= 15) return "high-usage";
  return "extreme-usage";
}

function getDischargingIcon(percent?: number): string {
  const pct = percent ?? 0;
  if (pct >= 90) return ICONS.discharging4;
  if (pct >= 70) return ICONS.discharging3;
  if (pct >= 40) return ICONS.discharging2;
  if (pct >= 15) return ICONS.discharging1;
  return ICONS.discharging0;
}

function getBatteryIconSrc(battery?: BatteryOutput): string {
  if (!battery?.state) return ICON_BASE + ICONS.discharging0;
  switch (battery.state) {
    case "full":
      return ICON_BASE + ICONS.full;
    case "charging":
      return ICON_BASE + ICONS.charging;
    case "discharging":
      return ICON_BASE + getDischargingIcon(battery.chargePercent);
    default:
      return ICON_BASE + ICONS.discharging0;
  }
}

function formatBatteryTime(battery?: BatteryOutput): string {
  if (!battery?.state) return "idle";
  if (battery.state === "charging") {
    const ms = battery.timeTillFull ?? 0;
    const hours = Math.trunc(ms / 3600000);
    const minutes = Math.trunc((ms % 3600000) / 60000);
    return `${hours ? `Charging: ${hours}h ` : "Charging: "}${minutes}min left`;
  }
  if (battery.state === "discharging") {
    const ms = battery.timeTillEmpty ?? 0;
    const hours = Math.trunc(ms / 3600000);
    const minutes = Math.trunc((ms % 3600000) / 60000);
    return `${hours ? `Discharging: ${hours}h ` : "Discharging: "}${minutes}min left`;
  }
  return "idle";
}

const BatteryStatus: Component<BatteryStatusProps> = (props) => {
  const titleText = createMemo(() => formatBatteryTime(props.battery));
  const iconSrc = createMemo(() => getBatteryIconSrc(props.battery));
  const percent = createMemo(() =>
    Math.round(props.battery?.chargePercent ?? 0)
  );

  const { isActive, handleClick } = useAnimatedClick();

  const handleOpenActionCenterClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/paix/top-bar/dist/assets/scripts/OpenActionCenter.ahk"
    );
  };

  return (
    <button
      classList={{
        battery: true,
        [getBatteryUsageRate(props.battery?.chargePercent)]: true,
        "clicked-animated": isActive(),
      }}
      title={titleText()}
      onClick={handleOpenActionCenterClick}
    >
      <span class="content">
        <img
          src={iconSrc()}
          class="i-battery"
          width="20"
          height="20"
          alt="Battery status"
        />
        {percent()}%
      </span>
    </button>
  );
};

export default BatteryStatus;