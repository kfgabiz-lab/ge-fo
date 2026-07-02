import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import CommonFaq from "@/components/faq/CommonFaq";
import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductHero from "../../components/product/DevicesProductHero";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductLineup from "../../components/product/DevicesProductLineup";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  susolUlSmartMccbDetail,
  susolUlSmartMccbFaqItems,
  susolUlSmartMccbNavItems,
} from "../../data/productDetailContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function SusolUlSmartMccbProductPage() {
  return (
    <main
      className="devices-page devices-page--product"
      id="Page_devices_susol_ul_smart_mccb"
    >
      <DevicesProductHero product={susolUlSmartMccbDetail} />
      <DevicesProductNavScope navItems={susolUlSmartMccbNavItems}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={susolUlSmartMccbDetail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={susolUlSmartMccbDetail.expertBannerHref}
          linkExternal={susolUlSmartMccbDetail.expertBannerExternal}
          contactEmail={susolUlSmartMccbDetail.expertContactEmail}
          backgroundSrc={susolUlSmartMccbDetail.configuratorBannerBg}
        />
        <DevicesProductLineup
          variant={susolUlSmartMccbDetail.lineupVariant}
          items={susolUlSmartMccbDetail.lineup}
          frameLineup={susolUlSmartMccbDetail.frameLineup}
          configuratorHref={susolUlSmartMccbDetail.configuratorHref}
          configuratorExternal={susolUlSmartMccbDetail.configuratorExternal}
        />
        <DevicesProductDownloads items={susolUlSmartMccbDetail.downloads} />
        <CommonBanner03 />
        <DevicesProductOtherProducts items={susolUlSmartMccbDetail.otherProducts} />
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
        items={susolUlSmartMccbFaqItems}
      />
    </main>
  );
}
