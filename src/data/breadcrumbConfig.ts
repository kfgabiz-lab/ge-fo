import {
  SOFTWARE_HREF,
  softwareProductHrefs,
} from "@/data/gnb/mega/devices";
import { getEngineeringTrainingDetail } from "./services/engineeringTrainingDetailContent";
import { getEngineeringTrainingSessionDetail } from "./services/engineeringTrainingSessionDetailContent";

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
  "/products-systems/motor-control": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
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
  "/products-systems/lv-automation": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      {
        label: "LV Products and Systems",
        href: "/products-systems/motor-control",
      },
    ],
    current: "Variable Frequency Drive",
  },
  "/products-systems/variable-frequency-drive": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      {
        label: "LV Products and Systems",
        href: "/products-systems/motor-control",
      },
    ],
    current: "Variable Frequency Drive",
  },
  "/products-systems/motor-control/metasol-ms": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      {
        label: "LV Products and Systems",
        href: "/products-systems/motor-control",
      },
      {
        label: "Variable Frequency Drive",
        href: "/products-systems/lv-automation",
      },
    ],
    current: "H100 Plus",
  },
  "/products-systems/motor-control/h100_plus": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      {
        label: "LV Products and Systems",
        href: "/products-systems/motor-control",
      },
      {
        label: "Variable Frequency Drive",
        href: "/products-systems/lv-automation",
      },
    ],
    current: "H100 Plus",
  },
  "/products-systems/motor-control/susol-ul-smart-mccb": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      {
        label: "LV Products and Systems",
        href: "/products-systems/motor-control",
      },
      {
        label: "Molded Case Circuit Breaker",
        href: "/products-systems/motor-control",
      },
    ],
    current: "Susol UL Smart MCCB",
  },
  "/products-systems/software": {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
    ],
    current: "Software",
  },
  [softwareProductHrefs.scada]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "SCADA",
  },
  [softwareProductHrefs.xems]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "xEMS",
  },
  [softwareProductHrefs.microGrid]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
      { label: "Software", href: SOFTWARE_HREF },
    ],
    current: "Micro Grid",
  },
  [softwareProductHrefs.smartFactory]: {
    crumbs: [
      { label: "Products & Systems", href: "/products-systems/motor-control" },
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
    current: "Service center",
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
  const sessionMatch = pathname.match(
    /^\/services\/engineering-training\/([^/]+)\/([^/]+)$/,
  );
  if (sessionMatch) {
    const [, courseId, sessionId] = sessionMatch;
    const session = getEngineeringTrainingSessionDetail(courseId, sessionId);
    const detail = getEngineeringTrainingDetail(courseId);

    if (session && detail) {
      return {
        crumbs: [
          { label: "Services" },
          { label: "Training" },
          { label: "Engineering Training", href: "/services/engineering-training" },
          {
            label: detail.breadcrumbCurrent,
            href: `/services/engineering-training/${courseId}`,
          },
        ],
        current: session.breadcrumbCurrent,
      };
    }
  }

  const detailMatch = pathname.match(/^\/services\/engineering-training\/([^/]+)$/);
  if (detailMatch) {
    const detail = getEngineeringTrainingDetail(detailMatch[1]);

    if (detail) {
      return {
        crumbs: [
          { label: "Services" },
          { label: "Training" },
          { label: "Engineering Training", href: "/services/engineering-training" },
        ],
        current: detail.breadcrumbCurrent,
      };
    }
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
