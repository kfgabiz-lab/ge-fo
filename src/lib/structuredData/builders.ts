import { getBreadcrumbConfig } from "@/data/breadcrumbConfig";
import {
  SITE_URL,
  ORG_ID,
  WEBSITE_ID,
  SITE_NAME,
  ORG_LOGO_URL,
  ORG_SAME_AS,
  ORG_ADDRESS,
  ORG_KNOWS_ABOUT,
  SUB_ORGANIZATIONS,
  ORG_CREDENTIALS,
  LS_ELECTRIC_PARENT_ORG,
  GICS_SUPPORT_URL,
} from "./siteConfig";

export type JsonLdNode = Record<string, unknown>;

export function organizationBase(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: ORG_LOGO_URL,
  };
}

export function organizationFull(): JsonLdNode {
  return {
    ...organizationBase(),
    sameAs: ORG_SAME_AS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "send inquiry",
        url: `${SITE_URL}/support/contact-us`,
        areaServed: ["US", "CA", "MX"],
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        url: GICS_SUPPORT_URL,
        areaServed: "US",
        availableLanguage: ["English", "Korean"],
      },
    ],
    address: ORG_ADDRESS,
    knowsAbout: ORG_KNOWS_ABOUT,
    parentOrganization: LS_ELECTRIC_PARENT_ORG,
    subOrganization: SUB_ORGANIZATIONS,
    hasCredential: ORG_CREDENTIALS,
  };
}

export function website(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      query: "required name=search_term_string",
    },
  };
}

export function pageUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/**
 * href가 비어있는(슬러그 누락 등) 항목까지 pageUrl()에 넣으면 "/"(홈) URL이
 * 만들어져 버려서, 그런 항목은 JSON-LD에서 아예 제외하도록 null을 반환한다.
 */
export function itemUrl(href: string | null | undefined): string | null {
  const clean = (href ?? "").split("?")[0];
  return clean ? pageUrl(clean) : null;
}

export type BreadcrumbItem = { name: string; url: string };

export function breadcrumbList(
  currentPageUrl: string,
  crumbs: BreadcrumbItem[],
): JsonLdNode {
  const items: BreadcrumbItem[] = [{ name: "Home", url: SITE_URL }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${currentPageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

const GROUP_ANCHORS: Record<string, string> = {
  "Products & Systems": "products-and-systems",
  Company: "company",
  Support: "support",
  Services: "services",
  Markets: "markets",
};

function anchorFor(label: string): string {
  const slug =
    GROUP_ANCHORS[label] ??
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  return `${SITE_URL}#${slug}`;
}

/**
 * getBreadcrumbConfig()는 화면에 보이는 브레드크럼 내비게이션(HeaderBreadcrumb)에도
 * 쓰이는 공용 데이터라서, 화면 표시용으로만 존재하는 크럼(예: "Media")이나 화면에서만
 * 의미 있는 링크(예: "Company"→/company/blog)가 섞여 있다. JSON-LD는 schema.org 기준의
 * 사이트 구조를 나타내야 하므로, 화면용 설정은 건드리지 않고 이 두 규칙만 SEO 출력에
 * 적용해 보정한다.
 */
const SEO_BREADCRUMB_DROP_LABELS = new Set(["Media", "Training", "Resources"]);
const SEO_BREADCRUMB_ANCHOR_LABELS = new Set(["Company", "Markets"]);

export function crumbsFromBreadcrumbConfig(
  pathname: string,
  currentPageUrl: string,
): BreadcrumbItem[] {
  const { crumbs, current } = getBreadcrumbConfig(pathname);
  const items: BreadcrumbItem[] = crumbs
    .filter((c) => !SEO_BREADCRUMB_DROP_LABELS.has(c.label))
    .map((c) => ({
      name: c.label,
      url:
        !c.href || SEO_BREADCRUMB_ANCHOR_LABELS.has(c.label)
          ? anchorFor(c.label)
          : pageUrl(c.href),
    }));
  if (current) items.push({ name: current, url: currentPageUrl });
  return items;
}

export function buildPageGraph(
  nodes: JsonLdNode[],
  opts?: { orgFull?: boolean },
): { "@context": string; "@graph": JsonLdNode[] } {
  const organization = opts?.orgFull ? organizationFull() : organizationBase();
  return {
    "@context": "https://schema.org",
    "@graph": [organization, website(), ...nodes],
  };
}

export function buildSimpleWebPageGraph(
  pathname: string,
  meta: { metaTitle: string; metaDescription: string },
  opts?: { type?: string; orgFull?: boolean; extra?: Record<string, unknown> },
): { "@context": string; "@graph": JsonLdNode[] } {
  const currentUrl = pageUrl(pathname);
  const node: JsonLdNode = {
    "@type": opts?.type ?? "WebPage",
    "@id": `${currentUrl}#webpage`,
    url: currentUrl,
    name: meta.metaTitle,
    description: meta.metaDescription,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
    ...(opts?.extra ?? {}),
  };
  return buildPageGraph(
    [node, breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(pathname, currentUrl))],
    { orgFull: opts?.orgFull },
  );
}
