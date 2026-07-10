import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsStats from "../components/MarketsStats";
import MarketsSolutionsPanel from "../components/MarketsSolutionsPanel";
import { industrialSolutionsPanel } from "../data/marketsIndustrialSolutionsPanel";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { marketsHighlightNewsItems } from "@/data/highlightNews";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import {
  industrialBenefits,
  industrialHero,
  industrialIndustryTabs,
  industrialIntro,
  industrialProducts,
  industrialReferences,
  industrialStats,
  industrialWhyItems,
} from "../data/marketsIndustrialContent";
import "@/assets/css/markets.css";

export default function MarketsIndustrialPage() {
  return (
    <main className="markets-page markets-page--industrial" id="Page_markets_industrial">
      <MarketsHero
        variant="key-visual"
        subtitle={industrialHero.subtitle}
        title={industrialHero.title}
        heroImage={industrialHero.heroImage}
      />
      <MarketsIntro
        titleLines={industrialIntro.titleLines}
        paragraphs={industrialIntro.paragraphs}
      />
      <MarketsStats items={industrialStats} />
      <MarketsExplore tabs={industrialIndustryTabs} defaultTabId="automotive" />
      <MarketsReferences items={industrialReferences} />
      <MarketsBenefits items={industrialBenefits} />
      <MarketsSolutionsPanel {...industrialSolutionsPanel} />
      <MarketsWhy items={industrialWhyItems} />
      <MarketsProducts items={industrialProducts} badgesType2Only />
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
