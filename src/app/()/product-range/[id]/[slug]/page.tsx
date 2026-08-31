import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import DevicesCategoryList from "@/app/()/products-systems/components/DevicesCategoryList";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesPageFooter from "@/app/()/products-systems/components/DevicesPageFooter";
import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import {
  fetchCategoryBySlug,
  fetchCategoryLv2Products,
  fetchProductDetailById,
  fetchProductSeoById,
} from "@/app/()/products-systems/data/productsSystemsData";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
import {
  parseCategoryContext,
  withCategoryContext,
} from "@/lib/navigation/categoryContext";
import { fetchCategoryInsightsLv2 } from "@/data/highlightNews";
import { contentDetailPath } from "@/lib/contentDetailPath";
import { isNumericId } from "@/lib/isNumericId";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, itemUrl, pageUrl } from "@/lib/structuredData/builders";
import {
  SITE_URL,
  WEBSITE_ID,
  ORG_ID,
  GICS_SUPPORT_URL,
  CONNECT_PORTAL_EXTERNAL_URL,
} from "@/lib/structuredData/siteConfig";
import "@/assets/css/devices-systems.css";

const ACTION_PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
];

async function fetchLv1Parent(
  lv2CategoryId: number,
): Promise<{ id: number | null; name: string; slug: string }> {
  const rows = await fetchDevicesTreeRows();
  const lv2Row = rows.find((r) => r.depth === "2" && r.rowId === lv2CategoryId);
  const lv1Row = lv2Row
    ? rows.find((r) => r.depth === "1" && String(r.rowId) === lv2Row.parentId)
    : undefined;
  return {
    id: lv1Row?.rowId ?? null,
    name: lv1Row?.categoryTitle ?? "",
    slug: lv1Row?.categorySlug ?? "",
  };
}

type ProductRangePageProps = {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

async function resolveRangeCategory(id: string, slug: string) {
  const category = await fetchCategoryBySlug(slug, {
    depth: 2,
    categoryId: Number(id),
  });
  return category && category.id === Number(id) ? category : null;
}

async function resolveRangeProduct(id: string, slug: string) {
  const row = await fetchProductDetailById(Number(id));
  return row && row["seo.slug"] === slug ? row : null;
}

export async function generateMetadata(
  { params }: ProductRangePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id, slug } = await params;
  if (!isNumericId(id)) notFound();

  const [category, previous] = await Promise.all([
    resolveRangeCategory(id, slug),
    parent,
  ]);
  if (category) {
    return mergeSeoMetadata(
      previous,
      category.metaTitle ?? "",
      category.metaDescription ?? "",
    );
  }

  const seo = await fetchProductSeoById(Number(id));
  if (!seo) notFound();

  return mergeSeoMetadata(
    previous,
    seo.metaTitle ?? "",
    seo.metaDescription ?? "",
  );
}

export default async function ProductRangeRoutePage({
  params,
  searchParams,
}: ProductRangePageProps) {
  const { id, slug } = await params;
  if (!isNumericId(id)) notFound();
  const { category: categoryParam } = await searchParams;
  const categoryId = parseCategoryContext(categoryParam);

  const numId = Number(id);
  const [category, productCards, highlightItems, lv1] = await Promise.all([
    resolveRangeCategory(id, slug),
    fetchCategoryLv2Products(numId),
    fetchCategoryInsightsLv2(numId),
    fetchLv1Parent(numId),
  ]);
  if (category) {
    const intro = {
      parentLabel: lv1.name || "Products & Systems",
      title: category.title,
      description: category.description,
    };
    const currentUrl = pageUrl(contentDetailPath("/product-range", id, slug));
    const highlightsWithUrl = highlightItems
      .map((a) => ({ a, url: itemUrl(a.href) }))
      .filter((x): x is { a: (typeof highlightItems)[number]; url: string } => x.url !== null);
    const productsWithUrl = productCards
      .map((p) => ({ p, url: itemUrl(p.href) }))
      .filter((x): x is { p: (typeof productCards)[number]; url: string } => x.url !== null);
    const jsonLdGraph = buildPageGraph([
      {
        "@type": "CollectionPage",
        "@id": `${currentUrl}#webpage`,
        url: currentUrl,
        name: category.metaTitle || category.title,
        description: category.metaDescription || category.description,
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
        mainEntity: { "@id": `${currentUrl}#productgroup` },
        ...(highlightsWithUrl.length
          ? {
              about: [
                {
                  "@type": "ItemList",
                  name: "Highlights(Related Articles)",
                  itemListElement: highlightsWithUrl.slice(0, 10).map(({ a, url }, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    item: { "@type": "Article", headline: a.title, url },
                  })),
                },
              ],
            }
          : {}),
        potentialAction: [
          {
            "@type": "BuyAction",
            name: "Request a quote or Place an order",
            target: {
              "@type": "EntryPoint",
              urlTemplate: CONNECT_PORTAL_EXTERNAL_URL,
              actionPlatform: ACTION_PLATFORMS,
            },
          },
          {
            "@type": "SearchAction",
            name: "Find an Authorized Distributor",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/support/where-to-buy`,
              actionPlatform: ACTION_PLATFORMS,
            },
          },
          {
            "@type": "Action",
            name: "Get Technical Support & Service",
            target: {
              "@type": "EntryPoint",
              urlTemplate: GICS_SUPPORT_URL,
              actionPlatform: ACTION_PLATFORMS,
            },
          },
        ],
      },
      {
        "@type": "ProductGroup",
        "@id": `${currentUrl}#productgroup`,
        name: category.title,
        description: category.description,
        url: currentUrl,
        brand: { "@id": ORG_ID },
        hasPart: productsWithUrl.slice(0, 30).map(({ p, url }, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Product", name: p.title, url },
        })),
      },
      breadcrumbList(currentUrl, [
        { name: "Products & Systems", url: `${SITE_URL}#products-and-systems` },
        ...(lv1.name
          ? [
              {
                name: lv1.name,
                url:
                  lv1.id !== null && lv1.slug
                    ? pageUrl(contentDetailPath("/product-category", lv1.id, lv1.slug))
                    : currentUrl,
              },
            ]
          : []),
        { name: category.title, url: currentUrl },
      ]),
    ]);
    return (
      <main className="devices-page" id="Page_product_range">
        <JsonLd data={jsonLdGraph} />
        <DevicesCategoryList
          layout="stacked"
          intro={intro}
          products={productCards}
        />
        <DevicesMarkets />
        <DevicesHelp variant="overlay" />
        <DevicesPageFooter
          highlightItems={highlightItems}
          bannerLinkHref={withCategoryContext(
            "/support/contact-us",
            category.id,
          )}
        />
      </main>
    );
  }

  const row = await resolveRangeProduct(id, slug);
  if (!row) notFound();

  return <ProductDetailRouter slug={slug} row={row} categoryId={categoryId} />;
}
