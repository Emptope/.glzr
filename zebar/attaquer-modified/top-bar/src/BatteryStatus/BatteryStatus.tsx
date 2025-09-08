import "./style.css";
import { Component, createMemo } from "solid-js";
import { BatteryOutput } from "zebar";

interface BatteryStatusProps {
  battery: BatteryOutput;
}

/** Base folder for battery icons */
const ICON_BASE = "./assets/icons/";
/** Icon file names used for different battery states/levels */
const ICONS = {
  full: "battery-max-charged-32.png",
  charging: "battery-charging-32.png",
  discharging4: "battery-4-32.png",
  discharging3: "battery-3-32.png",
  discharging2: "battery-2-32.png",
  discharging1: "battery-1-32.png",
  discharging0: "battery-32.png",
} as const;

/**
 * Get usage rate class based on charge percent.
 * Returns one of: low-usage, medium-usage, high-usage, extreme-usage
 *
 * @param chargePercent - Battery percentage (0-100). If undefined, treated as 0.
 * @returns Usage class string for styling.
 */
function getBatteryUsageRate(chargePercent?: number): string {
  const pct = chargePercent ?? 0;
  if (pct > 70) return "low-usage";
  if (pct > 40) return "medium-usage";
  if (pct > 15) return "high-usage";
  return "extreme-usage";
}

/**
 * Resolve icon file name while discharging based on percent thresholds.
 *
 * @param percent - Battery percentage (0-100). If undefined, treated as 0.
 * @returns Icon file name for discharging state.
 */
function getDischargingIcon(percent?: number): string {
  const pct = percent ?? 0;
  if (pct > 90) return ICONS.discharging4;
  if (pct > 70) return ICONS.discharging3;
  if (pct > 40) return ICONS.discharging2;
  if (pct > 15) return ICONS.discharging1;
  return ICONS.discharging0;
}

/**
 * Compute the icon src for the given battery state and percentage.
 *
 * @param battery - Battery output object (can be undefined).
 * @returns Full icon src path.
 */
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

/**
 * Format the time text shown in the tooltip/title.
 * Handles charging, discharging, and idle states; falls back safely for undefined values.
 *
 * @param battery - Battery output object (can be undefined).
 * @returns A human-readable time string.
 */
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

/**
 * Battery status component displaying icon, percentage, and tooltip time.
 * Uses centralized constants and pure functions for maintainability.
 */
const BatteryStatus: Component<BatteryStatusProps> = (props) => {
  /**
   * Wrap derived values with createMemo to keep them reactive.
   */
  const titleText = createMemo(() => formatBatteryTime(props.battery));
  const iconSrc = createMemo(() => getBatteryIconSrc(props.battery));
  const percent = createMemo(() =>
    Math.round(props.battery?.chargePercent ?? 0)
  );

  return (
    <div
      classList={{
        template: true,
        battery: true,
        [getBatteryUsageRate(props.battery?.chargePercent)]: true,
      }}
      title={titleText()}
    >
      <img
        src={iconSrc()}
        class="i-battery"
        width="20"
        height="20"
        alt="Battery status"
      />
      {percent()}%
    </div>
  );
};

export default BatteryStatus;
