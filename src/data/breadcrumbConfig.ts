import {
  SOFTWARE_HREF,
  softwareProductHrefs,
} from "@/data/gnb/mega/devices";

/**
 * Training 상세/세션 경로의 variant(코스 계열)별 목록 라벨 매핑.
 * sales/engineering/service 3종. 실 courseId(숫자) 또는 세션 id(UUID)는
 * 동적이므로 blog/press 상세처럼 제네릭 고정 라벨을 사용한다(실 제목 fetch 금지).
 */
const TRAINING_VARIANT_LABELS: Record<string, string> = {
  sales: "Sales Training",
  engineering: "Engineering Training",
  service: "Service Training",
};

export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

export type BreadcrumbConfig = {
  crumbs: BreadcrumbCrumb[];
  current: string;
  /** 경로 텍스트 없이 홈 아이콘만 — Figma Explore All (4701:82591) */
  homeOnly?: boolean;
};

const configs: Record<string, BreadcrumbConfig> = {
  "/markets/commercial-residential": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Commercial & Residential",
  },
  "/markets/data-center": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Data Center",
  },
  "/markets/public-infrastructure": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Public Infrastructure",
  },
  "/markets/oil-gas-mining": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Oil & Gas, Mining Industries",
  },
  "/markets/power-grid": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Power Grid",
  },
  "/markets/industrial": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Industrial",
  },
  "/products-category/lv-products-and-systems": {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
    ],
    current: "LV Products and Systems",
  },
  "/products-systems/explore-all": {
    crumbs: [],
    current: "",
    homeOnly: true,
  },
  "/search": {
    crumbs: [],
    current: "",
    homeOnly: true,
  },
  // 카테고리 L01-15(LV)·L05-04(Automation) 둘 다 seo.slug가 "variable-frequency-drive"로
  // 중복 등록돼 있어(첫 건 렌더링 정책) 신규 URL 키 하나로 통합.
  "/product-range/variable-frequency-drive": {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      {
        label: "LV Products and Systems",
        href: "/products-category/lv-products-and-systems",
      },
    ],
    current: "Variable Frequency Drive",
  },
  "/product/metasol-ms": {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      {
        label: "LV Products and Systems",
        href: "/products-category/lv-products-and-systems",
      },
      {
        label: "Variable Frequency Drive",
        href: "/product-range/variable-frequency-drive",
      },
    ],
    current: "H100 Plus",
  },
  "/product/h100-plus": {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      {
        label: "LV Products and Systems",
        href: "/products-category/lv-products-and-systems",
      },
      {
        label: "Variable Frequency Drive",
        href: "/product-range/variable-frequency-drive",
      },
    ],
    current: "H100 Plus",
  },
  "/product/susol-ul-smart-mccb": {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      {
        label: "LV Products and Systems",
        href: "/products-category/lv-products-and-systems",
      },
      {
        label: "Molded Case Circuit Breaker",
        href: "/products-category/lv-products-and-systems",
      },
    ],
    current: "Susol UL Smart MCCB",
  },
  "/products-category/software": {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
    ],
    current: "Software",
  },
  [softwareProductHrefs.scada]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "SCADA",
  },
  [softwareProductHrefs.xems]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "xEMS",
  },
  [softwareProductHrefs.microGrid]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "Micro Grid",
  },
  [softwareProductHrefs.smartFactory]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-category/lv-products-and-systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "Smart Factory",
  },
  "/company/ls-electric-america": {
    crumbs: [{ label: "Company" }],
    current: "LS ELECTRIC America",
  },
  "/company/ls-electric": {
    crumbs: [{ label: "Company" }],
    current: "LS ELECTRIC",
  },
  "/company/affiliate-in-america": {
    crumbs: [{ label: "Company" }],
    current: "Affiliate in America",
  },
  "/company/esg": {
    crumbs: [{ label: "Company" }],
    current: "ESG",
  },
  "/company/careers": {
    crumbs: [{ label: "Company" }],
    current: "Careers at LS ELECTRIC America",
  },
  "/company/blog": {
    crumbs: [{ label: "Company", href: "/company/blog" }],
    current: "Blog",
  },
  "/company/blog/detail": {
    crumbs: [{ label: "Company", href: "/company/blog" }],
    current: "Blog",
  },
  "/company/blog/no-data": {
    crumbs: [{ label: "Company", href: "/company/blog" }],
    current: "Blog",
  },
  "/company/articles": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Articles",
  },
  "/company/articles/detail": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Articles",
  },
  "/company/articles/no-data": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Articles",
  },
  "/company/press": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Press",
  },
  "/company/press/detail": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Press",
  },
  "/company/press/no-data": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Press",
  },
  "/company/events": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Events",
  },
  "/company/events/detail": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Events",
  },
  "/support/connect-portal": {
    crumbs: [{ label: "Support" }],
    current: "Connect Portal",
  },
  "/support/download-center": {
    crumbs: [{ label: "Support" }],
    current: "Download Center",
  },
  "/support/download-center/no-data": {
    crumbs: [{ label: "Support" }],
    current: "Download Center",
  },
  "/support/tech-hub": {
    crumbs: [{ label: "Support" }],
    current: "LS ELECTRIC Tech Hub",
  },
  "/support/tech-hub/view": {
    crumbs: [
      { label: "Support" },
      { label: "LS ELECTRIC Tech Hub", href: "/support/tech-hub" },
    ],
    current: "Video",
  },
  "/support/tech-hub/no-data": {
    crumbs: [{ label: "Support" }],
    current: "LS ELECTRIC Tech Hub",
  },
  "/support/where-to-buy": {
    crumbs: [{ label: "Support" }],
    current: "Where to Buy",
  },
  "/support/where-to-buy/no-data": {
    crumbs: [{ label: "Support" }],
    current: "Where to Buy",
  },
  "/support/contact-us": {
    crumbs: [{ label: "Support" }],
    current: "Contact Us",
  },
  "/support/contact-us/terms-modal": {
    crumbs: [
      { label: "Support" },
      { label: "Contact Us", href: "/support/contact-us" },
    ],
    current: "Modals",
  },
  "/services/service-center": {
    crumbs: [{ label: "Services" }],
    current: "Service Center",
  },
  "/services/warranty-policy": {
    crumbs: [{ label: "Services" }],
    current: "Warranty Policy",
  },
  "/services/engineering-training": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Engineering Training",
  },
  "/services/request-for-training": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Request for Training",
  },
  "/services/request-for-training/step-2": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Request for Training",
  },
  "/services/request-for-training/step-3": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Request for Training",
  },
  "/services/request-for-training/step-4": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Request for Training",
  },
  "/services/request-for-training/step-4-type_01": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Request for Training",
  },
};

