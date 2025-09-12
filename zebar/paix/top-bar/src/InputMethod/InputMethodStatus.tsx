import "./style.css";
import { Component, createMemo } from "solid-js";
import { GlazeWmOutput, KeyboardOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface InputMethodStatusProps {
  glazewm: GlazeWmOutput;
  keyboard: KeyboardOutput;
}

const InputMethodStatus: Component<InputMethodStatusProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  const toLabel = (layout?: string): string => {
    if (!layout) return "LANG";
    const lower = layout.toLowerCase();
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("ja")) return "ja";
    if (lower.startsWith("ko")) return "ko";
    if (lower.startsWith("ru")) return "ru";
    if (lower.startsWith("fr")) return "fr";
    if (lower.startsWith("de")) return "de";
    if (lower.startsWith("es")) return "es";
    return lower.slice(0, 2).toUpperCase();
  };

  const label = createMemo(() => toLabel(props.keyboard?.layout));

  const handleImeClick = () => {
    handleClick();
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/paix/top-bar/dist/assets/scripts/OpenInputSwitcher.ahk",
    );
  };

  return (
    <button
      classList={{
        "input-method": true,
        "clicked-animated": isActive(),
      }}
      onClick={handleImeClick}
      title={props.keyboard?.layout || "Input Method"}
    >
      <span class="content">
        <span class="label">{label()}</span>
      </span>
    </button>
  );
};

export default InputMethodStatus;