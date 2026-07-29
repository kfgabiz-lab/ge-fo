import { downloadCenterPage } from "@/data/support/downloadCenterContent";
import {
  productDownloadFile,
  type ProductDownloadItem,
} from "@/app/()/products-systems/data/productDetailContent";

export const SEARCH_ALL_PATH = "/search";

export function buildSearchAllHref(query?: string): string {
  if (query === undefined) {
    return SEARCH_ALL_PATH;
  }
  const trimmed = query.trim();
  return trimmed
    ? `${SEARCH_ALL_PATH}?q=${encodeURIComponent(trimmed)}`
    : `${SEARCH_ALL_PATH}?q=`;
}

/**
 * 통합검색 화면 내 탭 이동 href.
 * 현재 검색어(q)를 유지한 채 ?tab= 만 덧붙인다(예: /search?q=relay&tab=media).
 * SearchAllTabContent 가 ?tab= 값을 읽어 상단 탭을 해당 탭으로 맞춘다.
 */
export function buildSearchTabHref(
  query: string,
  tab: Exclude<SearchTabId, "all">,
): string {
  return `${buildSearchAllHref(query)}&tab=${tab}`;
}

export const searchAllPage = {
  defaultQuery: "DC Device",
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  searchPlaceholderMobile: downloadCenterPage.searchPlaceholderMobile,
  popularSearchLabel: downloadCenterPage.popularSearchLabel,
  popularSearchLabelMobile: downloadCenterPage.popularSearchLabelMobile,
  popularTags: downloadCenterPage.popularTags,
  popularTagsMobile: downloadCenterPage.popularTagsMobile,
  aiDisclaimer: "AI-generated content may be incomplete. Verify important info.",
  aiTitle: "AI-generated summary of your search results",
} as const;

export type SearchTabId = "all" | "products" | "documents" | "media" | "pages";

export type SearchTab = {
  id: SearchTabId;
  label: string;
  count: number;
};

export const searchAllTabs: SearchTab[] = [
  { id: "all", label: "All", count: 99 },
  { id: "products", label: "Products", count: 60 },
  { id: "documents", label: "Documents", count: 20 },
  { id: "media", label: "Media", count: 10 },
  { id: "pages", label: "Pages", count: 16 },
];

export type SearchProductItem = {
  id: string;
  href: string;
  image: string;
  category: string;
  highlight: string;
  title: string;
  description: string;
};

export type SearchMediaItem = {
  id: string;
  href: string;
  image: string;
  category: string;
  title: string;
  description?: string;
  highlight?: string;
  /** Optional search metadata — rendering follows where `highlight` appears in title/description text. */
  highlightPlacement?: "title" | "description";
  variant?: "default" | "video";
};

export type SearchPageItem = {
  id: string;
  href: string;
  category: string;
  title: string;
  /** Title suffix after `I` — rendered with `search_page__mark`. */
  mark?: string;
  /** Search term — bold in description (and inline in title when present in `title`). */
  highlight?: string;
  description: string;
};

