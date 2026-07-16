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
  metasolMsDetail,
  metasolMsFaqItems,
  metasolMsNavItems,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

// route 폴더명 metasol-ms → seo.slug metasol-ms
const PRODUCT_SLUG = "metasol-ms";

export default async function MetasolMsProductPage() {
  const detail = await buildHwProductDetail(PRODUCT_SLUG, metasolMsDetail);

  return (
    <main className="devices-page devices-page--product" id="Page_devices_metasol_ms">
      <DevicesProductHero product={detail} />
      <DevicesProductNavScope navItems={metasolMsNavItems}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={detail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={metasolMsDetail.expertBannerHref}
          linkExternal={metasolMsDetail.expertBannerExternal}
          contactEmail={metasolMsDetail.expertContactEmail}
          backgroundSrc={metasolMsDetail.configuratorBannerBg}
        />
        <DevicesProductLineup
          table="metasol-ms"
          configuratorHref={metasolMsDetail.configuratorHref}
          configuratorExternal={metasolMsDetail.configuratorExternal}
        />
        <DevicesProductDownloads items={metasolMsDetail.downloads} />
        <CommonBanner03 />
        <DevicesProductVideo youtubeVideoId={metasolMsDetail.youtubeVideoId} />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={metasolMsFaqItems} />
    </main>
  );
}
