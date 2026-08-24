import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesExploreAll from "../components/DevicesExploreAll";
import type { GnbExploreProduct } from "@/data/gnbExploreAllProducts";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
import { withCategoryContext } from "@/lib/navigation/categoryContext";
import { contentDetailPath } from "@/lib/contentDetailPath";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { SITE_URL, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/devices-systems.css";

const MULTI_CATEGORY_PREFERRED_LV2_IDS: readonly string[] = ["587"];

const DISCONTINUED_ORDER_STATUS = "99";

function resolvePrimaryLv2Id(lv2Ids: string[]): string | undefined {
  if (lv2Ids.length <= 1) return lv2Ids[0];
  return (
    MULTI_CATEGORY_PREFERRED_LV2_IDS.find((id) => lv2Ids.includes(id)) ??
    lv2Ids[0]
  );
}

type ExploreProductSource = {
  productId: number;
  title: string;
  slug: string;
  orderStatus: string;
  lv2Ids: string[];
};

export default async function ExploreAllProductsPage() {
  const deviceRows = await fetchDevicesTreeRows();

  const visibleLv1Ids = new Set(
    deviceRows.filter((r) => r.depth === "1").map((r) => String(r.rowId)),
  );
  const visibleLv2Rows = deviceRows.filter(
    (r) => r.depth === "2" && r.parentId != null && visibleLv1Ids.has(r.parentId),
  );
  const visibleLv2Ids = new Set(visibleLv2Rows.map((r) => String(r.rowId)));

  const productSources = new Map<number, ExploreProductSource>();
  for (const r of deviceRows) {
    if (r.depth !== "3") continue;
    if (r.productId == null || r.parentId == null) continue;
    if (!visibleLv2Ids.has(r.parentId)) continue;
    if (!r.productTitle) continue;

    const existing = productSources.get(r.productId);
    if (existing) {
      if (!existing.lv2Ids.includes(r.parentId)) {
        existing.lv2Ids.push(r.parentId);
      }
      continue;
    }
    productSources.set(r.productId, {
      productId: r.productId,
      title: r.productTitle,
      slug: r.productSlug ?? "",
      orderStatus: r.productOrderStatus ?? "",
      lv2Ids: [r.parentId],
    });
  }

  const exploreProducts: GnbExploreProduct[] = [...productSources.values()].map(
    (source) => ({
      id: String(source.productId),
      label: source.title,
      href: source.slug
        ? withCategoryContext(
            contentDetailPath("/product", source.productId, source.slug),
            resolvePrimaryLv2Id(source.lv2Ids),
          )
        : "#",
      discontinued: source.orderStatus === DISCONTINUED_ORDER_STATUS,
      lv2Ids: source.lv2Ids,
    }),
  );

  const lv1Rows = deviceRows.filter((r) => r.depth === "1");
  const lv1Categories = lv1Rows.map((r) => ({
    id: String(r.rowId),
    label: r.categoryTitle ?? "",
  }));
  const lv2CategoriesByLv1: Record<string, { id: string; label: string }[]> = {};
  for (const r of visibleLv2Rows) {
    const parent = r.parentId as string;
    (lv2CategoriesByLv1[parent] ??= []).push({
      id: String(r.rowId),
      label: r.categoryTitle ?? "",
    });
  }

  const currentUrl = pageUrl("/products-systems/explore-all");
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "CollectionPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: "Explore All Products",
      description:
        "Find any LS ELECTRIC America product quickly — browse our full lineup, organized from A to Z.",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        name: "Products & Systems",
        itemListElement: lv1Rows.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: r.categoryTitle ?? "",
            url: r.categorySlug ? pageUrl(`/product-category/${r.categorySlug}`) : currentUrl,
          },
        })),
      },
    },
    breadcrumbList(currentUrl, [
      { name: "Products & Systems", url: `${SITE_URL}#products-and-systems` },
      { name: "Explore All Products", url: currentUrl },
    ]),
  ]);

  return (
    <main className="devices-page" id="Page_devices_explore_all">
      <JsonLd data={jsonLdGraph} />
      <section className="devices_explore">
        <div className="inner">
          <header className="devices_explore__head">
            <h1 className="devices_explore__tit">
              Explore<span className="devices_explore__tit-space"> </span>
              <br className="devices_explore__tit-br" aria-hidden />
              <span className="devices_explore__tit-rest">All Products</span>
            </h1>
            <p className="devices_explore__desc">
              Find any LS ELECTRIC America product quickly — browse our full lineup,
              organized from A to Z.
            </p>
          </header>
          <DevicesExploreAll
            products={exploreProducts}
            lv1Categories={lv1Categories}
            lv2CategoriesByLv1={lv2CategoriesByLv1}
          />
        </div>
      </section>
      <CommonBanner04 />
    </main>
  );
}
