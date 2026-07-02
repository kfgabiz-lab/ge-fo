import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import DevicesCategoryList from "../components/DevicesCategoryList";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesHelp from "../components/DevicesHelp";
import { motorControlHighlights } from "../data/motorControlContent";
import { vfdIntro, vfdProducts } from "../data/vfdContent";
import "@/assets/css/devices-systems.css";

export default function VariableFrequencyDrivePage() {
  return (
    <main className="devices-page" id="Page_devices_vfd">
      <DevicesCategoryList intro={vfdIntro} products={vfdProducts} />
      <DevicesHelp />
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
