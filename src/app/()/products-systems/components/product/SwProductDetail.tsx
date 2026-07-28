// SW(소프트웨어) 제품상세 렌더러 — product-data의 page_type === "SW" 제품 4종(scada/xems/micro-grid/smart-factory)을
// seo.slug로 분기해 각 전용 구성으로 렌더한다. HW 제네릭 상세(GenericProductDetail)와 완전히 분리된 별도 컴포넌트.
// ⚠️ 이 컴포넌트는 ls-publish의 software/{scada,xems,micro-grid,smart-factory}/page.tsx 4개를 원본 마크업/구성 그대로 이식한 것이다.
//    (정적 데이터 이식 단계 — data-slug 동적 바인딩은 후속 #FO데이터바인딩 단계에서 처리)
// 미등록 slug(page_type=SW인데 아래 4개가 아닌 경우)는 기존 GenericProductDetail로 폴백해 화면 깨짐을 방지한다.
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import CommonFaq, { type CommonFaqEntry } from "@/components/faq/CommonFaq";
import DevicesHelp from "../DevicesHelp";
import DevicesMarkets from "../DevicesMarkets";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesHvdcHero from "./DevicesHvdcHero";
import DevicesMicroGridHero from "./DevicesMicroGridHero";
import DevicesSmartFactoryHero from "./DevicesSmartFactoryHero";
import DevicesXemsHero from "./DevicesXemsHero";
import DevicesSoftwareOverview from "./DevicesSoftwareOverview";
import DevicesProductApplications from "./DevicesProductApplications";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductDownloads from "./DevicesProductDownloads";
import DevicesProductNavScope from "./DevicesProductNavScope";
import DevicesProductOtherProducts from "./DevicesProductOtherProducts";
import DevicesProductWhy from "./DevicesProductWhy";
import DevicesMicroGridHighlights from "./DevicesMicroGridHighlights";
import DevicesXemsEnergySolutions from "./DevicesXemsEnergySolutions";
import GenericProductDetail from "./GenericProductDetail";
import {
  mapHwProductData,
  fetchProductFaqItems,
  fetchProductLv2Name,
  SW_PRODUCT_SLUGS,
} from "../../data/productsSystemsData";
import {
  buildSwProductTechHubBannerCopy,
  type ProductTechHubBannerCopy,
} from "@/data/support/techHubData";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  fetchProductDownloadsPage,
  fetchProductDownloadsGateCount,
  type ProductDownloadsPage,
} from "../../data/productDetailContent";
import { productDownloadsDefaultDocTypes } from "@/data/support/downloadCenterContent";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcFaqItems,
  hvdcNavItems,
  hvdcOtherProducts,
  hvdcOtherProductsTitle,
  hvdcOverview,
  hvdcWhySection,
} from "../../data/hvdcContent";
import {
  xemsBenefitsSection,
  xemsFaqItems,
  xemsNavItems,
  xemsOtherProducts,
  xemsOtherProductsTitle,
  xemsOverview,
  xemsWhySection,
} from "../../data/xemsContent";
import {
  microGridApplicationsSection,
  microGridBenefitsSection,
  microGridFaqItems,
  microGridNavItems,
  microGridOtherProducts,
  microGridOtherProductsTitle,
  microGridOverview,
} from "../../data/microGridContent";
import {
  smartFactoryApplicationsSection,
  smartFactoryBenefitsSection,
  smartFactoryFaqItems,
  smartFactoryNavItems,
  smartFactoryOtherProducts,
  smartFactoryOtherProductsTitle,
  smartFactoryOverview,
  smartFactoryWhySection,
} from "../../data/smartFactoryContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

// page_type === "SW" 이면서 전용 구성을 가진 slug 목록. 라우터에서 등록 여부 판별에 재사용한다.
// 정의 위치는 데이터 계층(productsSystemsData)이다 — 제품 단건 조회(fetchProductDetailBySlug)가
// 같은 목록을 봐야 하는데, 데이터 모듈이 이 컴포넌트를 import 하면 순환 참조가 생기기 때문.
// 기존 import 경로(이 파일에서 가져다 쓰는 코드)를 유지하기 위해 그대로 재수출한다.
export { SW_PRODUCT_SLUGS } from "../../data/productsSystemsData";

