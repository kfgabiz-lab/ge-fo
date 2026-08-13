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
import DevicesProductOtherProducts from "./DevicesProductOtherProducts";
import DevicesProductLineupGrid from "./DevicesProductLineupGrid";
import {
  productDetailNavItems,
  productTemplateDetail,
  fetchProductDownloadsInitialData,
} from "../../data/productDetailContent";
import { buildHwProductDetail } from "../../data/hwProductDetail";
import {
  fetchProductFaqItems,
  fetchProductLv2Context,
  fetchProductManagerEmail,
} from "../../data/productsSystemsData";
import { fetchProductInsights } from "@/data/highlightNews";
import { withProductInquiryContext } from "@/lib/navigation/categoryContext";
import {
  buildHwProductTechHubBannerCopy,
  fetchProductTechHubBanner,
} from "@/data/support/techHubData";
import JsonLd from "@/components/seo/JsonLd";
import { buildProductJsonLdGraph } from "@/lib/structuredData/productGraph";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default async function GenericProductDetail({
  slug,
  row,
  categoryId,
}: {
  slug?: string;
  row: Record<string, unknown> | null;
  categoryId?: number;
}) {
  const { detail, productId } = buildHwProductDetail(row, productTemplateDetail);
  const productCode = row ? String(row["product.product_code"] ?? "").trim() : "";
  const productCodes = productCode ? [productCode] : [];
  const [
    faqItems,
    lv2Context,
    managerEmail,
    insights,
    downloadsData,
    techHubBanner,
  ] = await Promise.all([
    productId ? fetchProductFaqItems(productId) : Promise.resolve([]),
    productId
      ? fetchProductLv2Context(productId)
      : Promise.resolve({
          lv2Name: "",
          lv2Slug: "",
          lv1Name: "",
          lv1Slug: "",
          otherProducts: [],
        }),
    productId ? fetchProductManagerEmail(productId) : Promise.resolve(""),
    productId ? fetchProductInsights(productId) : Promise.resolve([]),
    fetchProductDownloadsInitialData(productCodes),
    productId
      ? fetchProductTechHubBanner(productId, categoryId)
      : Promise.resolve(null),
  ]);

  const { docTypeOptions, page: downloadsPage } = downloadsData;

  const { lv2Name, lv2Slug, lv1Name, lv1Slug, otherProducts } = lv2Context;
  const heroDetail = { ...detail, category: lv2Name };
  const inquiryHref = withProductInquiryContext(
    detail.expertBannerHref ?? "/support/contact-us",
    categoryId,
    productId,
  );
  const otherProductsTitle = lv2Name
    ? `Explore the ${lv2Name} Products`
    : undefined;

  const showOtherProducts = otherProducts.length > 0;
  const showVideo = Boolean(detail.youtubeVideoId);
  const showKeyFeatures = detail.keyFeatures.length > 0;
  const showLineup = Boolean(detail.lineUp?.trim());
  const showDownloadsSection = downloadsPage.totalElements > 0;
  const visibleNavItems = productDetailNavItems.filter((item) => {
    if (item.id === "product-other") return showOtherProducts;
    if (item.id === "product-video") return showVideo;
    if (item.id === "product-key-feature") return showKeyFeatures;
    if (item.id === "product-lineup") return showLineup;
    if (item.id === "product-downloads") return showDownloadsSection;
    return true;
  });

  const jsonLdGraph = slug
    ? buildProductJsonLdGraph({
        slug,
        row,
        detail,
        lv1Name,
        lv1Slug,
        lv2Name,
        lv2Slug,
        otherProducts,
        insights,
        faqItems,
      })
    : null;

  return (
    <main className="devices-page devices-page--product" id="Page_devices_product">
      {jsonLdGraph ? <JsonLd data={jsonLdGraph} /> : null}
      <DevicesProductHero
        product={heroDetail}
        contactHref={inquiryHref}
        showDownloads={showDownloadsSection}
      />
      <DevicesProductNavScope navItems={visibleNavItems}>
        {showKeyFeatures ? (
          <DevicesProductFeaturesSection
            title="Key Features"
            items={detail.keyFeatures}
          />
        ) : null}
        <CommonBanner02
          variant="expert"
          linkHref={inquiryHref}
          linkExternal={detail.expertBannerExternal}
          contactEmail={managerEmail}
          backgroundSrc={detail.configuratorBannerBg}
        />
        {showLineup ? (
          <section className="devices_product_lineup" id="product-lineup">
            <div className="inner">
              <div className="devices_product_lineup__head">
                <h2 className="section_tit">Lineup</h2>
              </div>
              <div className="devices_product_lineup__grids">
                <DevicesProductLineupGrid modifier="type1">
                  <div
                    data-slug="product-data"
                    data-slugkey="product_etc.line_up"
                    dangerouslySetInnerHTML={{ __html: detail.lineUp }}
                  />
                </DevicesProductLineupGrid>
              </div>
              <div className="devices_product_lineup__footer">
                <div className="devices_product_lineup__note">
                  <p>Explore all available configurations effortlessly.</p>
                  <p>
                    Our Configurator helps you select the right specifications in
                    just a few clicks.
                  </p>
                </div>
                {detail.configuratorHref ? (
                  <a
                    href={detail.configuratorHref}
                    className="btn-base btn-lv02 btn-lv02--solid"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to Configurator
                    <span className="icon_link-14" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
        {showDownloadsSection ? (
          <DevicesProductDownloads
            initial={downloadsPage}
            productCodes={productCodes}
            docTypeOptions={docTypeOptions}
          />
        ) : null}
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
      <DevicesPageFooter
        faqItems={faqItems}
        highlightItems={insights}
        bannerLinkHref={inquiryHref}
      />
    </main>
  );
}
