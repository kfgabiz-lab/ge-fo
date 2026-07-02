import CommonBanner01 from "@/components/banners/CommonBanner01";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsFaq from "../components/MarketsFaq";
import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsProducts from "../components/MarketsProducts";
import MarketsReferences from "../components/MarketsReferences";
import MarketsSolutions from "../components/MarketsSolutions";
import MarketsStats from "../components/MarketsStats";
import MarketsWhy from "../components/MarketsWhy";
import {
  dataCenterBenefits,
  dataCenterFaqItems,
  dataCenterHero,
  dataCenterIntro,
  dataCenterProducts,
  dataCenterReferences,
  dataCenterStats,
  dataCenterWhyDescription,
  dataCenterWhyItems,
} from "../data/marketsDataCenterContent";
import { marketsHighlightNewsItems } from "../data/marketsHighlights";
import "@/assets/css/markets.css";

export default function MarketsDataCenterPage() {
  return (
    <main className="markets-page markets-page--data-center" id="Page_markets_data_center">
      <MarketsHero
        variant="key-visual"
        subtitle={dataCenterHero.subtitle}
        title={dataCenterHero.title}
        heroImage={dataCenterHero.heroImage}
      />
      <MarketsIntro
        titleLines={dataCenterIntro.titleLines}
        text={dataCenterIntro.text}
      />
      <MarketsStats items={dataCenterStats} />
      <MarketsReferences items={dataCenterReferences} />
      <MarketsBenefits items={dataCenterBenefits} />
      <MarketsSolutions />
      <MarketsWhy items={dataCenterWhyItems} description={dataCenterWhyDescription} />
      <MarketsProducts items={dataCenterProducts} badgesType2Only />
      <CommonBanner01 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={marketsHighlightNewsItems}
        sectionId="markets-highlights"
      />
      <MarketsFaq items={dataCenterFaqItems} />
    </main>
  );
}
