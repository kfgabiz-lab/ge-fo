import type { ReactElement } from "react";
import type { CommonFaqEntry } from "@/components/faq/CommonFaq";
import DevicesProductApplications from "./DevicesProductApplications";
import DevicesProductWhy from "./DevicesProductWhy";
import DevicesMicroGridHighlights from "./DevicesMicroGridHighlights";
import DevicesXemsEnergySolutions from "./DevicesXemsEnergySolutions";
import GenericProductDetail from "./GenericProductDetail";
import SwProductDetailShell, {
  type SwProductFeaturesConfig,
} from "./SwProductDetailShell";
import type { SoftwareOverviewData } from "./DevicesSoftwareOverview";
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
import { fetchProductInsights } from "@/data/highlightNews/highlightNewsData";
import { withProductInquiryContext } from "@/lib/navigation/categoryContext";
import type { HighlightNewsItem } from "@/types/highlightNews";
import {
  fetchProductDownloadsInitialData,
  type ProductDownloadsPage,
} from "../../data/productDetailContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcFaqItems,
  hvdcHero,
  hvdcOverview,
  hvdcWhySection,
} from "../../data/hvdcContent";
import {
  xemsBenefitsSection,
  xemsFaqItems,
  xemsHero,
  xemsOverview,
  xemsWhySection,
} from "../../data/xemsContent";
import {
  microGridApplicationsSection,
  microGridBenefitsSection,
  microGridFaqItems,
  microGridHero,
  microGridOverview,
} from "../../data/microGridContent";
import {
  smartFactoryApplicationsSection,
  smartFactoryBenefitsSection,
  smartFactoryFaqItems,
  smartFactoryHero,
  smartFactoryOverview,
  smartFactoryWhySection,
} from "../../data/smartFactoryContent";
import { mapSwKeyFeatures, type SwKeyFeature } from "../../lib/mapSwKeyFeatures";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export { SW_PRODUCT_SLUGS } from "../../data/productsSystemsData";

type SwDetailProps = {
  row: Record<string, unknown> | null;
  dbFaq: CommonFaqEntry[];
  downloads: ProductDownloadsPage;
  docTypeOptions: DownloadFilterOption[];
  productCodes: string[];
  techHubCopy: ProductTechHubBannerCopy;
  highlights: HighlightNewsItem[];
  contactHref: string;
};

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

function swShellCommonProps(
  props: SwDetailProps,
  bind: ReturnType<typeof bindSwDetail>,
  fallbackFaq: CommonFaqEntry[],
) {
  return {
    downloads: props.downloads,
    docTypeOptions: props.docTypeOptions,
    productCodes: props.productCodes,
    techHubCopy: props.techHubCopy,
    highlights: props.highlights,
    faqItems: props.dbFaq.length > 0 ? props.dbFaq : fallbackFaq,
    connectPortalHref: bind.connectPortal,
  };
}

function resolveSwOverview(
  overview: SoftwareOverviewData,
  infoDesc: string,
): SoftwareOverviewData {
  return infoDesc ? { ...overview, description: infoDesc } : overview;
}

function resolveSwFeatures(
  keyFeatures: readonly SwKeyFeature[],
  fallback: SwProductFeaturesConfig,
): SwProductFeaturesConfig {
  if (keyFeatures.length === 0) {
    return fallback;
  }
  return fallback.variant === "list"
    ? {
        variant: "list",
        title: fallback.title,
        items: mapSwKeyFeatures(keyFeatures, "list"),
      }
    : {
        variant: "desc",
        title: fallback.title,
        items: mapSwKeyFeatures(keyFeatures, "desc"),
      };
}

function ScadaDetail(props: SwDetailProps) {
  const bind = bindSwDetail(props.row);
  return (
    <SwProductDetailShell
      pageClassName="devices-page devices-page--product devices-page--hvdc"
      pageId="Page_devices_hvdc"
      hero={{
        title: bind.title ?? hvdcHero.title,
        description: bind.description ?? hvdcHero.description,
        tagline: hvdcHero.tagline,
        showTagline: true,
        contactHref: props.contactHref,
      }}
      overview={resolveSwOverview(hvdcOverview, bind.infoDesc)}
      overviewImageMode="img"
      features={resolveSwFeatures(bind.keyFeatures, {
        variant: "list",
        title: hvdcBenefitsSection.title,
        items: hvdcBenefitsSection.items,
      })}
      applicationsSlot={
        <DevicesProductApplications
          title={hvdcApplicationsSection.title}
          description={hvdcApplicationsSection.description}
          items={hvdcApplicationsSection.items}
        />
      }
      whySlot={
        <DevicesProductWhy
          title={hvdcWhySection.title}
          blocks={hvdcWhySection.blocks}
        />
      }
      {...swShellCommonProps(props, bind, hvdcFaqItems)}
    />
  );
}

