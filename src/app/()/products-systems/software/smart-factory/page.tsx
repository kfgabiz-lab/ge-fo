import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import DevicesPageFooter from "../../components/DevicesPageFooter";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesSmartFactoryHero from "../../components/product/DevicesSmartFactoryHero";
import DevicesSmartFactoryOverview from "../../components/product/DevicesSmartFactoryOverview";
import DevicesProductApplications from "../../components/product/DevicesProductApplications";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesSoftwareHighlights from "../../components/product/DevicesSoftwareHighlights";
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
          description={smartFactoryWhySection.description}
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
      <DevicesPageFooter faqItems={smartFactoryFaqItems} />
    </main>
  );
}
