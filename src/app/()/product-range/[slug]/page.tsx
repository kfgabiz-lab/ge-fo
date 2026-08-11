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
  fetchProductBySlug,
  fetchProductSeoBySlug,
} from "@/app/()/products-systems/data/productsSystemsData";
import {
  parseCategoryContext,
  withCategoryContext,
} from "@/lib/navigation/categoryContext";
import { fetchCategoryInsightsLv2 } from "@/data/highlightNews";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, itemUrl, pageUrl } from "@/lib/structuredData/builders";
import { SITE_URL, WEBSITE_ID, ORG_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/devices-systems.css";

type ProductRangePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata(
  { params, searchParams }: ProductRangePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const { category: categoryParam } = await searchParams;
  const categoryId = parseCategoryContext(categoryParam);

  const [category, previous] = await Promise.all([
    fetchCategoryBySlug(slug, { depth: 2, categoryId }),
    parent,
  ]);
  if (category) {
    return mergeSeoMetadata(
      previous,
      category.metaTitle ?? "",
      category.metaDescription ?? "",
    );
  }

  const seo = await fetchProductSeoBySlug(slug, { categoryId });
  return mergeSeoMetadata(
    previous,
    seo?.metaTitle ?? "",
    seo?.metaDescription ?? "",
  );
}

export default async function ProductRangeRoutePage({
  params,
  searchParams,
}: ProductRangePageProps) {
  const { slug } = await params;
  const { category: categoryParam } = await searchParams;
  const categoryId = parseCategoryContext(categoryParam);

  const category = await fetchCategoryBySlug(slug, { depth: 2, categoryId });
  if (category) {
    const productCards = await fetchCategoryLv2Products(category.id);
    const highlightItems = await fetchCategoryInsightsLv2(category.id);
    const intro = {
      parentLabel: "Products & Systems",
      title: category.title,
      description: category.description,
    };
    const currentUrl = pageUrl(`/product-range/${slug}`);
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

  const row = await fetchProductBySlug(slug, { categoryId });
  if (!row) notFound();

  return <ProductDetailRouter slug={slug} row={row} categoryId={categoryId} />;
}
