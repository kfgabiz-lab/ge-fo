import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import DevicesPageFooter from "../../components/DevicesPageFooter";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesXemsHero from "../../components/product/DevicesXemsHero";
import DevicesXemsOverview from "../../components/product/DevicesXemsOverview";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesXemsEnergySolutions from "../../components/product/DevicesXemsEnergySolutions";
import DevicesSoftwareHighlights from "../../components/product/DevicesSoftwareHighlights";
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
      <DevicesPageFooter faqItems={xemsFaqItems} />
    </main>
  );
}
