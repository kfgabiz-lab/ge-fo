import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import CommonFaq from "@/components/faq/CommonFaq";
import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesXemsHero from "../../components/product/DevicesXemsHero";
import DevicesXemsOverview from "../../components/product/DevicesXemsOverview";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesXemsEnergySolutions from "../../components/product/DevicesXemsEnergySolutions";
import DevicesSoftwareHighlights from "../../components/product/DevicesSoftwareHighlights";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  xemsBenefitsSection,
  xemsDownloads,
  xemsFaqItems,
  xemsNavItems,
  xemsOtherProducts,
  xemsOtherProductsTitle,
  xemsWhySection,
} from "../../data/xemsContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function XemsProductPage() {
  return (
    <main
      className="devices-page devices-page--product devices-page--xems"
      id="P-FO-PROD-040000P"
    >
      <DevicesXemsHero />
      <DevicesProductNavScope navItems={xemsNavItems}>
        <DevicesXemsOverview />
        <DevicesProductFeaturesSection
          variant="desc"
          sectionId="product-benefits"
          title={xemsBenefitsSection.title}
          items={xemsBenefitsSection.items}
        />
        <DevicesXemsEnergySolutions />
        <DevicesSoftwareHighlights
          title={xemsWhySection.title}
          blocks={xemsWhySection.blocks}
        />
        <DevicesProductDownloads items={xemsDownloads} />
        <CommonBanner03 />
        <DevicesProductOtherProducts
          title={xemsOtherProductsTitle}
          items={xemsOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <CommonBanner04 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={motorControlHighlights}
        sectionId="devices-highlights"
      />
      <CommonFaq
        sectionId="product-faq"
        defaultOpenIndex={-1}
        description={
          <>
            Find quick answers to common questions about installation, troubleshooting, and
            maintenance.
            <br />
            Our expert engineering team has curated these responses to help you optimize product
            performance.
          </>
        }
        items={xemsFaqItems}
      />
    </main>
  );
}
