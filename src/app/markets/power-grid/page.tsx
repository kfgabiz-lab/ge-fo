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
import { fetchMarketHighlightNews } from "@/data/highlightNews";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import {
  powerGridBenefits,
  powerGridHero,
  powerGridIndustryTabs,
  powerGridIntro,
  powerGridReferences,
  powerGridSmartGridOperation,
  powerGridSmartGridUseCases,
  powerGridSustainabilityCards,
  powerGridWhyItems,
} from "../data/marketsPowerGridContent";
import { fetchMarketsFaqItems, MARKETS_FAQ_CODE } from "../data/marketsFaqData";
import {
  fetchMarketProducts,
  MARKETS_PRODUCTS_NAME,
} from "../data/marketsProductsData";
import "@/assets/css/markets.css";

export default async function MarketsPowerGridPage() {
  const [faqItems, highlightNewsItems, productItems] = await Promise.all([
    fetchMarketsFaqItems(MARKETS_FAQ_CODE.powerGrid),
    fetchMarketHighlightNews(MARKETS_FAQ_CODE.powerGrid),
    fetchMarketProducts(MARKETS_PRODUCTS_NAME.powerGrid),
  ]);

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
        text={powerGridIntro.text}
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
      <MarketsProducts items={productItems} badgesType2Only />
      <CommonBanner01 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={highlightNewsItems}
        sectionId="markets-highlights"
      />
      <MarketsFaq items={faqItems} />
    </main>
  );
}
