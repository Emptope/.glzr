import "./style.css";
import { Component, createMemo, Show } from "solid-js";
import { GlazeWmOutput } from "zebar";

interface WindowTitleProps {
  glazewm: GlazeWmOutput;
}

const WindowTitle: Component<WindowTitleProps> = (props) => {
  const focusedWindowTitle = createMemo(() => {
    const focusedWorkspace = props.glazewm?.focusedWorkspace;
    if (!focusedWorkspace?.children) return null;

    const focusedWindow = focusedWorkspace.children.find(
      (item) => "title" in item && item.hasFocus
    );

    if (!focusedWindow || !("title" in focusedWindow) || !focusedWindow.title) {
      return null;
    }

    const title = focusedWindow.title;
    return title.length > 90 ? `${title.slice(0, 90)}...` : title;
  });

  return (
    <Show when={focusedWindowTitle()}>
      <div class="current-window">
        {focusedWindowTitle()}
      </div>
    </Show>
  );
};

export default WindowTitle;
