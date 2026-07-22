// 제품상세 완전 동적 렌더러 — 특정 slug를 예외 취급하지 않는다.
// product-data의 seo.slug로 조회한 실데이터를 productTemplateDetail(제네릭 기본값)에 병합해서
// 어떤 제품이든 동일한 컴포넌트 조합으로 렌더한다. 다운로드/라인업/FAQ 등 DB에 없는 필드는
// 템플릿 기본값을 쓰며, 추후 데이터가 채워지면 buildHwProductDetail이 자동으로 실데이터로 덮어쓴다.
import DevicesHelp from "../DevicesHelp";
import DevicesMarkets from "../DevicesMarkets";
import DevicesPageFooter from "../DevicesPageFooter";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "./DevicesProductDownloads";
import DevicesProductHero from "./DevicesProductHero";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductLineup from "./DevicesProductLineup";
import DevicesProductNavScope from "./DevicesProductNavScope";
import DevicesProductVideo from "./DevicesProductVideo";
import {
  productDetailNavItems,
  productTemplateDetail,
  productTemplateFaqItems,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import { fetchProductFaqItems } from "../../data/productsSystemsData";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default async function GenericProductDetail({ slug }: { slug: string }) {
  const { detail, productId } = await buildHwProductDetail(
    slug,
    productTemplateDetail,
  );
  // 제품 FAQ 동적 조회(productId 있을 때만). 결과 0건이면 정적 템플릿 FAQ로 폴백.
  const faqItems = productId ? await fetchProductFaqItems(productId) : [];

  return (
    <main className="devices-page devices-page--product" id="Page_devices_product">
      <DevicesProductHero product={detail} />
      <DevicesProductNavScope navItems={productDetailNavItems}>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={detail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={detail.expertBannerHref}
          linkExternal={detail.expertBannerExternal}
          contactEmail={detail.expertContactEmail}
          backgroundSrc={detail.configuratorBannerBg}
        />
        <DevicesProductLineup
          table="product-template"
          configuratorHref={detail.configuratorHref}
          configuratorExternal={detail.configuratorExternal}
        />
        <DevicesProductDownloads items={[]} />
        <CommonBanner03 />
        {detail.youtubeVideoId ? (
          <DevicesProductVideo youtubeVideoId={detail.youtubeVideoId} />
        ) : null}
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter
        faqItems={faqItems.length > 0 ? faqItems : productTemplateFaqItems}
      />
    </main>
  );
}
