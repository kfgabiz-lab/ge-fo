// 제품상세 완전 동적 렌더러 — 특정 slug를 예외 취급하지 않는다.
// product-data의 seo.slug로 조회한 실데이터를 productTemplateDetail(기본 레이아웃 틀)에 병합해서
// 어떤 제품이든 동일한 컴포넌트 조합으로 렌더한다. Downloads는 다운로드센터 API를 현재 제품코드로 필터해
// 동적 조회하고(연계 파일 0건이면 섹션·네비 동반 숨김 — 기획서 18번),
// OtherProducts/Expert 배너는 각각 별도 조회 로직으로 채운다.
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
  fetchProductDownloadsPage,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import {
  fetchProductFaqItems,
  fetchProductLv2Context,
  fetchProductManagerEmail,
} from "../../data/productsSystemsData";
import { fetchProductInsights } from "@/data/highlightNews";
import { productDownloadsDefaultDocTypes } from "@/data/support/downloadCenterContent";
import {
  buildHwProductTechHubBannerCopy,
  fetchProductTechHubBanner,
} from "@/data/support/techHubData";
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
  // Downloads 필터용 제품코드(기획서 18번) — 다운로드센터 콘텐츠의 category_l3_id 가 product.product_code 체계다.
  // row 가 없거나 코드가 비면 빈 배열 → fetchProductDownloadsPage 가 조회 없이 빈 결과를 반환한다(전체 목록 노출 방지).
  const productCode = row ? String(row["product.product_code"] ?? "").trim() : "";
  const productCodes = productCode ? [productCode] : [];
  // 제품 FAQ + 동일 Lv2 Other Products(31) + 담당자 이메일(11~13) + 맵핑 게시글 Insights(38)
  // + Tech Hub 배너 데이터 병렬 조회(productId 있을 때만).
  // Downloads는 현재 제품과 연계된 파일만 조회한 1페이지(5건)다.
  // 문서유형은 기본 체크 상태(Catalog/Manual)와 동일한 조건으로 조회해 SSR 결과와 필터 UI 초기값을 일치시킨다.
  // 이후 사용자가 필터를 바꾸거나 페이지를 이동하면 DevicesProductDownloads 가 클라이언트에서 재조회한다.
  // lv2Context: 히어로 카테고리 라벨(4번)과 Other Products 섹션(3·31번)이 같은 Lv2 값을 쓰므로
  // devices-tree 를 두 번 조회하지 않도록 한 번의 호출로 { lv2Name, otherProducts } 를 함께 받는다.
  const [
    faqItems,
    lv2Context,
    managerEmail,
    insights,
    downloadsPage,
    techHubBanner,
  ] = await Promise.all([
    productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
    productId
      ? fetchProductLv2Context(productId)
      : Promise.resolve({ lv2Name: "", otherProducts: [] }),
    productId ? fetchProductManagerEmail(productId) : Promise.resolve(""),
    productId ? fetchProductInsights(productId) : Promise.resolve([]),
    fetchProductDownloadsPage({
      docTypes: productDownloadsDefaultDocTypes,
      productCodes,
    }),
    productId ? fetchProductTechHubBanner(productId) : Promise.resolve(null),
  ]);

  // 10번(B 방향, 이번 항목 한정 예외) + 31번(Other Products): 데이터가 없는 섹션은 컨테이너 자체를 렌더하지 않고,
  // 대응 사이드바 네비 항목도 함께 숨긴다. "섹션 미렌더 ↔ 네비 미노출"이 항상 짝을 이루도록
  // 동일 플래그(show*)를 섹션 렌더와 네비 필터에 함께 사용한다.
  // 대상: Key Features/Lineup/Video/Other Products/Downloads
  // (Downloads는 기획서 18번에 따라 현재 제품 연계 파일이 0건이면 섹션·네비를 함께 숨긴다).
  // Markets/Help는 데이터 유무와 무관하게 항상 노출해 제외한다.
  const { lv2Name, otherProducts } = lv2Context;
  // 히어로 카테고리 라벨(4번) — 정적 템플릿 기본값("Product Category")은 어떤 제품에도 맞지 않는 플레이스홀더이므로
  // 실제 Lv2 이름으로 덮어쓰고, Lv2 연결이 없으면 ""로 넘겨 히어로에서 라벨 블록을 미렌더한다.
  const heroDetail = { ...detail, category: lv2Name };
  // Other Products 섹션 제목(3번) — "Explore the {Lv2 이름} Products".
  // Lv2를 못 찾으면 기존 기본 제목("Other Products")을 그대로 쓰도록 undefined 로 넘긴다.
  const otherProductsTitle = lv2Name ? `Explore the ${lv2Name} Products` : undefined;

  const showKeyFeatures = detail.keyFeatures.length > 0;
  const showLineup = detail.lineUp.trim().length > 0;
  const showVideo = Boolean(detail.youtubeVideoId);
  const showOtherProducts = otherProducts.length > 0;
  // 18번: 현재 제품과 연계된 다운로드 파일이 0건이면 Downloads 섹션 자체를 미출력한다.
  const showDownloads = downloadsPage.totalElements > 0;
  const visibleNavItems = productDetailNavItems.filter((item) => {
    if (item.id === "product-key-feature") return showKeyFeatures;
    if (item.id === "product-lineup") return showLineup;
    if (item.id === "product-downloads") return showDownloads;
    if (item.id === "product-video") return showVideo;
    if (item.id === "product-other") return showOtherProducts;
    return true;
  });

  return (
    <main className="devices-page devices-page--product" id="Page_devices_product">
      {/* showDownloads 를 히어로에도 넘긴다 — Downloads 섹션이 미출력되면 히어로의
          "Scroll to Downloads" 버튼이 스크롤 대상 없는 죽은 링크가 되므로 함께 숨긴다. */}
      <DevicesProductHero product={heroDetail} showDownloads={showDownloads} />
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
        {showDownloads ? (
          <DevicesProductDownloads
            initial={downloadsPage}
            productCodes={productCodes}
          />
        ) : null}
        {/* Tech Hub 배너 — 이 제품이 속한 Lv2의 Tech Hub 콘텐츠가 0건이면(techHubBanner === null)
            안내할 대상이 없으므로 배너 자체를 렌더하지 않는다(showKeyFeatures/showOtherProducts와 동일 정책).
            단, 이 배너는 대응하는 사이드바 네비 항목이 없어 visibleNavItems 필터에는 관여하지 않는다.
            imageSrc는 최신 콘텐츠 영상 썸네일이며, 파생 실패 시 undefined → CommonBanner03 기본 정적 이미지로 폴백된다.
            타이틀/본문/건수 문구는 이 제품의 Lv2 이름과 영상 건수로 만든다(HW 전용 포맷 — SW 상세는 별도 함수). */}
        {techHubBanner ? (
          <CommonBanner03
            linkHref={techHubBanner.href}
            imageSrc={techHubBanner.posterSrc ?? undefined}
            {...buildHwProductTechHubBannerCopy(techHubBanner)}
          />
        ) : null}
        {showVideo ? (
          <DevicesProductVideo youtubeVideoId={detail.youtubeVideoId} />
        ) : null}
        {/* 31번 Other Products — 동일 Lv2 소속 다른 제품(자기 제외). 0건이면 섹션·네비 동반 숨김. */}
        {showOtherProducts ? (
          <DevicesProductOtherProducts
            items={otherProducts}
            title={otherProductsTitle}
          />
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
