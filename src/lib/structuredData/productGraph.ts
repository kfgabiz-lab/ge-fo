import type { CommonFaqEntry } from "@/components/faq/CommonFaq";
import type { HighlightNewsItem } from "@/types/highlightNews";
import type { ProductOtherItem } from "@/app/()/products-systems/data/productDetailContent";
import { breadcrumbList, buildPageGraph, itemUrl, pageUrl, type JsonLdNode } from "./builders";
import { contentDetailPath } from "@/lib/contentDetailPath";
import {
  SITE_URL,
  WEBSITE_ID,
  ORG_ID,
  CONNECT_PORTAL_EXTERNAL_URL,
  GICS_SUPPORT_URL,
} from "./siteConfig";

const ACTION_PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
];

function itemListOfProducts(name: string, items: ProductOtherItem[]): JsonLdNode | null {
  const withUrl = items
    .map((item) => ({ item, url: itemUrl(item.href) }))
    .filter((x): x is { item: ProductOtherItem; url: string } => x.url !== null);
  if (!withUrl.length) return null;
  return {
    "@type": "ItemList",
    name,
    itemListElement: withUrl.slice(0, 10).map(({ item, url }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "Product", name: item.title, url },
    })),
  };
}

function itemListOfArticles(items: HighlightNewsItem[]): JsonLdNode | null {
  const withUrl = items
    .map((item) => ({ item, url: itemUrl(item.href) }))
    .filter((x): x is { item: HighlightNewsItem; url: string } => x.url !== null);
  if (!withUrl.length) return null;
  return {
    "@type": "ItemList",
    name: "Highlights(Related Articles)",
    itemListElement: withUrl.slice(0, 10).map(({ item, url }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "Article", headline: item.title, url },
    })),
  };
}

function faqPage(items: CommonFaqEntry[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildProductJsonLdGraph(input: {
  id: number;
  slug: string;
  row: Record<string, unknown> | null;
  detail: { series: string; description: string; connectPortal?: string; specs: { label: string; value: string }[] };
  lv1Name: string;
  lv1Slug: string;
  lv2Name: string;
  lv2Slug: string;
  otherProducts: ProductOtherItem[];
  insights: HighlightNewsItem[];
  faqItems: CommonFaqEntry[];
}): { "@context": string; "@graph": JsonLdNode[] } {
  const { id, slug, row, detail, lv1Name, lv1Slug, lv2Name, lv2Slug, otherProducts, insights, faqItems } = input;
  const currentUrl = pageUrl(contentDetailPath("/product", id, slug));
  const metaTitle = (row?.["seo.meta_title"] as string) || detail.series;
  const metaDescription = (row?.["seo.meta_description"] as string) || detail.description;
  const connectPortalUrl = detail.connectPortal || CONNECT_PORTAL_EXTERNAL_URL;
  const whereToBuyUrl = `${SITE_URL}/support/where-to-buy`;

  const potentialAction = [
    {
      "@type": "BuyAction",
      name: "Request a quote or Place an order",
      target: {
        "@type": "EntryPoint",
        urlTemplate: connectPortalUrl,
        actionPlatform: ACTION_PLATFORMS,
      },
    },
    {
      "@type": "SearchAction",
      name: "Find an Authorized Distributor",
      target: {
        "@type": "EntryPoint",
        urlTemplate: whereToBuyUrl,
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
  ];

  const productNode: JsonLdNode = {
    "@type": "Product",
    "@id": `${currentUrl}#product`,
    name: detail.series,
    description: detail.description,
    brand: { "@type": "Brand", name: "LS ELECTRIC" },
    ...(lv2Name ? { category: lv2Name } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: 0,
      availability: "https://schema.org/InStock",
      description:
        "B2B Product Exhibition Only. Contact sales for technical specifications, custom solutions, and pricing details.",
      url: connectPortalUrl,
      seller: { "@id": ORG_ID },
    },
    ...(detail.specs.length
      ? {
          additionalProperty: detail.specs.slice(0, 3).map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
    potentialAction,
  };

  const about: JsonLdNode[] = [];
  const otherProductsList = itemListOfProducts("Other Products", otherProducts);
  if (otherProductsList) about.push(otherProductsList);
  const articlesList = itemListOfArticles(insights);
  if (articlesList) about.push(articlesList);
  if (faqItems.length) about.push(faqPage(faqItems));

  const webpageNode: JsonLdNode = {
    "@type": "WebPage",
    "@id": `${currentUrl}#webpage`,
    url: currentUrl,
    name: metaTitle,
    description: metaDescription,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
    mainEntity: { "@id": `${currentUrl}#product` },
    ...(about.length ? { about } : {}),
    potentialAction: potentialAction.slice(0, 2),
  };

  const crumbs = [
    { name: "Products & Systems", url: `${SITE_URL}#products-and-systems` },
    ...(lv1Name
      ? [{ name: lv1Name, url: lv1Slug ? pageUrl(`/product-category/${lv1Slug}`) : `${currentUrl}#lv1` }]
      : []),
    ...(lv2Name
      ? [{ name: lv2Name, url: lv2Slug ? pageUrl(`/product-range/${lv2Slug}`) : `${currentUrl}#lv2` }]
      : []),
    { name: detail.series, url: currentUrl },
  ];

  return buildPageGraph([webpageNode, productNode, breadcrumbList(currentUrl, crumbs)]);
}
