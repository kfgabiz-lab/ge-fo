import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsSustainability from "../components/MarketsSustainability";
import MarketsSmartGrid from "../components/MarketsSmartGrid";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { marketsHighlightNewsItems } from "@/data/highlightNews";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import {
  powerGridBenefits,
  powerGridHero,
  powerGridIndustryTabs,
  powerGridIntro,
  powerGridProducts,
  powerGridReferences,
  powerGridSmartGridOperation,
  powerGridSmartGridUseCases,
  powerGridSustainabilityCards,
  powerGridWhyItems,
} from "../data/marketsPowerGridContent";
import { fetchMarketsFaqItems, MARKETS_FAQ_CODE } from "../data/marketsFaqData";
import "@/assets/css/markets.css";

export default async function MarketsPowerGridPage() {
  // Power Grid FAQ(markets=004) 조회 → MarketsFaq 에 items 로 전달
  const faqItems = await fetchMarketsFaqItems(MARKETS_FAQ_CODE.powerGrid);

  return (
    <main
      className="markets-page markets-page--power-grid"
      id="Page_markets_power_grid"
    >
      <MarketsHero
        variant="key-visual"
        subtitle={powerGridHero.subtitle}
        title={powerGridHero.title}
        heroImage={powerGridHero.heroImage}
      />
      <MarketsIntro
        titleLines={powerGridIntro.titleLines}
        paragraphs={powerGridIntro.paragraphs}
      />
      <MarketsExplore tabs={powerGridIndustryTabs} layout="wide-tabs" />
      <MarketsReferences items={powerGridReferences} />
      <MarketsBenefits items={powerGridBenefits} />
      <MarketsSustainability cards={powerGridSustainabilityCards} />
      <MarketsSmartGrid
        useCases={powerGridSmartGridUseCases}
        operationItems={powerGridSmartGridOperation}
      />
      <MarketsWhy items={powerGridWhyItems} />
      <MarketsProducts items={powerGridProducts} badgesType2Only />
      <CommonBanner01 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={marketsHighlightNewsItems}
        sectionId="markets-highlights"
      />
      <MarketsFaq items={faqItems} />
    </main>
  );
}
