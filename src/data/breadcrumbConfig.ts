import { softwareProductHrefs } from "@/data/gnb/mega/devices";

export const TRAINING_VARIANT_LABELS: Record<string, string> = {
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
      },
    ],
    current: "Variable Frequency Drive",
  },
  "/product/metasol-ms": {
    crumbs: [
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
      },
      {
        label: "Variable Frequency Drive",
      },
    ],
    current: "H100 Plus",
  },
  "/product/h100-plus": {
    crumbs: [
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
      },
      {
        label: "Variable Frequency Drive",
      },
    ],
    current: "H100 Plus",
  },
  "/product/susol-ul-smart-mccb": {
    crumbs: [
      { label: "Products & Systems" },
      {
        label: "LV Products and Systems",
      },
      {
        label: "Molded Case Circuit Breaker",
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
      { label: "Software" },
    ],
    current: "SCADA",
  },
  [softwareProductHrefs.xems]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
    ],
    current: "xEMS",
  },
  [softwareProductHrefs.microGrid]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
    ],
    current: "Micro Grid",
  },
  [softwareProductHrefs.smartFactory]: {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
    ],
    current: "Smart Factory",
  },
  "/product/scada": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
      { label: "SCADA" },
    ],
    current: "SCADA",
  },
  "/product/xems": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
      { label: "xEMS" },
    ],
    current: "xEMS",
  },
  "/product/micro-grid": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
      { label: "Micro Grid" },
    ],
    current: "Micro Grid",
  },
  "/product/smart-factory": {
    crumbs: [
      { label: "Products & Systems" },
      { label: "Software" },
      { label: "Smart Factory" },
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
    crumbs: [
      { label: "Company" },
      { label: "Articles" },
      { label: "Blog", href: "/company/blog" },
    ],
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
      { label: "Company" },
      { label: "Articles" },
      { label: "Articles", href: "/company/articles" },
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
      { label: "Company" },
      { label: "Articles" },
      { label: "Press", href: "/company/press" },
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
      { label: "Company" },
      { label: "Articles" },
      { label: "Events", href: "/company/events" },
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
  if (/^\/services\/training\/session\/[^/]+\/[^/]+$/.test(pathname)) {
    return {
      crumbs: [
        { label: "Services" },
        { label: "Training" },
        { label: "Course" },
      ],
      current: "Session",
    };
  }

  if (/^\/services\/training\/course\/[^/]+\/[^/]+$/.test(pathname)) {
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

  if (/^\/company\/blog\/[^/]+\/[^/]+$/.test(pathname)) {
    return configs["/company/blog/detail"];
  }

  if (/^\/company\/press\/[^/]+\/[^/]+$/.test(pathname)) {
    return configs["/company/press/detail"];
  }

  if (/^\/company\/articles\/[^/]+\/[^/]+$/.test(pathname)) {
    return configs["/company/articles/detail"];
  }

  if (/^\/company\/events\/[^/]+\/[^/]+$/.test(pathname)) {
    return configs["/company/events/detail"];
  }

  if (/^\/support\/tech-hub\/view\/[^/]+$/.test(pathname)) {
    return configs["/support/tech-hub/view"];
  }

  const productMatch = pathname.match(/^\/product\/[^/]+\/([^/]+)$/);
  if (productMatch) {
    return configs[`/product/${productMatch[1]}`] ?? { crumbs: [], current: "" };
  }

  const categoryMatch = pathname.match(
    /^\/(product-category|product-range)\/[^/]+\/([^/]+)$/,
  );
  if (categoryMatch) {
    return (
      configs[`/${categoryMatch[1]}/${categoryMatch[2]}`] ?? {
        crumbs: [],
        current: "",
      }
    );
  }

  if (/^\/(product-category|product-range)\/[^/]+$/.test(pathname)) {
    return { crumbs: [], current: "" };
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
