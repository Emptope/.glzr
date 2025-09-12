import { Component } from "solid-js";

interface WifiIconProps {
  signalStrength?: number;
  isConnected?: boolean;
  class?: string;
  width?: number;
  height?: number;
}

const WifiIcon: Component<WifiIconProps> = (props) => {
  const strength = () => props.signalStrength ?? 0;
  const isConnected = () => props.isConnected ?? true;
  const width = () => props.width ?? 16;
  const height = () => props.height ?? 16;

  const getBarOpacity = (barIndex: number): number => {
    if (!isConnected()) return 0.3;
    const currentStrength = strength();
    if (currentStrength >= 75) return 1;
    if (currentStrength >= 45 && barIndex <= 1) return 1;
    if (currentStrength >= 5 && barIndex === 0) return 1;
    return 0.2;
  };

  return (
    <svg
      class={props.class}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width={width()}
      height={height()}
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
      {!isConnected() && (
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

export default WifiIcon;