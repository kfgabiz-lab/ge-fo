import type { HighlightNewsItem } from "@/types/highlightNews";
import type { FaqItem, ProductItem } from "@/app/markets/data/marketsContent";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, itemUrl, pageUrl, type JsonLdNode } from "./builders";
import { WEBSITE_ID } from "./siteConfig";

export function buildMarketsPageGraph(input: {
  pathname: string;
  marketName: string;
  meta: { metaTitle: string; metaDescription: string };
  faqItems: FaqItem[];
  highlightItems: HighlightNewsItem[];
  productItems: ProductItem[];
}): { "@context": string; "@graph": JsonLdNode[] } {
  const { pathname, marketName, meta, faqItems, highlightItems, productItems } = input;
  const currentUrl = pageUrl(pathname);

  const about: JsonLdNode[] = [];
  const productsWithUrl = productItems
    .map((item) => ({ item, url: itemUrl(item.href) }))
    .filter((x): x is { item: ProductItem; url: string } => x.url !== null);
  if (productsWithUrl.length) {
    about.push({
      "@type": "ItemList",
      name: `Related Products for ${marketName}`,
      itemListElement: productsWithUrl.slice(0, 10).map(({ item, url }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "Product", name: item.title, url },
      })),
    });
  }
  const highlightsWithUrl = highlightItems
    .map((item) => ({ item, url: itemUrl(item.href) }))
    .filter((x): x is { item: HighlightNewsItem; url: string } => x.url !== null);
  if (highlightsWithUrl.length) {
    about.push({
      "@type": "ItemList",
      name: "Highlights(Related Articles)",
      itemListElement: highlightsWithUrl.slice(0, 10).map(({ item, url }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "Article", headline: item.title, url },
      })),
    });
  }

  const webpageNode: JsonLdNode = {
    "@type": "WebPage",
    "@id": `${currentUrl}#webpage`,
    url: currentUrl,
    name: meta.metaTitle,
    description: meta.metaDescription,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
    ...(faqItems.length
      ? {
          mainEntity: {
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        }
      : {}),
    ...(about.length ? { about } : {}),
  };

  return buildPageGraph([
    webpageNode,
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(pathname, currentUrl)),
  ]);
}
