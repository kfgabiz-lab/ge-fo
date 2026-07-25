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
import { mapHwProductData, fetchProductFaqItems } from "../../data/productsSystemsData";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcDownloads,
  hvdcFaqItems,
  hvdcNavItems,
  hvdcOtherProducts,
  hvdcOtherProductsTitle,
  hvdcOverview,
  hvdcWhySection,
} from "../../data/hvdcContent";
import {
  xemsBenefitsSection,
  xemsDownloads,
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
  microGridDownloads,
  microGridFaqItems,
  microGridNavItems,
  microGridOtherProducts,
  microGridOtherProductsTitle,
  microGridOverview,
} from "../../data/microGridContent";
import {
  smartFactoryApplicationsSection,
  smartFactoryBenefitsSection,
  smartFactoryDownloads,
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
export const SW_PRODUCT_SLUGS = [
  "scada",
  "xems",
  "micro-grid",
  "smart-factory",
] as const;

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

// 각 SW 제품상세 함수 공통 prop — 라우트에서 조회한 product-data row + 동적 조회한 FAQ.
type SwDetailProps = {
  row: Record<string, unknown> | null;
  dbFaq: CommonFaqEntry[];
};

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
function ScadaDetail({ row, dbFaq }: SwDetailProps) {
  const bind = bindSwDetail(row);
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
      <DevicesProductNavScope navItems={hvdcNavItems}>
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
        <DevicesProductDownloads items={hvdcDownloads} />
        <CommonBanner03 />
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
function XemsDetail({ row, dbFaq }: SwDetailProps) {
  const bind = bindSwDetail(row);
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
      <DevicesProductNavScope navItems={xemsNavItems}>
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
        <DevicesProductDownloads items={xemsDownloads} />
        <CommonBanner03 />
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
function MicroGridDetail({ row, dbFaq }: SwDetailProps) {
  const bind = bindSwDetail(row);
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
      <DevicesProductNavScope navItems={microGridNavItems}>
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
        <DevicesProductDownloads items={microGridDownloads} />
        <CommonBanner03 />
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
function SmartFactoryDetail({ row, dbFaq }: SwDetailProps) {
  const bind = bindSwDetail(row);
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
      <DevicesProductNavScope navItems={smartFactoryNavItems}>
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
        <DevicesProductDownloads items={smartFactoryDownloads} />
        <CommonBanner03 />
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
  const dbFaq = productId ? await fetchProductFaqItems(productId) : [];

  switch (slug) {
    case "scada":
      return <ScadaDetail row={row} dbFaq={dbFaq} />;
    case "xems":
      return <XemsDetail row={row} dbFaq={dbFaq} />;
    case "micro-grid":
      return <MicroGridDetail row={row} dbFaq={dbFaq} />;
    case "smart-factory":
      return <SmartFactoryDetail row={row} dbFaq={dbFaq} />;
    default:
      return <GenericProductDetail row={row} />;
  }
}
