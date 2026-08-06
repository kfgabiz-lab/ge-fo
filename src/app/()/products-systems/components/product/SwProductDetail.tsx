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
import {
  mapHwProductData,
  fetchProductFaqItems,
  fetchSwRelevantProducts,
  SW_PRODUCT_SLUGS,
} from "../../data/productsSystemsData";
import {
  fetchProductTechHubBanner,
  type ProductTechHubBanner,
} from "@/data/support/techHubData";
import { fetchProductInsights } from "@/data/highlightNews/highlightNewsData";
import { withProductInquiryContext } from "@/lib/navigation/categoryContext";
import type { HighlightNewsItem } from "@/types/highlightNews";
import {
  fetchProductDownloadsInitialData,
  type ProductDownloadsPage,
  type ProductOtherItem,
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
  techHubBanner: ProductTechHubBanner | null;
  highlights: HighlightNewsItem[];
  contactHref: string;
  otherProducts: ProductOtherItem[];
};

function bindSwDetail(row: Record<string, unknown> | null) {
  const data = row ? mapHwProductData(row) : null;
  const infoDesc = row ? String(row["product_info.info_description"] ?? "") : "";
  return {
    title: data?.name || undefined,
    description: infoDesc || undefined,
    keyFeatures: data?.keyFeatures ?? [],
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
    techHubBanner: props.techHubBanner,
    highlights: props.highlights,
    faqItems: props.dbFaq.length > 0 ? props.dbFaq : fallbackFaq,
    connectPortalHref: bind.connectPortal,
    contactHref: props.contactHref,
    otherProducts: props.otherProducts,
  };
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
      overview={hvdcOverview}
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
      overview={xemsOverview}
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
      overview={microGridOverview}
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
      overview={smartFactoryOverview}
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
  const [dbFaq, downloadsData, techHubBanner, highlights, otherProducts] =
    await Promise.all([
      productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
      fetchProductDownloadsInitialData(productCodes),
      isSwSlug && productId
        ? fetchProductTechHubBanner(productId, categoryId)
        : Promise.resolve(null),
      productId ? fetchProductInsights(productId) : Promise.resolve([]),
      fetchSwRelevantProducts(slug),
    ]);
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
      techHubBanner={techHubBanner}
      highlights={highlights}
      contactHref={contactHref}
      otherProducts={otherProducts}
    />
  );
}
