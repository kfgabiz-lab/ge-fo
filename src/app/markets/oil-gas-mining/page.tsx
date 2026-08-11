import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsSolutionsPanel from "../components/MarketsSolutionsPanel";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { fetchMarketHighlightNews } from "@/data/highlightNews";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import {
  oilGasMiningBenefits,
  oilGasMiningHero,
  oilGasMiningIndustryTabs,
  oilGasMiningIntro,
  oilGasMiningReferences,
  oilGasMiningWhyItems,
} from "../data/marketsOilGasMiningContent";
import { oilGasMiningSolutionsPanel } from "../data/marketsOilGasMiningSolutionsPanel";
import { fetchMarketsFaqItems, MARKETS_FAQ_CODE } from "../data/marketsFaqData";
import {
  fetchMarketProducts,
  MARKETS_PRODUCTS_NAME,
} from "../data/marketsProductsData";
import "@/assets/css/markets.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { buildMarketsPageGraph } from "@/lib/structuredData/marketsGraph";

const PATHNAME = "/markets/oil-gas-mining";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function MarketsOilGasMiningPage() {
  const [faqItems, highlightNewsItems, productItems, meta] = await Promise.all([
    fetchMarketsFaqItems(MARKETS_FAQ_CODE.oilGasMining),
    fetchMarketHighlightNews(MARKETS_FAQ_CODE.oilGasMining),
    fetchMarketProducts(MARKETS_PRODUCTS_NAME.oilGasMining),
    fetchMenuMeta(PATHNAME),
  ]);
  const jsonLdGraph = buildMarketsPageGraph({
    pathname: PATHNAME,
    marketName: oilGasMiningHero.title,
    meta,
    faqItems,
    highlightItems: highlightNewsItems,
    productItems,
  });

  return (
    <main
      className="markets-page markets-page--oil-gas-mining"
      id="Page_markets_oil_gas_mining"
    >
      <JsonLd data={jsonLdGraph} />
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
