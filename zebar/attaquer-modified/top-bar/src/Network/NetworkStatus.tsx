import "./style.css";
import { Component, createMemo } from "solid-js";
import { NetworkOutput, GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface NetworkStatusProps {
  network: NetworkOutput;
  glazewm: GlazeWmOutput;
}

const ICON_BASE = "./assets/icons/";
const ICONS = {
  ethernet: "wired-network-32.png",
  noNetwork: "no-network-32.png",
} as const;

const WifiIcons: Component<{
  signalStrength?: number;
  isConnected?: boolean;
  class?: string;
}> = (props) => {
  const strength = props.signalStrength ?? 0;
  const isConnected = props.isConnected ?? true;

  const getBarOpacity = (barIndex: number): number => {
    if (!isConnected) return 0.3;
    if (strength >= 75) return 1;
    if (strength >= 45 && barIndex <= 1) return 1;
    if (strength >= 5 && barIndex === 0) return 1;
    return 0.2;
  };

  return (
    <svg
      class={props.class}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <path
        d="M0 352.832l93.12 98.752c231.296-245.44 606.464-245.44 837.76 0L1024 352.832C741.44 53.056 283.008 53.056 0 352.832z"
        fill="currentColor"
        opacity={getBarOpacity(2)}
      />
      <path
        d="M186.24 550.4l93.12 98.752c128.448-136.32 336.96-136.32 465.408 0L837.824 550.4c-179.648-190.592-471.488-190.592-651.648 0z"
        fill="currentColor"
        opacity={getBarOpacity(1)}
      />
      <path
        d="M372.352 747.008L512 896l139.648-148.16c-76.8-81.92-202.048-81.92-279.296 0z"
        fill="currentColor"
        opacity={getBarOpacity(0)}
      />
      {!isConnected && (
        <path
          d="M64 64l896 896-64 64L0 128z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
        />
      )}
    </svg>
  );
};

const NetworkStatus: Component<NetworkStatusProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  const handleOpenActionCenterClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/attaquer-modified/top-bar/dist/assets/scripts/OpenActionCenter.ahk"
    );
  };

  const isWifi = createMemo(
    () => props.network?.defaultInterface?.type === "wifi"
  );

  const isWifiConnected = createMemo(
    () => isWifi() && props.network?.defaultGateway !== null && props.network?.defaultGateway !== undefined
  );

  const wifiStrength = createMemo(
    () => props.network?.defaultGateway?.signalStrength
  );

  const getNetworkIcon = () => {
    const networkType = props.network?.defaultInterface?.type;

    switch (networkType) {
      case "ethernet":
        return (
          <img
            src={ICON_BASE + ICONS.ethernet}
            class="i-eth"
            width="16"
            height="16"
            alt="Ethernet"
          />
        );
      case "wifi":
        return (
          <WifiIcons
            signalStrength={wifiStrength()}
            isConnected={isWifiConnected()}
            class="i-wifi"
          />
        );
      default:
        return (
          <img
            src={ICON_BASE + ICONS.noNetwork}
            class="i-eth"
            width="16"
            height="16"
            alt="No network"
          />
        );
    }
  };

  return (
    <button
      class={`network ${isActive() ? "clicked-animated" : ""}`}
      onClick={handleOpenActionCenterClick}
    >
      <span class="content">
        {getNetworkIcon()}
      </span>
    </button>
  );
};

export default NetworkStatus;