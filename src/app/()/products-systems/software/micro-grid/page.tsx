import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import DevicesPageFooter from "../../components/DevicesPageFooter";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesMicroGridHero from "../../components/product/DevicesMicroGridHero";
import DevicesMicroGridOverview from "../../components/product/DevicesMicroGridOverview";
import DevicesProductApplications from "../../components/product/DevicesProductApplications";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesMicroGridHighlights from "../../components/product/DevicesMicroGridHighlights";
import {
  microGridApplicationsSection,
  microGridBenefitsSection,
  microGridDownloads,
  microGridFaqItems,
  microGridNavItems,
  microGridOtherProducts,
  microGridOtherProductsTitle,
} from "../../data/microGridContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function MicroGridProductPage() {
  return (
    <main
      className="devices-page devices-page--product devices-page--micro-grid"
      id="P-FO-PROD-040000P"
    >
      <DevicesMicroGridHero />
      <DevicesProductNavScope navItems={microGridNavItems}>
        <DevicesMicroGridOverview />
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={microGridBenefitsSection.title}
          items={microGridBenefitsSection.items}
        />
        <DevicesProductApplications
          title={microGridApplicationsSection.title}
          description={microGridApplicationsSection.description}
          items={microGridApplicationsSection.items}
        />
        <DevicesMicroGridHighlights />
        <DevicesProductDownloads items={microGridDownloads} />
        <CommonBanner03 />
        <DevicesProductOtherProducts
          title={microGridOtherProductsTitle}
          items={microGridOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={microGridFaqItems} />
    </main>
  );
}
