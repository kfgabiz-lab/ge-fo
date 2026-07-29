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

export { SW_PRODUCT_SLUGS } from "../../data/productsSystemsData";

const swFaqDescription = (
  <>
    Find quick answers to common questions about installation, troubleshooting, and
    maintenance.
    <br />
    Our expert engineering team has curated these responses to help you optimize product
    performance.
  </>
);

type SwDetailProps = {
  row: Record<string, unknown> | null;
  dbFaq: CommonFaqEntry[];
  downloads: ProductDownloadsPage;
  productCodes: string[];
  techHubCopy: ProductTechHubBannerCopy;
};

function filterSwNavItems<T extends { readonly id: string }>(
  navItems: readonly T[],
  showDownloads: boolean,
): T[] {
  return navItems.filter(
    (item) => showDownloads || item.id !== "product-downloads",
  );
}

function bindSwDetail(row: Record<string, unknown> | null) {
  const data = row ? mapHwProductData(row) : null;
  const infoDesc = row ? String(row["product_info.info_description"] ?? "") : "";
  return {
    title: data?.name || undefined,
    description: data?.description || undefined,
    keyFeatures: data?.keyFeatures ?? [],
    infoDesc,
    connectPortal: data?.connectPortal,
  };
}

function ScadaDetail({
  row,
  dbFaq,
  downloads,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  const showDownloads = downloads.totalElements > 0;
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

function XemsDetail({
  row,
  dbFaq,
  downloads,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  const showDownloads = downloads.totalElements > 0;
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

function MicroGridDetail({
  row,
  dbFaq,
  downloads,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  const showDownloads = downloads.totalElements > 0;
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

function SmartFactoryDetail({
  row,
  dbFaq,
  downloads,
  productCodes,
  techHubCopy,
}: SwDetailProps) {
  const bind = bindSwDetail(row);
  const showDownloads = downloads.totalElements > 0;
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

export default async function SwProductDetail({
  slug,
  row,
}: {
  slug: string;
  row: Record<string, unknown> | null;
}) {
  const productId = row ? Number(row._id) : null;
  const productCode = row ? String(row["product.product_code"] ?? "").trim() : "";
  const productCodes = productCode ? [productCode] : [];
  const isSwSlug = (SW_PRODUCT_SLUGS as readonly string[]).includes(slug);
  const [dbFaq, downloads, lv2Name] = await Promise.all([
    productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
    fetchProductDownloadsPage({
      docTypes: productDownloadsDefaultDocTypes,
      productCodes,
    }),
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
          productCodes={productCodes}
          techHubCopy={techHubCopy}
        />
      );
    default:
      return <GenericProductDetail row={row} />;
  }
}
