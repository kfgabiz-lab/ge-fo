import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesHero from "@/app/()/products-systems/components/DevicesHero";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesPageFooter from "@/app/()/products-systems/components/DevicesPageFooter";
import {
  fetchCategoryBySlug,
  fetchVisibleLv2Categories,
} from "@/app/()/products-systems/data/productsSystemsData";
import { fetchCategoryInsights } from "@/data/highlightNews";
import { withCategoryContext } from "@/lib/navigation/categoryContext";
import { contentDetailPath } from "@/lib/contentDetailPath";
import { isNumericId } from "@/lib/isNumericId";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, itemUrl, pageUrl } from "@/lib/structuredData/builders";
import {
  SITE_URL,
  WEBSITE_ID,
  GICS_SUPPORT_URL,
  CONNECT_PORTAL_EXTERNAL_URL,
} from "@/lib/structuredData/siteConfig";
import "@/assets/css/devices-systems.css";

const ACTION_PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
];

type ProductsCategoryPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata(
  { params }: ProductsCategoryPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id, slug } = await params;
  if (!isNumericId(id)) notFound();

  const [category, previous] = await Promise.all([
    fetchCategoryBySlug(slug, { depth: 1, categoryId: Number(id) }),
    parent,
  ]);
  if (!category || category.id !== Number(id)) notFound();

  return mergeSeoMetadata(
    previous,
    category.metaTitle ?? "",
    category.metaDescription ?? "",
  );
}

export default async function ProductsCategoryRoutePage({
  params,
}: ProductsCategoryPageProps) {
  const { id, slug } = await params;
  if (!isNumericId(id)) notFound();

  const category = await fetchCategoryBySlug(slug, {
    depth: 1,
    categoryId: Number(id),
  });
  if (!category || category.id !== Number(id)) notFound();

  const [products, highlightItems] = await Promise.all([
    fetchVisibleLv2Categories(category.id),
    fetchCategoryInsights(category.id),
  ]);

  const currentUrl = pageUrl(contentDetailPath("/product-category", id, slug));
  const productsWithUrl = products
    .map((p) => ({ p, url: itemUrl(p.href) }))
    .filter((x): x is { p: (typeof products)[number]; url: string } => x.url !== null);
  const highlightsWithUrl = highlightItems
    .map((a) => ({ a, url: itemUrl(a.href) }))
    .filter((x): x is { a: (typeof highlightItems)[number]; url: string } => x.url !== null);
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "CollectionPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: category.metaTitle || category.title,
      description: category.metaDescription || category.description,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        name: category.title,
        description: category.description,
        itemListElement: productsWithUrl.slice(0, 20).map(({ p, url }, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Product", name: p.title, url },
        })),
      },
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
    breadcrumbList(currentUrl, [
      { name: "Products & Systems", url: `${SITE_URL}#products-and-systems` },
      { name: category.title, url: currentUrl },
    ]),
  ]);

  return (
    <main className="devices-page" id="Page_products_category">
      <JsonLd data={jsonLdGraph} />
      <DevicesHero
        withProducts
        title={category.title}
        description={category.description}
        products={products}
      />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter
        highlightItems={highlightItems}
        bannerLinkHref={withCategoryContext("/support/contact-us", category.id)}
      />
    </main>
  );
}
