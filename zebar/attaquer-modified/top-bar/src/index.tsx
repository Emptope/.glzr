/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";
import * as zebar from "zebar";
import WindowsButton from "./Buttons/WindowsButton";
import SearchButton from "./Buttons/SearchButton";
import Workspaces from "./Workspaces/Workspaces";
import TilingBinding from "./TilingBinding/TilingBinding";
import WindowTitle from "./WindowTitle/WindowTitle";
import MediaStatus from "./Media/MediaStatus";
import CurrentApps from "./CurrentApps/CurrentApps";
import Systray from "./Systray/Systray";
import InputMethodStatus from "./InputMethodStatus/InputMethodStatus";
import CpuStatus from "./CpuStatus/CpuStatus";
import MemoryStatus from "./MemoryStatus/MemoryStatus";
import WeatherStatus from "./WeatherStatus/WeatherStatus";
import VolumeStatus from "./VolumeStatus/VolumeStatus";
import NetworkStatus from "./NetworkStatus/NetworkStatus";
import BatteryStatus from "./BatteryStatus/BatteryStatus";
import TimeStatus from "./Time/TimeStatus";

const providers = zebar.createProviderGroup({
  glazewm: { type: "glazewm"},
  keyboard: { type: "keyboard" },
  cpu: { type: "cpu", refreshInterval: 5000 },
  memory: { type: "memory", refreshInterval: 5000 },
  weather: { type: "weather" },
  network: { type: "network", refreshInterval: 5000 },
  // audio: { type: "audio" },
  battery: { type: "battery", refreshInterval: 10000 },
  date: { type: "date", formatting: "HH:mm ccc d LLLL y" },
  media: { type: "media" },
  systray: { type: "systray" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  const [output, setOutput] = createStore(providers.outputMap);

  providers.onOutput((outputMap) => setOutput(outputMap));

  return (
    <div class="app">
      <div class="left">
        <WindowsButton glazewm={output.glazewm} />
        <SearchButton glazewm={output.glazewm} />
        <Workspaces glazewm={output.glazewm} />
        <TilingBinding glazewm={output.glazewm} />
        <MediaStatus media={output.media} />
      </div>
      <div class="center">
        <CurrentApps glazewm={output.glazewm} />
        {/* <WindowTitle glazewm={output.glazewm} /> */}
      </div>
      <div class="right">
        <Systray systray={output.systray} glazewm={output.glazewm} />
        <InputMethodStatus glazewm={output.glazewm} keyboard={output.keyboard} />
        <CpuStatus cpu={output.cpu} glazewm={output.glazewm} />
        <MemoryStatus memory={output.memory} />
        {output.weather && <WeatherStatus weather={output.weather} />}
        <NetworkStatus network={output.network} glazewm={output.glazewm} />
        {/* <VolumeStatus audio={output.audio} glazewm={output.glazewm} /> */}
        <BatteryStatus battery={output.battery} />
        <TimeStatus date={output.date} glazewm={output.glazewm} />
      </div>
    </div>
  );
}
