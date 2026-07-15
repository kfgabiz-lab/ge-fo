import DevicesCategoryList from "../components/DevicesCategoryList";
import DevicesHelp from "../components/DevicesHelp";
import DevicesMarkets from "../components/DevicesMarkets";
import DevicesPageFooter from "../components/DevicesPageFooter";
import {
  lvAutomationIntro,
  lvAutomationProducts,
} from "../data/lvAutomationContent";
import "@/assets/css/devices-systems.css";

export default function LvAutomationPage() {
  return (
    <main className="devices-page" id="Page_devices_lv_automation">
      <DevicesCategoryList
        layout="stacked"
        intro={lvAutomationIntro}
        products={lvAutomationProducts}
      />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter />
    </main>
  );
}
