import type { HighlightNewsItem } from "@/types/highlightNews";
import type { FaqItem, ProductItem } from "@/app/markets/data/marketsContent";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, itemUrl, pageUrl, type JsonLdNode } from "./builders";
import { WEBSITE_ID } from "./siteConfig";

const ACTION_PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
];

const CONNECT_PORTAL_URL = "https://connect.ls-electric.com/";

export function buildMarketsPageGraph(input: {
  pathname: string;
  marketName: string;
  meta: { metaTitle: string; metaDescription: string };
  faqItems: FaqItem[];
  highlightItems: HighlightNewsItem[];
  productItems: ProductItem[];
  whitepaperUrl?: string;
}): { "@context": string; "@graph": JsonLdNode[] } {
  const { pathname, marketName, meta, faqItems, highlightItems, productItems, whitepaperUrl } = input;
  const currentUrl = pageUrl(pathname);

  const potentialAction: JsonLdNode[] = [
    {
      "@type": "CommunicateAction",
      name: "Contact us",
      target: {
        "@type": "EntryPoint",
        urlTemplate: pageUrl("/support/contact-us"),
        actionPlatform: ACTION_PLATFORMS,
      },
    },
    ...(whitepaperUrl
      ? [
          {
            "@type": "DownloadAction",
            name: "Download Whitepaper",
            target: {
              "@type": "EntryPoint",
              urlTemplate: whitepaperUrl,
              actionPlatform: ACTION_PLATFORMS,
            },
          },
        ]
      : []),
    {
      "@type": "Action",
      name: "Connect Portal",
      target: {
        "@type": "EntryPoint",
        urlTemplate: CONNECT_PORTAL_URL,
        actionPlatform: ACTION_PLATFORMS,
      },
    },
  ];

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
    potentialAction,
  };

  return buildPageGraph([
    webpageNode,
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(pathname, currentUrl)),
  ]);
}
