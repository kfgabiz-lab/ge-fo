// 제품상세 완전 동적 렌더러 — 특정 slug를 예외 취급하지 않는다.
// product-data의 seo.slug로 조회한 실데이터를 productTemplateDetail(기본 레이아웃 틀)에 병합해서
// 어떤 제품이든 동일한 컴포넌트 조합으로 렌더한다. Downloads/OtherProducts/Expert 배너만 정적 기본값 유지.
import DevicesHelp from "../DevicesHelp";
import DevicesMarkets from "../DevicesMarkets";
import DevicesPageFooter from "../DevicesPageFooter";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "./DevicesProductDownloads";
import DevicesProductHero from "./DevicesProductHero";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductNavScope from "./DevicesProductNavScope";
import DevicesProductVideo from "./DevicesProductVideo";
import {
  productDetailNavItems,
  productTemplateDetail,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import { fetchProductFaqItems } from "../../data/productsSystemsData";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

// row: 라우트 page.tsx에서 fetchProductBySlug로 이미 조회한 제품 단건(없으면 null).
// null이면 buildHwProductDetail이 템플릿 기본값(base)만으로 빈 상태 렌더 — 레이아웃은 유지된다.
export default async function GenericProductDetail({
  row,
}: {
  row: Record<string, unknown> | null;
}) {
  const { detail, productId } = buildHwProductDetail(row, productTemplateDetail);
  // 제품 FAQ 동적 조회(productId 있을 때만)
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
        <section className="devices_product_lineup" id="product-lineup">
          <div className="inner">
            <h2 className="section_tit">Lineup</h2>
            {/* data-slug: product-data — 리치텍스트 HTML 단일 필드(product_etc.line_up)라 data-slug-repeat 없이 그대로 렌더 */}
            <div
              data-slug="product-data"
              data-slugkey="product_etc.line_up"
              dangerouslySetInnerHTML={{ __html: detail.lineUp }}
            />
            <div className="devices_product_lineup__footer">
              <div className="devices_product_lineup__note">
                <p>Explore all available configurations effortlessly.</p>
                <p>
                  Our Configurator helps you select the right specifications in
                  just a few clicks.
                </p>
              </div>
              <a
                href={detail.configuratorHref}
                className="btn-base btn-lv02 btn-lv02--solid"
                {...(detail.configuratorExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Go to Configurator
                <span className="icon_link-14" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <DevicesProductDownloads items={[]} />
        <CommonBanner03 />
        <DevicesProductVideo youtubeVideoId={detail.youtubeVideoId} />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={faqItems} />
    </main>
  );
}
