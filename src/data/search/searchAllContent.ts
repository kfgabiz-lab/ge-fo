import { downloadCenterPage } from "@/data/support/downloadCenterContent";
import type { ProductDownloadItem } from "@/app/()/products-systems/data/productDetailContent";

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

export const searchAllPage = {
  defaultQuery: "DC Device",
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  popularSearchLabel: downloadCenterPage.popularSearchLabel,
  popularTags: downloadCenterPage.popularTags,
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
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metasol MS",
    description: "Metasol Contactor & Overload Relay",
  },
  {
    id: "sp-2",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/product_mccb.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Miniature circuit breaker",
    description: "The Global Standard",
  },
  {
    id: "sp-3",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metasol MMS",
    description: "Metasol Contactor & Overload Relay",
  },
  {
    id: "sp-4",
    href: "/products-systems/motor-control",
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
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
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
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
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
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
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
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
  },
];

export const searchAllMedia: SearchMediaItem[] = [
  {
    id: "sm-1",
    href: "/company/blog/detail",
    image: "/img/company/blog/list_01.jpg",
    category: "Blog",
    title: "The Significance of Arc Resistance in Material Selection DC Device",
    highlight: "DC Device",
    description:
      "Electrical faults and equipment failures can halt operations, cause costly downtime, and pose a threat to worker safety.\nIn fact, around 80% of electrical injuries involve thermal burns from arc flash events.",
  },
  {
    id: "sm-2",
    href: "/company/tech-hub/detail",
    image: "/img/company/press/detail_video_poster.png",
    category: "LS ELECTRIC Tech Hub",
    title: "[ACB] Response Manual for Electrical Closing Failure DC Device",
    highlight: "DC Device",
    variant: "video",
  },
  {
    id: "sm-3",
    href: "/company/press/detail",
    image: "/img/company/press/list_01.png",
    category: "Press",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’",
    highlight: "DC Device",
    description:
      "Stated at the DC Device annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items passed as proposed. Power market entering an “ultra supercycle” Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items...",
  },
  {
    id: "sm-4",
    href: "/company/events/detail",
    image: "/img/company/events/featured_01.png",
    category: "Event",
    title: "All Planned Exhibitions and Webinars DC Device",
    highlight: "DC Device",
    description:
      "Events : IEEE PES T&D  /  Venue : Chicago  /  Dates : Apr 17, 2025 ~ Apr 19, 2025",
  },
];

/** Figma 6430:106470 — Pages / list */
export const searchAllPages: SearchPageItem[] = [
  {
    id: "spg-1",
    href: "/markets/data-center",
    category: "Markets",
    title: "Power your data center with reliable electrical solutions",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "On the 18th, LS ELECTRIC announced that its switchgear manufacturing subsidiary, “MCM Engineering II,” located in Iron County, Utah, has been approved for a tax-reduction incentive by the Utah Inland Port Authority (UIPA), an economic agency under the Utah state government. The key point of this incentive is a reduction of up to 30% of the increase in property taxes generated by the...",
  },
  {
    id: "spg-2",
    href: "/company/events/detail",
    category: "Company",
    title: "Int’l Smart Grid Expo (SG Expo)",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "LS Energy Solutions : LS Energy Solutions delivers advanced DC Device Energy Storage Systems (ESS) and grid optimization technologies. By integrating power electronics, control systems, and project expertise, the company supports renewable integration and  grid stability across global markets.",
  },
  {
    id: "spg-3",
    href: "/support/connect-portal",
    category: "Service",
    title: "Explore our service coverage and support options",
    mark: "Events",
    highlight: "DC Device",
    description:
      "On the 18th, LS ELECTRIC announced that its switchgear manufacturing subsidiary, “MCM Engineering II,” located in Iron County, Utah, has been approved for a tax-reduction incentive by the Utah Inland Port Authority (UIPA), an economic agency under the Utah state government. The key point of this DC Device incentive is a reduction of up to 30% of the increase in property taxes...",
  },
  {
    id: "spg-4",
    href: "/support/where-to-buy",
    category: "Service",
    title: "Find authorized partners for local technical support",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "LS Energy Solutions : LS Energy Solutions delivers advanced Energy Storage Systems (ESS) and grid optimization technologies. By integrating power electronics, control systems, and project expertise, the company supports renewable integration and  grid stability across global markets.",
  },
];

export const searchSectionExploreLinks: Record<
  Exclude<SearchTabId, "all">,
  string
> = {
  products: "/products-systems/explore-all",
  documents: "/support/download-center",
  media: "/company/blog",
  pages: "/",
};