export const searchAllAiSummary = [
  "General-purpose control for automation: A PLC is a general-purpose controller that operates machinery in a defined order and conditions by program, and is used for factory and process automation ranging from large-scale plant automation systems to general equipment.",
  "Flexible I/O programming and response control: Input and Output terminals can be programmed, and the response time for signal input and output can be adjusted.",
  "Remote monitoring and control options: With simple sequence configuration, operation is possible from local operator panels (LOP) and MCC panels, and remote monitoring/control via communications is possible for automatic operation using PLC or DCS.",
  "Reduced downtime through engineering convenience:",
  "Point import functions for IEC 61850, PLC, and Smart LV devices",
  "Flexible I/O programming and response control: Input and Output terminals can be programmed, and the response time for signal input and output can be adjusted.",
  "Remote monitoring and control options: With simple sequence configuration",
  "Remote monitoring and control options: With simple sequence configuration, operation is possible from local operator panels (LOP) and MCC panels, and remote monitoring/control via",
  "communications is possible for automatic operation using PLC or DCS.",
  "Point import functions for IEC 61850, PLC, and Smart LV devices help streamline commissioning and reduce wiring errors during installation.",
  "DC protection devices overview: DC miniature circuit breakers (MCBs) and molded case circuit breakers (MCCBs) protect circuits against overload and short-circuit conditions in DC applications such as solar, battery storage, and EV charging infrastructure.",
  "Metasol MS series: Metasol contactors and overload relays provide reliable motor control with compact dimensions, suitable for panel builders and OEMs integrating motor starters into control cabinets.",
  "Susol UL Smart MCCB: Smart molded case circuit breakers with communication capabilities enable remote status monitoring, trip history review, and integration with building or plant management systems.",
  "Selection criteria for DC breakers: Consider rated voltage, breaking capacity, trip curve characteristics, and compliance with applicable standards (IEC, UL) when matching a breaker to your application.",
  "Documentation and downloads: Product catalogs, technical datasheets, CAD drawings, and software tools are available from the product detail pages and the Download Center for engineering and procurement teams.",
  "Related product families: Explore motor control, power distribution, automation controllers, and smart low-voltage devices under Devices & Systems to find complementary solutions for your project.",
  "Support resources: Application notes, installation guides, and FAQ content on LS Electric global sites can help verify specifications before finalizing your bill of materials.",
  "Search tip: Use product names (e.g. Metasol MS, Susol MCCB), categories (DC Device, MCCB), or document types (catalog, datasheet) to narrow results across Products, Documents, Media, and Pages tabs.",
];

export const searchAllProducts: SearchProductItem[] = [
  {
    id: "sp-1",
    href: "/product/metasol-ms",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metasol MS",
    description: "Metasol Contactor & Overload Relay",
  },
  {
    id: "sp-2",
    href: "/product/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/product_mccb.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Miniature circuit breaker",
    description: "The Global Standard",
  },
  {
    id: "sp-3",
    href: "/product/metasol-ms",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metasol MMS",
    description: "Metasol Contactor & Overload Relay",
  },
  {
    id: "sp-4",
    href: "/products-category/lv-products-and-systems",
    image: "/img/devices-systems/products/product_magnetic_contactor.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metal Enclosed Load Interrupter\nSwitchgear",
    description: "Susol UL Molded Case Circuit Breaker",
  },
];

export const searchAllDocuments: ProductDownloadItem[] = [
  {
    id: "sd-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "sd-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" })],
  },
  {
    id: "sd-3",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "sd-4",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" })],
  },
];

// searchAllMedia(퍼블리싱 목업 4건)는 All 탭 Media 섹션이 media-search API 실연동으로 전환되면서 제거됨.
// Media 카드 데이터는 @/data/search/searchMediaData 의 fetchSearchMedia 가 생성한다(SearchMediaItem 타입은 계속 사용).

// searchAllPages(퍼블리싱 목업 4건)는 All 탭 Pages 섹션이 page-search API 실연동으로 전환되면서 제거됨.
// Pages 항목 데이터는 @/data/search/searchPagesData 의 fetchSearchPages 가 생성한다(SearchPageItem 타입은 계속 사용).

// All 탭 섹션별 Explore 이동 대상(다른 화면으로 나가는 고정 링크).
// Media 섹션은 다른 화면이 아니라 상단 Media 탭으로 전환되므로(기획 주석 #11)
// 여기 두지 않고 buildSearchTabHref(query, "media") 로 검색어를 유지한 href 를 만든다.
export const searchSectionExploreLinks: Record<
  "products" | "documents" | "pages",
  string
> = {
  products: "/products-systems/explore-all",
  documents: "/support/download-center",
  pages: "/",
};

/** ?tab= 파라미터 값 검증 — searchAllTabs 에 정의된 탭이면 해당 id, 아니면 undefined. */
export function toSearchTabId(value: string | null): SearchTabId | undefined {
  return searchAllTabs.find((tab) => tab.id === value)?.id;
}