// 공통 FAQ 설명 문구(4개 SW 페이지 원본 공통)
const swFaqDescription = (
  <>
    Find quick answers to common questions about installation, troubleshooting, and
    maintenance.
    <br />
    Our expert engineering team has curated these responses to help you optimize product
    performance.
  </>
);

// 각 SW 제품상세 함수 공통 prop — 라우트에서 조회한 product-data row + 동적 조회한 FAQ + 제품 연계 다운로드 목록.
type SwDetailProps = {
  row: Record<string, unknown> | null;
  dbFaq: CommonFaqEntry[];
  downloads: ProductDownloadsPage;
  /**
   * Downloads 섹션 노출 여부 판정용 전체 연계 파일 건수(문서유형 제한 없음 — 기획서 18번).
   * downloads(Catalog/Manual 필터 목록)와 판정 기준을 분리하기 위한 별도 값이다.
   */
  downloadsGateCount: number;
  /** Downloads 클라이언트 재조회(필터/정렬/페이지)에도 동일 조건을 유지하기 위한 제품코드 */
  productCodes: string[];
  /**
   * Tech Hub 배너(CommonBanner03) 문구 — SW 전용 포맷(고정 타이틀 "Video Tutorials" + 본문만 Lv2명 치환, 건수 없음).
   * 영상 건수와 무관하게 적용되며, 배너 노출조건은 기존 그대로(SW 는 항상 렌더)다.
   */
  techHubCopy: ProductTechHubBannerCopy;
};

// 기획서 18번: 현재 제품과 연계된 다운로드 파일이 0건이면 Downloads 섹션과 사이드 네비 항목을 함께 숨긴다.
// 네비 원본 배열(hvdcNavItems 등)은 다른 화면도 참조할 수 있으므로 원본을 수정하지 않고 여기서 걸러 넘긴다.
function filterSwNavItems<T extends { readonly id: string }>(
  navItems: readonly T[],
  showDownloads: boolean,
): T[] {
  return navItems.filter(
    (item) => showDownloads || item.id !== "product-downloads",
  );
}

// row → Hero/Overview 바인딩 값 추출(필드별 fallback).
// 빈 문자열이면 undefined로 반환 → Hero 컴포넌트의 정적 default가 유지되게 한다.
// Key Features는 variant(list/desc)가 제품마다 달라 각 Detail에서 변환한다.
function bindSwDetail(row: Record<string, unknown> | null) {
  const data = row ? mapHwProductData(row) : null;
  const infoDesc = row ? String(row["product_info.info_description"] ?? "") : "";
  return {
    title: data?.name || undefined,
    description: data?.description || undefined,
    // key_feature1~4 추출 결과(빈 값은 mapHwProductData가 이미 filter). 비어있으면 각 Detail에서 정적 폴백.
    keyFeatures: data?.keyFeatures ?? [],
    infoDesc,
    // Help 카드(help-1) CTA 링크 — product_etc.connect_portal
    connectPortal: data?.connectPortal,
  };
}

