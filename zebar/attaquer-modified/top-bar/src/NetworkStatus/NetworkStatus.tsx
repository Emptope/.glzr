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
  ethernet: "wired-network-32.png",
  noNetwork: "no-network-32.png",
} as const;

/**
 * Dynamic WiFi SVG icon component that shows signal strength with 3 bars
 * Based on the provided SVG design with signal strength thresholds:
 * 0-4: all bars dim
 * 5-44: only innermost bar lit
 * 45-74: inner and middle bars lit
 * 75-100: all bars lit
 */
const WifiSvgIcon: Component<{ signalStrength?: number; class?: string }> = (
  props
) => {
  const strength = props.signalStrength ?? 0;

  // Determine which bars should be lit based on signal strength
  const getBarOpacity = (barIndex: number): number => {
    if (strength >= 75) return 1; // All bars lit (75-100)
    if (strength >= 45 && barIndex <= 1) return 1; // Inner and middle bars lit (45-74)
    if (strength >= 5 && barIndex === 0) return 1; // Only inner bar lit (5-44)
    return 0.2; // Dim state (0-4 or unlit bars)
  };

  return (
    <svg
      class={props.class}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      {/* Outermost arc (bar 2) */}
      <path
        d="M0 352.832l93.12 98.752c231.296-245.44 606.464-245.44 837.76 0L1024 352.832C741.44 53.056 283.008 53.056 0 352.832z"
        fill="currentColor"
        opacity={getBarOpacity(2)}
      />
      {/* Middle arc (bar 1) */}
      <path
        d="M186.24 550.4l93.12 98.752c128.448-136.32 336.96-136.32 465.408 0L837.824 550.4c-179.648-190.592-471.488-190.592-651.648 0z"
        fill="currentColor"
        opacity={getBarOpacity(1)}
      />
      {/* Inner dot and arc (bar 0) */}
      <path
        d="M372.352 747.008L512 896l139.648-148.16c-76.8-81.92-202.048-81.92-279.296 0z"
        fill="currentColor"
        opacity={getBarOpacity(0)}
      />
    </svg>
  );
};

/**
 * Compute the network icon src path based on current network info.
 *
 * @param network - Network output object (can be undefined).
 * @returns Full icon src path for the network indicator.
 */
function getNetworkIconSrc(network?: NetworkOutput): string {
  const type = network?.defaultInterface?.type;
  if (type === "ethernet") return ICON_BASE + ICONS.ethernet;
  return ICON_BASE + ICONS.noNetwork;
}

/**
 * Get the CSS class name for the icon according to interface type.
 * Preserves legacy classes: "i-eth" for ethernet/unknown and "i-wifi" for Wi-Fi.
 *
 * @param network - Network output object (can be undefined).
 * @returns CSS class name for the icon element.
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
  const isWifi = createMemo(
    () => props.network?.defaultInterface?.type === "wifi"
  );
  const wifiStrength = createMemo(
    () => props.network?.defaultGateway?.signalStrength
  );

  return (
    <button
      class={`network ${isActive() ? "clicked-animated" : ""}`}
      onClick={handleOpenActionCenterClick}
    >
      <span class="content">
        {isWifi() ? (
          <WifiSvgIcon signalStrength={wifiStrength()} class={iconClass()} />
        ) : (
          <img
            src={iconSrc()}
            class={iconClass()}
            width="16"
            height="16"
            alt="Network status"
          />
        )}
        <div class="labels">
          <span class="label">
            <span class="ii"></span>
            <span class="net-line">
              {props.network?.traffic.received.siValue}{" "}
              {props.network?.traffic.received.siUnit}
            </span>
          </span>
          <span class="label">
            <span class="ii"></span>
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