export function getBreadcrumbConfig(pathname: string): BreadcrumbConfig {
  // Training 세션 상세(2뎁스): /services/{variant}-training/{courseId}/{sessionId}
  // — 코스(1뎁스)보다 먼저 검사(세그먼트 수가 더 많으므로 우선 매칭).
  // courseId(숫자)·sessionId(UUID)는 동적이라 blog/press 상세처럼 제네릭 고정 라벨 사용.
  const sessionMatch = pathname.match(
    /^\/services\/(sales|engineering|service)-training\/([^/]+)\/([^/]+)$/,
  );
  if (sessionMatch) {
    const [, variant, courseId] = sessionMatch;
    const listHref = `/services/${variant}-training`;
    return {
      crumbs: [
        { label: "Services" },
        { label: "Training" },
        { label: TRAINING_VARIANT_LABELS[variant], href: listHref },
        {
          label: "Curriculum Detail",
          href: `${listHref}/${courseId}`,
        },
      ],
      current: "Session",
    };
  }

  // Training 코스 상세(1뎁스): /services/{variant}-training/{courseId}
  const detailMatch = pathname.match(
    /^\/services\/(sales|engineering|service)-training\/([^/]+)$/,
  );
  if (detailMatch) {
    const [, variant] = detailMatch;
    return {
      crumbs: [
        { label: "Services" },
        { label: "Training" },
        {
          label: TRAINING_VARIANT_LABELS[variant],
          href: `/services/${variant}-training`,
        },
      ],
      current: "Curriculum Detail",
    };
  }

  // 블로그 상세는 id 기반 동적 라우트(/company/blog/detail/{id}) — 고정 경로와 동일한 breadcrumb 사용
  if (/^\/company\/blog\/detail\/[^/]+$/.test(pathname)) {
    return configs["/company/blog/detail"];
  }

  // 프레스 상세도 id 기반 동적 라우트(/company/press/detail/{id}) — 고정 경로와 동일한 breadcrumb 사용
  if (/^\/company\/press\/detail\/[^/]+$/.test(pathname)) {
    return configs["/company/press/detail"];
  }

  // 아티클 상세도 id 기반 동적 라우트(/company/articles/detail/{id}) — 고정 경로와 동일한 breadcrumb 사용
  if (/^\/company\/articles\/detail\/[^/]+$/.test(pathname)) {
    return configs["/company/articles/detail"];
  }

  // 이벤트 상세도 id 기반 동적 라우트(/company/events/detail/{id}) — 고정 경로와 동일한 breadcrumb 사용
  if (/^\/company\/events\/detail\/[^/]+$/.test(pathname)) {
    return configs["/company/events/detail"];
  }

  return (
    configs[pathname] ?? {
      crumbs: [],
      current: "",
    }
  );
}

/** breadcrumb 경로 라벨 (crumbs + current). homeOnly·미등록 경로는 빈 배열 */
export function getBreadcrumbTrail(pathname: string): string[] {
  const config = getBreadcrumbConfig(pathname);
  if (config.homeOnly) {
    return [];
  }
  const trail = config.crumbs.map((crumb) => crumb.label);
  if (config.current) {
    trail.push(config.current);
  }
  return trail;
}
