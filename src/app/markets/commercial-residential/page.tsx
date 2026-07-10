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
import { marketsHighlightNewsItems } from "@/data/highlightNews";
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
import "@/assets/css/markets.css";

export default function MarketsCommercialResidentialPage() {
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
        items={marketsHighlightNewsItems}
        sectionId="markets-highlights"
      />
      <MarketsFaq />
    </main>
  );
}
