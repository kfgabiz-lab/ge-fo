import {
  SOFTWARE_HREF,
  softwareProductHrefs,
} from "@/data/gnb/mega/devices";

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
  "/product-category/lv-products-and-systems": {
    crumbs: [
      { label: "Products & Systems" },
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
    current: "Search",
  },
  "/product-range/variable-frequency-drive": {
    crumbs: [
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
        href: "/product-category/lv-products-and-systems",
      },
    ],
    current: "Variable Frequency Drive",
  },
  "/product/metasol-ms": {
    crumbs: [
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
        href: "/product-category/lv-products-and-systems",
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
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
        href: "/product-category/lv-products-and-systems",
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
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
        href: "/product-category/lv-products-and-systems",
      },
      {
        label: "Molded Case Circuit Breaker",
        href: "/product-range/molded-case-circuit-breaker",
      },
    ],
    current: "Susol UL Smart MCCB",
  },
  "/product-category/software": {
    crumbs: [
      { label: "Products & Systems" },
    ],
    current: "Software",
  },
  [softwareProductHrefs.scada]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "SCADA",
  },
  [softwareProductHrefs.xems]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "xEMS",
  },
  [softwareProductHrefs.microGrid]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "Micro Grid",
  },
  [softwareProductHrefs.smartFactory]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "Smart Factory",
  },
  "/product/scada": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
      { label: "SCADA", href: softwareProductHrefs.scada },
    ],
    current: "SCADA",
  },
  "/product/xems": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
      { label: "xEMS", href: softwareProductHrefs.xems },
    ],
    current: "xEMS",
  },
  "/product/micro-grid": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
      { label: "Micro Grid", href: softwareProductHrefs.microGrid },
    ],
    current: "Micro Grid",
  },
  "/product/smart-factory": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software", href: SOFTWARE_HREF },
      { label: "Smart Factory", href: softwareProductHrefs.smartFactory },
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
    crumbs: [{ label: "Support" }, { label: "Resources" }],
    current: "Tech Hub",
  },
  "/support/tech-hub/view": {
    crumbs: [
      { label: "Support" },
      { label: "Resources" },
      { label: "Tech Hub", href: "/support/tech-hub" },
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
  "/services/training/request": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Training Request",
  },
  "/services/training/request/step-2": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Training Request",
  },
  "/services/training/request/step-3": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Training Request",
  },
  "/services/training/request/step-4": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Training Request",
  },
  "/services/training/request/step-4-type_01": {
    crumbs: [
      { label: "Services" },
      { label: "Training" },
    ],
    current: "Training Request",
  },
  // 약관관리 breadcrumb config 추가
   "/privacy-policy": {
    crumbs: [],
    current: "Privacy Policy",
  },
  "/terms-of-service": {
    crumbs: [],
    current: "Terms of Service",
  },
  "/general-terms-of-purchase": {
    crumbs: [],
    current: "General Terms of Purchase",
  },
};

export function getBreadcrumbConfig(pathname: string): BreadcrumbConfig {
  const trainingReserved = "sales|engineering|service|request";

  const sessionMatch = pathname.match(
    new RegExp(
      `^/services/training/(?!(?:${trainingReserved})(?:/|$))([^/]+)/([^/]+)$`,
    ),
  );
  if (sessionMatch) {
    const [, courseId] = sessionMatch;
    return {
      crumbs: [
        { label: "Services" },
        { label: "Training" },
        {
          label: "Curriculum Detail",
          href: `/services/training/${courseId}`,
        },
      ],
      current: "Session",
    };
  }

  const detailMatch = pathname.match(
    new RegExp(`^/services/training/(?!(?:${trainingReserved})$)([^/]+)$`),
  );
  if (detailMatch) {
    return {
      crumbs: [{ label: "Services" }, { label: "Training" }],
      current: "Curriculum Detail",
    };
  }

  const listMatch = pathname.match(
    /^\/services\/training\/(sales|engineering|service)$/,
  );
  if (listMatch) {
    const [, variant] = listMatch;
    return {
      crumbs: [{ label: "Services" }, { label: "Training" }],
      current: TRAINING_VARIANT_LABELS[variant],
    };
  }

  if (/^\/company\/blog\/(?!detail$|no-data$)[^/]+$/.test(pathname)) {
    return configs["/company/blog/detail"];
  }

  if (/^\/company\/press\/(?!detail$|no-data$)[^/]+$/.test(pathname)) {
    return configs["/company/press/detail"];
  }

  if (/^\/company\/articles\/(?!detail$|no-data$)[^/]+$/.test(pathname)) {
    return configs["/company/articles/detail"];
  }

  if (/^\/company\/events\/(?!detail$)[^/]+$/.test(pathname)) {
    return configs["/company/events/detail"];
  }

  if (/^\/support\/tech-hub\/view\/[^/]+$/.test(pathname)) {
    return configs["/support/tech-hub/view"];
  }

  return (
    configs[pathname] ?? {
      crumbs: [],
      current: "",
    }
  );
}

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