// scada(seo.slug=scada, 데이터=hvdcContent) — 정적 구성 유지 + Hero/Overview/KeyFeatures/FAQ만 실데이터 바인딩(필드별 fallback)
function ScadaDetail({
  row,
  dbFaq,
  downloads,
  downloadsGateCount,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  // 기획서 18번은 문서유형을 제한하지 않으므로 Catalog/Manual 목록(downloads)이 아니라
  // 전체 연계 건수(downloadsGateCount)로 섹션·네비 노출을 판정한다.
  const showDownloads = downloadsGateCount > 0;
  // Key Features(list variant): DB key_feature가 있으면 변환, 없으면 정적 benefits 유지
  const featureItems =
    bind.keyFeatures.length > 0
      ? bind.keyFeatures.map((f, i) => ({
          id: `kf-${i + 1}`,
          title: f.title,
          bullets: [f.content],
        }))
      : hvdcBenefitsSection.items;
  const overviewData = bind.infoDesc
    ? { ...hvdcOverview, description: bind.infoDesc }
    : hvdcOverview;
  const faqItems = dbFaq.length > 0 ? dbFaq : hvdcFaqItems;
  return (
    <main
      className="devices-page devices-page--product devices-page--hvdc"
      id="Page_devices_hvdc"
    >
      <DevicesHvdcHero title={bind.title} description={bind.description} />
      <DevicesProductNavScope
        navItems={filterSwNavItems(hvdcNavItems, showDownloads)}
      >
        <DevicesSoftwareOverview data={overviewData} imageMode="img" />
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={hvdcBenefitsSection.title}
          items={featureItems}
        />
        <DevicesProductApplications
          title={hvdcApplicationsSection.title}
          description={hvdcApplicationsSection.description}
          items={hvdcApplicationsSection.items}
        />
        <DevicesProductWhy
          title={hvdcWhySection.title}
          blocks={hvdcWhySection.blocks}
        />
        {showDownloads ? (
          <DevicesProductDownloads
            initial={downloads}
            productCodes={productCodes}
          />
        ) : null}
        <CommonBanner03 {...techHubCopy} />
        <DevicesProductOtherProducts
          title={hvdcOtherProductsTitle}
          items={hvdcOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp
          variant="overlay"
          sectionId="product-help"
          connectPortalHref={bind.connectPortal}
        />
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
        description={swFaqDescription}
        items={faqItems}
      />
    </main>
  );
}

// xems(seo.slug=xems, 데이터=xemsContent) — 정적 구성 유지 + Hero/Overview/KeyFeatures/FAQ만 실데이터 바인딩(필드별 fallback)
function XemsDetail({
  row,
  dbFaq,
  downloads,
  downloadsGateCount,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  // 기획서 18번은 문서유형을 제한하지 않으므로 Catalog/Manual 목록(downloads)이 아니라
  // 전체 연계 건수(downloadsGateCount)로 섹션·네비 노출을 판정한다.
  const showDownloads = downloadsGateCount > 0;
  // Key Features(desc variant): DB key_feature가 있으면 변환, 없으면 정적 benefits 유지
  const featureItems =
    bind.keyFeatures.length > 0
      ? bind.keyFeatures.map((f, i) => ({
          id: `kf-${i + 1}`,
          title: f.title,
          description: f.content,
        }))
      : xemsBenefitsSection.items;
  const overviewData = bind.infoDesc
    ? { ...xemsOverview, description: bind.infoDesc }
    : xemsOverview;
  const faqItems = dbFaq.length > 0 ? dbFaq : xemsFaqItems;
  return (
    <main
      className="devices-page devices-page--product devices-page--xems"
      id="P-FO-PROD-040000P"
    >
      <DevicesXemsHero title={bind.title} description={bind.description} />
      <DevicesProductNavScope
        navItems={filterSwNavItems(xemsNavItems, showDownloads)}
      >
        <DevicesSoftwareOverview data={overviewData} imageMode="bg" />
        <DevicesProductFeaturesSection
          variant="desc"
          sectionId="product-benefits"
          title={xemsBenefitsSection.title}
          items={featureItems}
        />
        <DevicesXemsEnergySolutions />
        <DevicesProductWhy
          title={xemsWhySection.title}
          blocks={xemsWhySection.blocks}
          imageOnly
        />
        {showDownloads ? (
          <DevicesProductDownloads
            initial={downloads}
            productCodes={productCodes}
          />
        ) : null}
        <CommonBanner03 {...techHubCopy} />
        <DevicesProductOtherProducts
          title={xemsOtherProductsTitle}
          items={xemsOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp
          variant="overlay"
          sectionId="product-help"
          connectPortalHref={bind.connectPortal}
        />
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
        description={swFaqDescription}
        items={faqItems}
      />
    </main>
  );
}

// micro-grid(seo.slug=micro-grid, 데이터=microGridContent) — 정적 구성 유지 + Hero/Overview/KeyFeatures/FAQ만 실데이터 바인딩(필드별 fallback)
function MicroGridDetail({
  row,
  dbFaq,
  downloads,
  downloadsGateCount,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  // 기획서 18번은 문서유형을 제한하지 않으므로 Catalog/Manual 목록(downloads)이 아니라
  // 전체 연계 건수(downloadsGateCount)로 섹션·네비 노출을 판정한다.
  const showDownloads = downloadsGateCount > 0;
  // Key Features(list variant): DB key_feature가 있으면 변환, 없으면 정적 benefits 유지
  const featureItems =
    bind.keyFeatures.length > 0
      ? bind.keyFeatures.map((f, i) => ({
          id: `kf-${i + 1}`,
          title: f.title,
          bullets: [f.content],
        }))
      : microGridBenefitsSection.items;
  const overviewData = bind.infoDesc
    ? { ...microGridOverview, description: bind.infoDesc }
    : microGridOverview;
  const faqItems = dbFaq.length > 0 ? dbFaq : microGridFaqItems;
  return (
    <main
      className="devices-page devices-page--product devices-page--micro-grid"
      id="P-FO-PROD-040000P"
    >
      <DevicesMicroGridHero title={bind.title} description={bind.description} />
      <DevicesProductNavScope
        navItems={filterSwNavItems(microGridNavItems, showDownloads)}
      >
        <DevicesSoftwareOverview data={overviewData} imageMode="bg" />
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={microGridBenefitsSection.title}
          items={featureItems}
        />
        <DevicesProductApplications
          title={microGridApplicationsSection.title}
          description={microGridApplicationsSection.description}
          items={microGridApplicationsSection.items}
        />
        <DevicesMicroGridHighlights />
        {showDownloads ? (
          <DevicesProductDownloads
            initial={downloads}
            productCodes={productCodes}
          />
        ) : null}
        <CommonBanner03 {...techHubCopy} />
        <DevicesProductOtherProducts
          title={microGridOtherProductsTitle}
          items={microGridOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp
          variant="overlay"
          sectionId="product-help"
          connectPortalHref={bind.connectPortal}
        />
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
        description={swFaqDescription}
        items={faqItems}
      />
    </main>
  );
}

// smart-factory(seo.slug=smart-factory, 데이터=smartFactoryContent) — 정적 구성 유지 + Hero/Overview/KeyFeatures/FAQ만 실데이터 바인딩(필드별 fallback)
function SmartFactoryDetail({
  row,
  dbFaq,
  downloads,
  downloadsGateCount,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  // 기획서 18번은 문서유형을 제한하지 않으므로 Catalog/Manual 목록(downloads)이 아니라
  // 전체 연계 건수(downloadsGateCount)로 섹션·네비 노출을 판정한다.
  const showDownloads = downloadsGateCount > 0;
  // Key Features(list variant): DB key_feature가 있으면 변환, 없으면 정적 benefits 유지
  const featureItems =
    bind.keyFeatures.length > 0
      ? bind.keyFeatures.map((f, i) => ({
          id: `kf-${i + 1}`,
          title: f.title,
          bullets: [f.content],
        }))
      : smartFactoryBenefitsSection.items;
  const overviewData = bind.infoDesc
    ? { ...smartFactoryOverview, description: bind.infoDesc }
    : smartFactoryOverview;
  const faqItems = dbFaq.length > 0 ? dbFaq : smartFactoryFaqItems;
  return (
    <main
      className="devices-page devices-page--product devices-page--smart-factory"
      id="P-FO-PROD-040000P"
    >
      <DevicesSmartFactoryHero title={bind.title} description={bind.description} />
      <DevicesProductNavScope
        navItems={filterSwNavItems(smartFactoryNavItems, showDownloads)}
      >
        <DevicesSoftwareOverview data={overviewData} imageMode="bg" />
        <DevicesProductFeaturesSection
          variant="list"
          sectionId="product-benefits"
          title={smartFactoryBenefitsSection.title}
          items={featureItems}
        />
        <DevicesProductApplications
          title={smartFactoryApplicationsSection.title}
          description={smartFactoryApplicationsSection.description}
          items={smartFactoryApplicationsSection.items}
        />
        <DevicesProductWhy
          title={smartFactoryWhySection.title}
          description={smartFactoryWhySection.description}
          blocks={smartFactoryWhySection.blocks}
          imageOnly
        />
        {showDownloads ? (
          <DevicesProductDownloads
            initial={downloads}
            productCodes={productCodes}
          />
        ) : null}
        <CommonBanner03 {...techHubCopy} />
        <DevicesProductOtherProducts
          title={smartFactoryOtherProductsTitle}
          items={smartFactoryOtherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp
          variant="overlay"
          sectionId="product-help"
          connectPortalHref={bind.connectPortal}
        />
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
        description={swFaqDescription}
        items={faqItems}
      />
    </main>
  );
}

// slug 분기. 등록되지 않은 slug는 기존 제네릭 제품상세로 폴백(화면 깨짐 방지).
// row는 폴백 시 GenericProductDetail로 그대로 전달한다.
// 제품 FAQ는 GenericProductDetail(HW)과 동일하게 fetchProductFaqItems(productId)로 동적 조회하고,
// 결과가 비어 있으면 각 Detail에서 정적 FAQ로 폴백한다(필드별 fallback 원칙).
export default async function SwProductDetail({
  slug,
  row,
}: {
  slug: string;
  row: Record<string, unknown> | null;
}) {
  const productId = row ? Number(row._id) : null;
  // Downloads 필터용 제품코드(기획서 18번) — 다운로드센터 콘텐츠의 category_l3_id 가 product.product_code 체계다.
  // row 가 없거나 코드가 비면 빈 배열 → fetchProductDownloadsPage 가 조회 없이 빈 결과를 반환한다(전체 목록 노출 방지).
  const productCode = row ? String(row["product.product_code"] ?? "").trim() : "";
  const productCodes = productCode ? [productCode] : [];
  // Downloads는 현재 제품과 연계된 파일만 담은 1페이지(5건). 아래 slug 분기에서 실제로 렌더되는 Detail은
  // 하나뿐이라 여기서 한 번만 조회해 넘긴다.
  // HW 제품상세(GenericProductDetail)와 동일하게 문서유형 기본 체크(Catalog/Manual) 조건으로 조회해
  // SSR 결과와 DevicesProductDownloads 필터 초기 체크 상태를 맞춘다.
  // 2페이지 이후는 DevicesProductDownloads 가 클라이언트에서 같은 헬퍼로 재조회한다.
  // Tech Hub 배너 문구용 Lv2 이름(기획서 software.png: 본문에만 Lv2명 치환).
  // ⚠️ 영상 건수와 무관하게 문구를 맞춰야 하므로 Tech Hub 콘텐츠 조회(fetchProductTechHubBanner)가 아니라
  //    Lv2 이름만 얻는 경량 헬퍼를 쓴다. 0건이면 null 을 반환하는 전자로는 SW 요건을 만족할 수 없다.
  // 아래 default 분기(미등록 slug)는 GenericProductDetail 이 스스로 조회하므로 SW 4종일 때만 호출한다.
  const isSwSlug = (SW_PRODUCT_SLUGS as readonly string[]).includes(slug);
  // downloadsGateCount: 섹션 노출 여부 판정 전용 건수(문서유형 제한 없음 — 기획서 18번).
  // 목록(downloads)은 필터 초기값(Catalog/Manual)에 맞춘 결과라 판정 기준으로 쓸 수 없다.
  const [dbFaq, downloads, downloadsGateCount, lv2Name] = await Promise.all([
    productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
    fetchProductDownloadsPage({
      docTypes: productDownloadsDefaultDocTypes,
      productCodes,
    }),
    fetchProductDownloadsGateCount(productCodes),
    isSwSlug && productId
      ? fetchProductLv2Name(productId)
      : Promise.resolve(""),
  ]);
  const techHubCopy = buildSwProductTechHubBannerCopy(lv2Name);

  switch (slug) {
    case "scada":
      return (
        <ScadaDetail
          row={row}
          dbFaq={dbFaq}
          downloads={downloads}
          downloadsGateCount={downloadsGateCount}
          productCodes={productCodes}
          techHubCopy={techHubCopy}
        />
      );
    case "xems":
      return (
        <XemsDetail
          row={row}
          dbFaq={dbFaq}
          downloads={downloads}
          downloadsGateCount={downloadsGateCount}
          productCodes={productCodes}
          techHubCopy={techHubCopy}
        />
      );
    case "micro-grid":
      return (
        <MicroGridDetail
          row={row}
          dbFaq={dbFaq}
          downloads={downloads}
          downloadsGateCount={downloadsGateCount}
          productCodes={productCodes}
          techHubCopy={techHubCopy}
        />
      );
    case "smart-factory":
      return (
        <SmartFactoryDetail
          row={row}
          dbFaq={dbFaq}
          downloads={downloads}
          downloadsGateCount={downloadsGateCount}
          productCodes={productCodes}
          techHubCopy={techHubCopy}
        />
      );
    default:
      return <GenericProductDetail row={row} />;
  }
}
