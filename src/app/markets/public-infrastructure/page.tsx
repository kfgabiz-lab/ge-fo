import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsSolutionsPanel from "../components/MarketsSolutionsPanel";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { marketsHighlightNewsItems } from "@/data/highlightNews";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import {
  publicInfrastructureBenefits,
  publicInfrastructureHero,
  publicInfrastructureIndustryTabs,
  publicInfrastructureIntro,
  publicInfrastructureProducts,
  publicInfrastructureReferences,
  publicInfrastructureWhyItems,
} from "../data/marketsPublicInfrastructureContent";
import { publicInfrastructureSolutionsPanel } from "../data/marketsPublicInfrastructureSolutionsPanel";
import { fetchMarketsFaqItems, MARKETS_FAQ_CODE } from "../data/marketsFaqData";
import "@/assets/css/markets.css";

export default async function MarketsPublicInfrastructurePage() {
  // Public Infrastructure FAQ(markets=002) 조회 → MarketsFaq 에 items 로 전달
  const faqItems = await fetchMarketsFaqItems(
    MARKETS_FAQ_CODE.publicInfrastructure,
  );

  return (
    <main
      className="markets-page markets-page--public-infrastructure"
      id="Page_markets_public_infrastructure"
    >
      <MarketsHero
        variant="key-visual"
        subtitle={publicInfrastructureHero.subtitle}
        title={publicInfrastructureHero.title}
        heroImage={publicInfrastructureHero.heroImage}
      />
      <MarketsIntro
        titleLines={publicInfrastructureIntro.titleLines}
        text={publicInfrastructureIntro.text}
      />
      <MarketsExplore tabs={publicInfrastructureIndustryTabs} />
      <MarketsReferences items={publicInfrastructureReferences} />
      <MarketsBenefits items={publicInfrastructureBenefits} />
      <MarketsSolutionsPanel {...publicInfrastructureSolutionsPanel} />
      <MarketsWhy items={publicInfrastructureWhyItems} />
      <MarketsProducts items={publicInfrastructureProducts} badgesType2Only />
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
