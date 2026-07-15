import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import DevicesPageFooter from "../../components/DevicesPageFooter";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesHvdcHero from "../../components/product/DevicesHvdcHero";
import DevicesHvdcOverview from "../../components/product/DevicesHvdcOverview";
import DevicesProductApplications from "../../components/product/DevicesProductApplications";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesProductWhy from "../../components/product/DevicesProductWhy";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcDownloads,
  hvdcFaqItems,
  hvdcNavItems,
  hvdcOtherProducts,
  hvdcOtherProductsTitle,
  hvdcWhySection,
} from "../../data/hvdcContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function HvdcProductPage() {
  return (
    <main
      className="devices-page devices-page--product devices-page--hvdc"
      id="Page_devices_hvdc"
    >
      <DevicesHvdcHero />
      <DevicesProductNavScope navItems={hvdcNavItems}>
        <DevicesHvdcOverview />
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={hvdcBenefitsSection.title}
          items={hvdcBenefitsSection.items}
        />
        <DevicesProductApplications
          title={hvdcApplicationsSection.title}
          description={hvdcApplicationsSection.description}
          items={hvdcApplicationsSection.items}
        />
        <DevicesProductWhy
          title={hvdcWhySection.title}
          blocks={hvdcWhySection.blocks}
        />
        <DevicesProductDownloads items={hvdcDownloads} />
        <CommonBanner03 />
        <DevicesProductOtherProducts
          title={hvdcOtherProductsTitle}
          items={hvdcOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={hvdcFaqItems} />
    </main>
  );
}
