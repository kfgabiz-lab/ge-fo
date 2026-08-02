import type { ReactNode } from "react";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import CommonFaq, { type CommonFaqEntry } from "@/components/faq/CommonFaq";
import DevicesProductFeaturesSection, {
  type DevicesProductFeatureDescItem,
  type DevicesProductFeatureListItem,
} from "@/components/content/DevicesProductFeaturesSection";
import DevicesHelp from "../DevicesHelp";
import DevicesMarkets from "../DevicesMarkets";
import DevicesProductDownloads from "./DevicesProductDownloads";
import DevicesProductNavScope from "./DevicesProductNavScope";
import DevicesProductOtherProducts from "./DevicesProductOtherProducts";
import DevicesSoftwareHero, {
  type DevicesSoftwareHeroProps,
} from "./DevicesSoftwareHero";
import DevicesSoftwareOverview, {
  type SoftwareOverviewData,
} from "./DevicesSoftwareOverview";
import type {
  ProductDownloadsPage,
  ProductOtherItem,
} from "../../data/productDetailContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import {
  buildSwProductTechHubBannerCopy,
  type ProductTechHubBanner,
} from "@/data/support/techHubData";
import type { HighlightNewsItem } from "@/types/highlightNews";
import {
  SW_PRODUCT_NAV_ITEMS,
  SW_PRODUCT_OTHER_PRODUCTS_TITLE,
} from "../../data/swProductCommon";

const swFaqDescription = (
  <>
    Find quick answers to common questions about installation, troubleshooting, and
    maintenance.
    <br />
    Our expert engineering team has curated these responses to help you optimize product
    performance.
  </>
);

export type SwProductFeaturesConfig =
  | {
      variant: "list";
      title: string;
      items: DevicesProductFeatureListItem[];
    }
  | {
      variant: "desc";
      title: string;
      items: DevicesProductFeatureDescItem[];
    };

export type SwProductDetailShellProps = {
  pageClassName: string;
  pageId: string;
  hero: DevicesSoftwareHeroProps;
  overview: SoftwareOverviewData;
  overviewImageMode: "img" | "bg";
  features: SwProductFeaturesConfig;
  applicationsSlot: ReactNode;
  whySlot: ReactNode;
  downloads: ProductDownloadsPage;
  docTypeOptions?: DownloadFilterOption[];
  productCodes: string[];
  techHubBanner: ProductTechHubBanner | null;
  highlights: HighlightNewsItem[];
  faqItems: CommonFaqEntry[];
  connectPortalHref?: string;
  otherProducts: ProductOtherItem[];
};

function filterSwNavItems<T extends { readonly id: string }>(
  navItems: readonly T[],
  showDownloads: boolean,
  showOtherProducts: boolean,
): T[] {
  return navItems.filter((item) => {
    if (item.id === "product-downloads") return showDownloads;
    if (item.id === "product-other") return showOtherProducts;
    return true;
  });
}

export default function SwProductDetailShell({
  pageClassName,
  pageId,
  hero,
  overview,
  overviewImageMode,
  features,
  applicationsSlot,
  whySlot,
  downloads,
  docTypeOptions = [],
  productCodes,
  techHubBanner,
  highlights,
  faqItems,
  connectPortalHref,
  otherProducts,
}: SwProductDetailShellProps) {
  const showDownloads = downloads.totalElements > 0;
  const showOtherProducts = otherProducts.length > 0;
  return (
    <main className={pageClassName} id={pageId}>
      <DevicesSoftwareHero {...hero} />
      <DevicesProductNavScope
        navItems={filterSwNavItems(
          SW_PRODUCT_NAV_ITEMS,
          showDownloads,
          showOtherProducts,
        )}
      >
        <DevicesSoftwareOverview data={overview} imageMode={overviewImageMode} />
        {features.variant === "list" ? (
          <DevicesProductFeaturesSection
            variant="list"
            sectionId="product-benefits"
            title={features.title}
            items={features.items}
          />
        ) : (
          <DevicesProductFeaturesSection
            variant="desc"
            sectionId="product-benefits"
            title={features.title}
            items={features.items}
          />
        )}
        {applicationsSlot}
        {whySlot}
        {showDownloads ? (
          <DevicesProductDownloads
            initial={downloads}
            productCodes={productCodes}
            docTypeOptions={docTypeOptions}
          />
        ) : null}
        {techHubBanner ? (
          <CommonBanner03
            linkHref={techHubBanner.href}
            imageSrc={techHubBanner.posterSrc ?? undefined}
            {...buildSwProductTechHubBannerCopy(techHubBanner)}
          />
        ) : null}
        <DevicesProductOtherProducts
          title={SW_PRODUCT_OTHER_PRODUCTS_TITLE}
          items={otherProducts}
        />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp
          variant="overlay"
          sectionId="product-help"
          connectPortalHref={connectPortalHref}
        />
      </DevicesProductNavScope>
      <CommonBanner04 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={highlights}
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
