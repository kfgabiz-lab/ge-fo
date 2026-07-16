import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import DevicesPageFooter from "../../components/DevicesPageFooter";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductHero from "../../components/product/DevicesProductHero";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductLineup from "../../components/product/DevicesProductLineup";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import {
  susolUlSmartMccbDetail,
  susolUlSmartMccbFaqItems,
  susolUlSmartMccbNavItems,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

// route 폴더명 susol-ul-smart-mccb → seo.slug susol-ul-smart-mccb
const PRODUCT_SLUG = "susol-ul-smart-mccb";

export default async function SusolUlSmartMccbProductPage() {
  const detail = await buildHwProductDetail(
    PRODUCT_SLUG,
    susolUlSmartMccbDetail,
  );

  return (
    <main
      className="devices-page devices-page--product"
      id="Page_devices_susol_ul_smart_mccb"
    >
      <DevicesProductHero product={detail} />
      <DevicesProductNavScope navItems={susolUlSmartMccbNavItems}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={detail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={susolUlSmartMccbDetail.expertBannerHref}
          linkExternal={susolUlSmartMccbDetail.expertBannerExternal}
          contactEmail={susolUlSmartMccbDetail.expertContactEmail}
          backgroundSrc={susolUlSmartMccbDetail.configuratorBannerBg}
        />
        <DevicesProductLineup
          table="susol-frame"
          configuratorHref={susolUlSmartMccbDetail.configuratorHref}
          configuratorExternal={susolUlSmartMccbDetail.configuratorExternal}
        />
        <DevicesProductDownloads items={susolUlSmartMccbDetail.downloads} />
        <CommonBanner03 />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={susolUlSmartMccbFaqItems} />
    </main>
  );
}