function XemsDetail(props: SwDetailProps) {
  const bind = bindSwDetail(props.row);
  return (
    <SwProductDetailShell
      pageClassName="devices-page devices-page--product devices-page--xems"
      pageId="P-FO-PROD-040000P"
      hero={{
        title: bind.title ?? xemsHero.title,
        description: bind.description ?? xemsHero.description,
        contactHref: props.contactHref,
      }}
      overview={resolveSwOverview(xemsOverview, bind.infoDesc)}
      overviewImageMode="bg"
      features={resolveSwFeatures(bind.keyFeatures, {
        variant: "desc",
        title: xemsBenefitsSection.title,
        items: xemsBenefitsSection.items,
      })}
      applicationsSlot={<DevicesXemsEnergySolutions />}
      whySlot={
        <DevicesProductWhy
          title={xemsWhySection.title}
          blocks={xemsWhySection.blocks}
          imageOnly
        />
      }
      {...swShellCommonProps(props, bind, xemsFaqItems)}
    />
  );
}

function MicroGridDetail(props: SwDetailProps) {
  const bind = bindSwDetail(props.row);
  return (
    <SwProductDetailShell
      pageClassName="devices-page devices-page--product devices-page--micro-grid"
      pageId="P-FO-PROD-040000P"
      hero={{
        title: bind.title ?? microGridHero.title,
        description: bind.description ?? microGridHero.description,
        multilineDescription: true,
        contactHref: props.contactHref,
      }}
      overview={resolveSwOverview(microGridOverview, bind.infoDesc)}
      overviewImageMode="bg"
      features={resolveSwFeatures(bind.keyFeatures, {
        variant: "list",
        title: microGridBenefitsSection.title,
        items: microGridBenefitsSection.items,
      })}
      applicationsSlot={
        <DevicesProductApplications
          title={microGridApplicationsSection.title}
          description={microGridApplicationsSection.description}
          items={microGridApplicationsSection.items}
        />
      }
      whySlot={<DevicesMicroGridHighlights />}
      {...swShellCommonProps(props, bind, microGridFaqItems)}
    />
  );
}

function SmartFactoryDetail(props: SwDetailProps) {
  const bind = bindSwDetail(props.row);
  return (
    <SwProductDetailShell
      pageClassName="devices-page devices-page--product devices-page--smart-factory"
      pageId="P-FO-PROD-040000P"
      hero={{
        title: bind.title ?? smartFactoryHero.title,
        description: bind.description ?? smartFactoryHero.description,
        contactHref: props.contactHref,
      }}
      overview={resolveSwOverview(smartFactoryOverview, bind.infoDesc)}
      overviewImageMode="bg"
      features={resolveSwFeatures(bind.keyFeatures, {
        variant: "list",
        title: smartFactoryBenefitsSection.title,
        items: smartFactoryBenefitsSection.items,
      })}
      applicationsSlot={
        <DevicesProductApplications
          title={smartFactoryApplicationsSection.title}
          description={smartFactoryApplicationsSection.description}
          items={smartFactoryApplicationsSection.items}
        />
      }
      whySlot={
        <DevicesProductWhy
          title={smartFactoryWhySection.title}
          description={smartFactoryWhySection.description}
          blocks={smartFactoryWhySection.blocks}
          imageOnly
        />
      }
      {...swShellCommonProps(props, bind, smartFactoryFaqItems)}
    />
  );
}

const SW_DETAIL_COMPONENTS: Record<
  string,
  ((props: SwDetailProps) => ReactElement) | undefined
> = {
  scada: ScadaDetail,
  xems: XemsDetail,
  "micro-grid": MicroGridDetail,
  "smart-factory": SmartFactoryDetail,
};

export default async function SwProductDetail({
  slug,
  row,
  categoryId,
}: {
  slug: string;
  row: Record<string, unknown> | null;
  categoryId?: number;
}) {
  const productId = row ? Number(row._id) : null;
  const productCode = row ? String(row["product.product_code"] ?? "").trim() : "";
  const productCodes = productCode ? [productCode] : [];
  const isSwSlug = (SW_PRODUCT_SLUGS as readonly string[]).includes(slug);
  const [dbFaq, downloadsData, lv2Name, highlights] = await Promise.all([
    productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
    fetchProductDownloadsInitialData(productCodes),
    isSwSlug && productId
      ? fetchProductLv2Name(productId)
      : Promise.resolve(""),
    productId ? fetchProductInsights(productId) : Promise.resolve([]),
  ]);
  const techHubCopy = buildSwProductTechHubBannerCopy(lv2Name);
  const contactHref = withProductInquiryContext(
    "/support/contact-us",
    categoryId,
    productId,
  );

  const Detail = SW_DETAIL_COMPONENTS[slug];
  if (!Detail) {
    return <GenericProductDetail row={row} categoryId={categoryId} />;
  }

  return (
    <Detail
      row={row}
      dbFaq={dbFaq}
      downloads={downloadsData.page}
      docTypeOptions={downloadsData.docTypeOptions}
      productCodes={productCodes}
      techHubCopy={techHubCopy}
      highlights={highlights}
      contactHref={contactHref}
    />
  );
}
