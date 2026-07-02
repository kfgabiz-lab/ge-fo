import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import DevicesCategoryList from "../components/DevicesCategoryList";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesHelp from "../components/DevicesHelp";
import DevicesMarkets from "../components/DevicesMarkets";
import { motorControlHighlights } from "../data/motorControlContent";
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
      <CommonBanner04 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={motorControlHighlights}
        sectionId="devices-highlights"
      />
    </main>
  );
}
