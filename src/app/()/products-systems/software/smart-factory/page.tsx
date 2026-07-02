import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import CommonFaq from "@/components/faq/CommonFaq";
import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesSmartFactoryHero from "../../components/product/DevicesSmartFactoryHero";
import DevicesSmartFactoryOverview from "../../components/product/DevicesSmartFactoryOverview";
import DevicesProductApplications from "../../components/product/DevicesProductApplications";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesSoftwareHighlights from "../../components/product/DevicesSoftwareHighlights";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  smartFactoryApplicationsSection,
  smartFactoryBenefitsSection,
  smartFactoryDownloads,
  smartFactoryFaqItems,
  smartFactoryNavItems,
  smartFactoryOtherProducts,
  smartFactoryOtherProductsTitle,
  smartFactoryWhySection,
} from "../../data/smartFactoryContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function SmartFactoryProductPage() {
  return (
    <main
      className="devices-page devices-page--product devices-page--smart-factory"
      id="P-FO-PROD-040000P"
    >
      <DevicesSmartFactoryHero />
      <DevicesProductNavScope navItems={smartFactoryNavItems}>
        <DevicesSmartFactoryOverview />
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={smartFactoryBenefitsSection.title}
          items={smartFactoryBenefitsSection.items}
        />
        <DevicesProductApplications
          title={smartFactoryApplicationsSection.title}
          description={smartFactoryApplicationsSection.description}
          items={smartFactoryApplicationsSection.items}
        />
        <DevicesSoftwareHighlights
          title={smartFactoryWhySection.title}
          blocks={smartFactoryWhySection.blocks}
        />
        <DevicesProductDownloads items={smartFactoryDownloads} />
        <CommonBanner03 />
        <DevicesProductOtherProducts
          title={smartFactoryOtherProductsTitle}
          items={smartFactoryOtherProducts}
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
        items={smartFactoryFaqItems}
      />
    </main>
  );
}
