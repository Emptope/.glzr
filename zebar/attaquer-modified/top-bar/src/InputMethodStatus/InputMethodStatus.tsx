import "./style.css";
import { Component, createMemo } from "solid-js";
import { GlazeWmOutput, KeyboardOutput } from "zebar";
import { useAnimatedClick } from "../hooks/useAnimatedClick";

interface InputMethodStatusProps {
  glazewm: GlazeWmOutput;
  keyboard: KeyboardOutput;
}

/**
 * InputMethodStatus
 * Displays the current input method (keyboard layout) and opens the Windows input method switcher (Win+Space) when clicked.
 * - Uses zebar keyboard provider to read the current layout string (e.g. 'en-US'). 
 *   The label is derived into a compact form like EN/zh-CN/JA, etc. <mcreference link="https://github.com/glzr-io/zebar" index="2">2</mcreference>
 */
const InputMethodStatus: Component<InputMethodStatusProps> = (props) => {
  const { isActive, handleClick } = useAnimatedClick();

  // Map a full layout string (e.g. 'en-US') to a compact label.
  const toLabel = (layout?: string): string => {
    if (!layout) return "LANG";
    const lower = layout.toLowerCase();
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("en")) return "EN";
    if (lower.startsWith("ja")) return "JA";
    if (lower.startsWith("ko")) return "KO";
    if (lower.startsWith("ru")) return "RU";
    if (lower.startsWith("fr")) return "FR";
    if (lower.startsWith("de")) return "DE";
    if (lower.startsWith("es")) return "ES";
    return lower.slice(0, 2).toUpperCase();
  };

  // Derive label directly from keyboard provider output (reactive).
  const label = createMemo(() => toLabel(props.keyboard?.layout));

  const handleImeClick = () => {
    handleClick();
    // Open the Windows input method switcher via AutoHotkey (Win+Space)
    props.glazewm.runCommand(
      "shell-exec %userprofile%/.glzr/zebar/attaquer-modified/top-bar/dist/assets/scripts/OpenInputSwitcher.ahk",
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