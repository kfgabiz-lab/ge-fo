import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesHelp from "../components/DevicesHelp";
import DevicesHero from "../components/DevicesHero";
import DevicesMarkets from "../components/DevicesMarkets";
import { motorControlHighlights } from "../data/motorControlContent";
import "@/assets/css/devices-systems.css";

export default function MotorControlPage() {
  return (
    <main className="devices-page" id="Page_devices_motor_control">
      <DevicesHero withProducts />
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
