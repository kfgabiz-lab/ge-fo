import DevicesCategoryList from "../components/DevicesCategoryList";
import DevicesHelp from "../components/DevicesHelp";
import DevicesPageFooter from "../components/DevicesPageFooter";
import { vfdIntro, vfdProducts } from "../data/vfdContent";
import "@/assets/css/devices-systems.css";

export default function VariableFrequencyDrivePage() {
  return (
    <main className="devices-page" id="Page_devices_vfd">
      <DevicesCategoryList intro={vfdIntro} products={vfdProducts} />
      <DevicesHelp />
      <DevicesPageFooter />
    </main>
  );
}
