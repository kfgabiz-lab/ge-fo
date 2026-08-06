import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsSolutionsPanel from "../components/MarketsSolutionsPanel";
import { commercialSolutionsPanel } from "../data/marketsCommercialSolutionsPanel";
import MarketsStats from "../components/MarketsStats";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { fetchMarketHighlightNews } from "@/data/highlightNews";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import { commercialResidentialHero } from "../data/marketsContent";
import {
  commercialResidentialBenefits,
  commercialResidentialIntro,
  commercialResidentialReferences,
  commercialResidentialStats,
  commercialResidentialWhyItems,
} from "../data/marketsCommercialResidentialContent";
import { fetchMarketsFaqItems, MARKETS_FAQ_CODE } from "../data/marketsFaqData";
import {
  fetchMarketProducts,
  MARKETS_PRODUCTS_NAME,
} from "../data/marketsProductsData";
import "@/assets/css/markets.css";
import type { Metadata, ResolvingMetadata } from "next";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/markets/commercial-residential", parent);
}

export default async function MarketsCommercialResidentialPage() {
  const [faqItems, highlightNewsItems, productItems] = await Promise.all([
    fetchMarketsFaqItems(MARKETS_FAQ_CODE.commercialResidential),
    fetchMarketHighlightNews(MARKETS_FAQ_CODE.commercialResidential),
    fetchMarketProducts(MARKETS_PRODUCTS_NAME.commercialResidential),
  ]);

  return (
    <main className="markets-page markets-page--commercial-residential" id="Page_markets">
      <MarketsHero
        variant="key-visual"
        subtitle={commercialResidentialHero.subtitle}
        title={commercialResidentialHero.title}
        heroImage={commercialResidentialHero.heroImage}
        secondaryCta={commercialResidentialHero.secondaryCta}
      />
      <MarketsIntro
        titleLines={commercialResidentialIntro.titleLines}
        text={commercialResidentialIntro.text}
      />
      <MarketsStats items={commercialResidentialStats} />
      <MarketsExplore
        defaultTabId="hotels"
        sectionDesc="Tailored electrical infrastructure solutions for every architectural requirement."
      />
      <MarketsReferences items={commercialResidentialReferences} />
      <MarketsBenefits items={commercialResidentialBenefits} />
      <MarketsSolutionsPanel {...commercialSolutionsPanel} />
      <MarketsWhy items={commercialResidentialWhyItems} />
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
