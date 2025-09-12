import "./style.css";
import { Component, createMemo } from "solid-js";
import { NetworkOutput, GlazeWmOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";
import WifiIcon from "./WifiIcon";

interface NetworkStatusProps {
  network: NetworkOutput;
  glazewm: GlazeWmOutput;
}

const ICON_BASE = "./assets/icons/";
const ICONS = {
  ethernet: "wired-network-32.png",
  noNetwork: "no-network-32.png",
} as const;

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
          <WifiIcon
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