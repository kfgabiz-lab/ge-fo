import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsSolutionsPanel from "../components/MarketsSolutionsPanel";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { marketsHighlightNewsItems } from "../data/marketsHighlights";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import {
  oilGasMiningBenefits,
  oilGasMiningHero,
  oilGasMiningIndustryTabs,
  oilGasMiningIntro,
  oilGasMiningProducts,
  oilGasMiningReferences,
  oilGasMiningWhyItems,
} from "../data/marketsOilGasMiningContent";
import { oilGasMiningSolutionsPanel } from "../data/marketsOilGasMiningSolutionsPanel";
import "@/assets/css/markets.css";

export default function MarketsOilGasMiningPage() {
  return (
    <main
      className="markets-page markets-page--oil-gas-mining"
      id="Page_markets_oil_gas_mining"
    >
      <MarketsHero
        variant="key-visual"
        subtitle={oilGasMiningHero.subtitle}
        title={oilGasMiningHero.title}
        heroImage={oilGasMiningHero.heroImage}
      />
      <MarketsIntro
        titleLines={oilGasMiningIntro.titleLines}
        text={oilGasMiningIntro.text}
      />
      <MarketsExplore tabs={oilGasMiningIndustryTabs} />
      <MarketsReferences items={oilGasMiningReferences} />
      <MarketsBenefits items={oilGasMiningBenefits} />
      <MarketsSolutionsPanel {...oilGasMiningSolutionsPanel} />
      <MarketsWhy items={oilGasMiningWhyItems} />
      <MarketsProducts items={oilGasMiningProducts} badgesType2Only />
      <CommonBanner01 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={marketsHighlightNewsItems}
        sectionId="markets-highlights"
      />
      <MarketsFaq />
    </main>
  );
}
