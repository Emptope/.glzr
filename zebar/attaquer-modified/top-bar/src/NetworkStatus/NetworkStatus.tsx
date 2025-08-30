import "./style.css";
import { Component, createMemo } from "solid-js";
import { NetworkOutput, GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface NetworkStatusProps {
  network: NetworkOutput;
  glazewm: GlazeWmOutput;
}

/** Base folder for network icons */
const ICON_BASE = "./assets/icons/";
/** Icon file names for different network states/levels */
const ICONS = {
  ethernet: "icons8-wired-network-32.png",
  wifi3: "icons8-wifi-3-32.png",
  wifi2: "icons8-wifi-2-32.png",
  wifi1: "icons8-wifi-1-32.png",
  noNetwork: "icons8-no-network-32.png",
} as const;

/**
 * Get Wi-Fi icon filename by signal strength threshold.
 *
 * @param signalStrength - Wi-Fi signal strength (0-100). If undefined, treated as 0.
 * @returns Icon filename for the Wi-Fi signal.
 */
function getWifiIconBySignal(signalStrength?: number): string {
  const s = signalStrength ?? 0;
  if (s >= 75) return ICONS.wifi3;
  if (s >= 45) return ICONS.wifi2;
  if (s >= 5) return ICONS.wifi1;
  return ICONS.noNetwork;
}

/**
 * Compute the network icon src path based on current network info.
 *
 * @param network - Network output object (can be undefined).
 * @returns Full icon src path for the network indicator.
 */
function getNetworkIconSrc(network?: NetworkOutput): string {
  const type = network?.defaultInterface?.type;
  if (type === "ethernet") return ICON_BASE + ICONS.ethernet;
  if (type === "wifi") {
    const strength = network?.defaultGateway?.signalStrength;
    return ICON_BASE + getWifiIconBySignal(strength);
  }
  return ICON_BASE + ICONS.noNetwork;
}

/**
 * Get the CSS class name for the icon according to interface type.
 * Preserves legacy classes: "i-eth" for ethernet/unknown and "i-wifi" for Wi-Fi.
 *
 * @param network - Network output object (can be undefined).
 * @returns CSS class name for the <img> element.
 */
function getNetworkIconClass(network?: NetworkOutput): string {
  return network?.defaultInterface?.type === "wifi" ? "i-wifi" : "i-eth";
}

/**
 * Network status component rendering icon, traffic stats, and action center opener.
 * Uses centralized constants and pure helper functions for maintainability.
 */
const NetworkStatus: Component<NetworkStatusProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  /**
   * Handle click to open Windows Action Center via AHK script.
   */
  const handleOpenActionCenterClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/attaquer-modified/top-bar/dist/assets/scripts/OpenActionCenter.ahk"
    );
  };

  /**
   * Derived values wrapped with createMemo to stay reactive to props updates.
   */
  const iconSrc = createMemo(() => getNetworkIconSrc(props.network));
  const iconClass = createMemo(() => getNetworkIconClass(props.network));

  return (
    <button
      class={`network ${isActive() ? "clicked-animated" : ""}`}
      onClick={handleOpenActionCenterClick}
    >
      <span class="content">
        <img
          src={iconSrc()}
          class={iconClass()}
          width="20"
          height="20"
          alt="Network status"
        />
        <div class="labels">
          <span class="label">
            <span class="ii"></span>
            <span class="net-line">
              {props.network?.traffic.received.siValue}{" "}
              {props.network?.traffic.received.siUnit}
            </span>
          </span>
          <span class="label">
            <span class="ii"></span>
            <span class="net-line">
              {props.network?.traffic.transmitted.siValue}{" "}
              {props.network?.traffic.transmitted.siUnit}
            </span>
          </span>
        </div>
      </span>
    </button>
  );
};

export default NetworkStatus;