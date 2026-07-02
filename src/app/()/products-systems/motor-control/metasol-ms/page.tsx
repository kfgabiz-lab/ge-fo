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
import DevicesProductVideo from "../../components/product/DevicesProductVideo";
import { motorControlHighlights } from "../../data/motorControlContent";
import { metasolMsDetail, metasolMsFaqItems } from "../../data/productDetailContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function MetasolMsProductPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_metasol_ms">
      <DevicesProductHero product={metasolMsDetail} />
      <DevicesProductNavScope>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={metasolMsDetail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={metasolMsDetail.expertBannerHref}
          linkExternal={metasolMsDetail.expertBannerExternal}
          contactEmail={metasolMsDetail.expertContactEmail}
          backgroundSrc={metasolMsDetail.configuratorBannerBg}
        />
        <DevicesProductLineup
          variant={metasolMsDetail.lineupVariant}
          items={metasolMsDetail.lineup}
          frameLineup={metasolMsDetail.frameLineup}
          configuratorHref={metasolMsDetail.configuratorHref}
          configuratorExternal={metasolMsDetail.configuratorExternal}
        />
        <DevicesProductDownloads items={metasolMsDetail.downloads} />
        <CommonBanner03 />
        <DevicesProductVideo youtubeVideoId={metasolMsDetail.youtubeVideoId} />
        <DevicesProductOtherProducts items={metasolMsDetail.otherProducts} />
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
        items={metasolMsFaqItems}
      />
    </main>
  );
}
