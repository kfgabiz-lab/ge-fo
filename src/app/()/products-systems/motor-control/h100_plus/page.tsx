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
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function H100PlusProductPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_h100_plus">
      <DevicesProductHero product={h100PlusDetail} />
      <DevicesProductNavScope navItems={h100PlusNavItems}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={h100PlusDetail.keyFeatures}
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
