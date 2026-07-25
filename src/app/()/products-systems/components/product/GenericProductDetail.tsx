// 제품상세 완전 동적 렌더러 — 특정 slug를 예외 취급하지 않는다.
// product-data의 seo.slug로 조회한 실데이터를 productTemplateDetail(기본 레이아웃 틀)에 병합해서
// 어떤 제품이든 동일한 컴포넌트 조합으로 렌더한다. Downloads/OtherProducts/Expert 배너만 정적 기본값 유지.
import DevicesHelp, { CONNECT_PORTAL_FALLBACK_HREF } from "../DevicesHelp";
import DevicesMarkets from "../DevicesMarkets";
import DevicesPageFooter from "../DevicesPageFooter";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "./DevicesProductDownloads";
import DevicesProductHero from "./DevicesProductHero";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductNavScope from "./DevicesProductNavScope";
import DevicesProductVideo from "./DevicesProductVideo";
import DevicesProductOtherProducts from "./DevicesProductOtherProducts";
import {
  productDetailNavItems,
  productTemplateDetail,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import {
  fetchProductFaqItems,
  fetchOtherProductsInSameLv2,
  fetchProductManagerEmail,
} from "../../data/productsSystemsData";
import { fetchProductInsights } from "@/data/highlightNews";
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
  // 제품 FAQ + 동일 Lv2 Other Products(31) + 담당자 이메일(11~13) + 맵핑 게시글 Insights(38) 병렬 조회(productId 있을 때만).
  const [faqItems, otherProducts, managerEmail, insights] = await Promise.all([
    productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
    productId ? fetchOtherProductsInSameLv2(productId) : Promise.resolve([]),
    productId ? fetchProductManagerEmail(productId) : Promise.resolve(""),
    productId ? fetchProductInsights(productId) : Promise.resolve([]),
  ]);

  // 10번(B 방향, 이번 항목 한정 예외) + 31번(Other Products): 데이터가 없는 섹션은 컨테이너 자체를 렌더하지 않고,
  // 대응 사이드바 네비 항목도 함께 숨긴다. "섹션 미렌더 ↔ 네비 미노출"이 항상 짝을 이루도록
  // 동일 플래그(show*)를 섹션 렌더와 네비 필터에 함께 사용한다.
  // 대상: Key Features/Lineup/Video/Other Products — Downloads/Markets/Help는 항상 정적 콘텐츠가 있어 제외(항상 노출).
  const showKeyFeatures = detail.keyFeatures.length > 0;
  const showLineup = detail.lineUp.trim().length > 0;
  const showVideo = Boolean(detail.youtubeVideoId);
  const showOtherProducts = otherProducts.length > 0;
  const visibleNavItems = productDetailNavItems.filter((item) => {
    if (item.id === "product-key-feature") return showKeyFeatures;
    if (item.id === "product-lineup") return showLineup;
    if (item.id === "product-video") return showVideo;
    if (item.id === "product-other") return showOtherProducts;
    return true;
  });

  return (
    <main className="devices-page devices-page--product" id="Page_devices_product">
      <DevicesProductHero product={detail} />
      <DevicesProductNavScope navItems={visibleNavItems}>
        {showKeyFeatures ? (
          <DevicesProductFeaturesSection
            title="Key Features"
            items={detail.keyFeatures}
          />
        ) : null}
        {/* 제품 담당 배너(11~13): 담당자 이메일은 서버 필터 결과(managerEmail). 담당자 없으면 "" →
            CommonBanner02 expert가 이메일/복사 블록을 미렌더하고 "Send an Inquiry"만 노출(축약형, 공용 컴포넌트 무수정). */}
        <CommonBanner02
          variant="expert"
          linkHref={detail.expertBannerHref}
          linkExternal={detail.expertBannerExternal}
          contactEmail={managerEmail}
          backgroundSrc={detail.configuratorBannerBg}
        />
        {showLineup ? (
        <section className="devices_product_lineup" id="product-lineup">
          <div className="inner">
            <h2 className="section_tit">Lineup</h2>
            {/* data-slug: product-data — 리치텍스트 HTML 단일 필드(product_etc.line_up)라 data-slug-repeat 없이 그대로 렌더 */}
            <div
              data-slug="product-data"
              data-slugkey="product_etc.line_up"
              dangerouslySetInnerHTML={{ __html: detail.lineUp }}
            />
          </div>
        </section>
        ) : null}
        {/* Configurator CTA(스펙 17번)는 Lineup 데이터 유무와 무관하게 항상 노출한다.
            footer/note/버튼 스타일이 section.devices_product_lineup 하위로 스코프돼 있어 wrapper도 동일 클래스를 유지한다(CSS 변경 없음).
            사이드바 네비 대상 id="product-lineup"은 위 조건부 Lineup 섹션에만 두어 10번 네비 짝(섹션↔네비)을 보존한다. */}
        <section className="devices_product_lineup">
          <div className="inner">
            <div className="devices_product_lineup__footer">
              <div className="devices_product_lineup__note">
                <p>Explore all available configurations effortlessly.</p>
                <p>
                  Our Configurator helps you select the right specifications in
                  just a few clicks.
                </p>
              </div>
              {/* Configurator CTA = product_etc.connect_portal(detail.configuratorHref).
                  값이 비면 Connect Portal 메인 화면으로 폴백(help-1과 동일 상수 재사용), 항상 새 창 이동(스펙 17번). */}
              <a
                href={detail.configuratorHref || CONNECT_PORTAL_FALLBACK_HREF}
                className="btn-base btn-lv02 btn-lv02--solid"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Configurator
                <span className="icon_link-14" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <DevicesProductDownloads items={[]} />
        <CommonBanner03 />
        {showVideo ? (
          <DevicesProductVideo youtubeVideoId={detail.youtubeVideoId} />
        ) : null}
        {/* 31번 Other Products — 동일 Lv2 소속 다른 제품(자기 제외). 0건이면 섹션·네비 동반 숨김. */}
        {showOtherProducts ? (
          <DevicesProductOtherProducts items={otherProducts} />
        ) : null}
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp
          variant="overlay"
          sectionId="product-help"
          connectPortalHref={detail.connectPortal}
        />
      </DevicesProductNavScope>
      <DevicesPageFooter faqItems={faqItems} highlightItems={insights} />
    </main>
  );
}
