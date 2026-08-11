import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl, type JsonLdNode } from "./builders";
import { SITE_URL, WEBSITE_ID } from "./siteConfig";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildContentDetailGraph(input: {
  postType: "BlogPosting" | "Article" | "NewsArticle";
  detailPathname: string;
  listPathname: string;
  breadcrumbLabel: string;
  title: string;
  metaDescription: string;
  contentHtml: string;
  publishedAt: string;
  category?: string;
  tags?: string[];
  imagePath?: string | null;
}): { "@context": string; "@graph": JsonLdNode[] } {
  const {
    postType,
    detailPathname,
    listPathname,
    breadcrumbLabel,
    title,
    metaDescription,
    contentHtml,
    publishedAt,
    category,
    tags,
    imagePath,
  } = input;
  const currentUrl = pageUrl(detailPathname);
  const orgId = `${SITE_URL}#organization`;

  const postNode: JsonLdNode = {
    "@type": postType,
    "@id": `${currentUrl}#post`,
    isPartOf: `${currentUrl}#webpage`,
    headline: title,
    description: metaDescription,
    datePublished: publishedAt,
    ...(category ? { articleSection: category } : {}),
    ...(tags && tags.length ? { keywords: tags } : {}),
    articleBody: stripHtml(contentHtml),
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    ...(imagePath
      ? {
          image: {
            "@type": "ImageObject",
            "@id": "#post-image",
            url: pageUrl(imagePath),
          },
        }
      : {}),
  };

  const webpageNode: JsonLdNode = {
    "@type": "WebPage",
    "@id": `${currentUrl}#webpage`,
    url: currentUrl,
    name: title,
    description: metaDescription,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
    mainEntity: { "@id": `${currentUrl}#post` },
  };

  return buildPageGraph([
    webpageNode,
    postNode,
    breadcrumbList(currentUrl, [
      { name: "Company", url: `${SITE_URL}#company` },
      { name: breadcrumbLabel, url: pageUrl(listPathname) },
      { name: title, url: currentUrl },
    ]),
  ]);
}

export function buildContentListGraph(input: {
  itemType: "Article" | "NewsArticle";
  pathname: string;
  meta: { metaTitle: string; metaDescription: string };
  items: { id: string | number; title: string; description: string; rawDate: string; href: string }[];
}): { "@context": string; "@graph": JsonLdNode[] } {
  const { itemType, pathname, meta, items } = input;
  const currentUrl = pageUrl(pathname);
  return buildPageGraph([
    {
      "@type": "CollectionPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.metaTitle,
      description: meta.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        "@id": `${currentUrl}#${itemType.toLowerCase()}-list`,
        itemListElement: items.map((item, index) => ({
          "@type": itemType,
          "@id": `${pageUrl(item.href)}#${itemType.toLowerCase()}`,
          headline: item.title,
          position: index + 1,
          description: item.description,
          datePublished: item.rawDate,
          url: pageUrl(item.href),
        })),
      },
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(pathname, currentUrl)),
  ]);
}
