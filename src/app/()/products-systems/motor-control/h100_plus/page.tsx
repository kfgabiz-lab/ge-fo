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
import DevicesProductVideo from "../../components/product/DevicesProductVideo";
import {
  h100PlusDetail,
  h100PlusFaqItems,
  h100PlusNavItems,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

// route 폴더명 h100_plus → seo.slug h100-plus 정규화(_→-)
const PRODUCT_SLUG = "h100-plus";

export default async function H100PlusProductPage() {
  const detail = await buildHwProductDetail(PRODUCT_SLUG, h100PlusDetail);

  return (
    <main className="devices-page devices-page--product" id="Page_devices_h100_plus">
      <DevicesProductHero product={detail} />
      <DevicesProductNavScope navItems={h100PlusNavItems}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={detail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={h100PlusDetail.expertBannerHref}
          linkExternal={h100PlusDetail.expertBannerExternal}
          contactEmail={h100PlusDetail.expertContactEmail}
          backgroundSrc={h100PlusDetail.configuratorBannerBg}
        />
        <DevicesProductLineup
          table="h100-plus"
          configuratorHref={h100PlusDetail.configuratorHref}
          configuratorExternal={h100PlusDetail.configuratorExternal}
        />
        <DevicesProductDownloads items={h100PlusDetail.downloads} />
        <CommonBanner03 />
        <DevicesProductVideo youtubeVideoId={h100PlusDetail.youtubeVideoId} />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={h100PlusFaqItems} />
    </main>
  );
}
