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
  commercialResidentialProducts,
  commercialResidentialReferences,
  commercialResidentialStats,
} from "../data/marketsCommercialResidentialContent";
import { fetchMarketsFaqItems, MARKETS_FAQ_CODE } from "../data/marketsFaqData";
import "@/assets/css/markets.css";

export default async function MarketsCommercialResidentialPage() {
  // Commercial & Residential FAQ(markets=006) + 하이라이트 뉴스(자기 market=006 포함 press/blog/articles 통합 최신 3건) 병렬 조회
  const [faqItems, highlightNewsItems] = await Promise.all([
    fetchMarketsFaqItems(MARKETS_FAQ_CODE.commercialResidential),
    fetchMarketHighlightNews(MARKETS_FAQ_CODE.commercialResidential),
  ]);

  return (
    <main className="markets-page markets-page--commercial-residential" id="Page_markets">
      <MarketsHero
        variant="key-visual"
        subtitle={commercialResidentialHero.subtitle}
        title={commercialResidentialHero.title}
        titleLines={commercialResidentialHero.titleLines}
        heroImage={commercialResidentialHero.heroImage}
        secondaryCta={commercialResidentialHero.secondaryCta}
      />
      <MarketsIntro titleLines={commercialResidentialIntro.titleLines} />
      <MarketsStats items={commercialResidentialStats} />
      <MarketsExplore
        defaultTabId="commercial"
        sectionDesc="Tailored electrical infrastructure solutions for every architectural requirement."
      />
      <MarketsReferences items={commercialResidentialReferences} />
      <MarketsBenefits items={commercialResidentialBenefits} />
      <MarketsSolutionsPanel {...commercialSolutionsPanel} />
      <MarketsWhy />
      <MarketsProducts items={commercialResidentialProducts} badgesType2Only />
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
