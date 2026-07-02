import type { ProductDownloadItem } from "@/app/()/products-systems/data/productDetailContent";
import { emptyStateIconSrc } from "@/data/commonAssets";

export const downloadCenterPage = {
  title: "Download Center",
  description:
    "You can download manuals and various files related to LS ELECTRIC products.",
  searchPlaceholder: "Find products, solutions, or resources for your business",
  popularSearchLabel: "Popular Keywords :",
  popularTags: ["MCCB", "AC Drives", "VCB", "PLC", "How to size a contactor for motor control?"],
  totalResults: 2658,
  pageSize: 10,
} as const;

export type DownloadFilterOption = {
  id: string;
  label: string;
  count?: number;
  defaultChecked?: boolean;
};

export type DownloadCategoryOption = DownloadFilterOption & {
  hasArrow?: boolean;
  defaultExpanded?: boolean;
  nested?: DownloadFilterOption[];
};

/** Figma 3670:31451 — active filter chips above results list */
export type DownloadActiveFilterChip = {
  id: string;
  group: "Category" | "Types";
  value: string;
};

/** Figma 3670:31496 — Download Center / No Data */
export const downloadCenterEmptyContent = {
  title: "We could not find any results",
  iconSrc: emptyStateIconSrc,
  tips: [
    "Ensure all search terms are spelled correctly.",
    "Narrow your results by using more specific keywords. (e.g. 'ACS 600 manual')",
    "Search is not case sensitive — 'acs 600' and 'ACS 600' return identical results.",
    "Wildcard searches are not supported. Please enter the full term instead. (e.g. 'transformer' instead of 'transf*')",
  ],
  contactTip: {
    before: "If you are unable to find the required information, please visit our ",
    linkLabel: "Contact Us",
    after: " page.",
  },
  contactHref: "",
} as const;

export const downloadCenterActiveFilterDefaults: DownloadActiveFilterChip[] = [
  { id: "filter-cat-hmi", group: "Category", value: "HMI" },
  {
    id: "filter-cat-lv-pd",
    group: "Category",
    value: "LV Power Distribution",
  },
  { id: "filter-type-catalog", group: "Types", value: "Catalog" },
  { id: "filter-type-manuals", group: "Types", value: "Manuals" },
];

export const downloadProductCategories: DownloadCategoryOption[] = [
  {
    id: "lv-motor",
    label: "LV Motor Control",
    count: 100,
    hasArrow: true,
    nested: [
      { id: "magnetic-contactor", label: "Magnetic Contactors", count: 42 },
      { id: "manual-motor-starter", label: "Manual Motor Starters", count: 18 },
      { id: "empr", label: "EMPR / Overload Relays", count: 28 },
      { id: "soft-starter", label: "Soft Starters", count: 12 },
    ],
  },
  {
    id: "lv-auto",
    label: "LV Automation",
    count: 100,
    hasArrow: true,
    nested: [
      { id: "plc", label: "PLC (XGT / XGB)", count: 46 },
      { id: "hmi", label: "HMI (XGT Panel)", count: 22 },
      { id: "ac-drives", label: "AC Drives", count: 24 },
      { id: "servo-motion", label: "Servo & Motion", count: 8 },
    ],
  },
  {
    id: "lv-pd",
    label: "LV Power Distribution",
    count: 100,
    hasArrow: true,
    defaultExpanded: true,
    nested: [
      { id: "mccb", label: "MCCB", count: 352 },
      { id: "mcb-rccb", label: "MCB / RCCB", count: 120 },
      { id: "acb", label: "ACB", count: 88 },
      { id: "metering", label: "Metering & Power Monitoring", count: 40 },
    ],
  },
  { id: "mv-pd", label: "MV Power Distribution", count: 352 },
  { id: "dc-device", label: "DC Device", count: 100 },
  { id: "hv-system", label: "HV System", count: 30 },
  { id: "software-cat", label: "Software", count: 0 },
];

export const downloadDocumentTypes: DownloadFilterOption[] = [
  { id: "catalogs", label: "Catalogs", count: 100, defaultChecked: true },
  { id: "manuals", label: "Manuals", count: 100, defaultChecked: true },
  { id: "drawings", label: "Drawings", count: 100 },
  { id: "certificates", label: "Certificates", count: 100 },
  { id: "software", label: "Software", count: 100 },
  { id: "tech", label: "Tech Data", count: 100 },
  { id: "firmware", label: "OS/Firmware", count: 0 },
];

/**
 * Figma 5841:132466 — Download Center / List (Accordion).
 * 버전 드롭다운은 `versions`가 있는 항목에만 노출된다.
 */
const downloadVersions = ["V38.0", "V37.0", "V36.0"];

export const downloadCenterItems: ProductDownloadItem[] = [
  {
    id: "dl-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: downloadVersions,
    files: [
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
    ],
  },
  {
    id: "dl-2",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
    ],
  },
  {
    id: "dl-3",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: downloadVersions,
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
  },
  {
    id: "dl-4",
    type: "Manual",
    title: "Cast Resin Transformer [Transformer]_Catalog_IEEE_EN_202110",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: downloadVersions,
    files: [
      { name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "" },
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
    ],
  },
  {
    id: "dl-5",
    type: "Catalog",
    title: "UL Susol VCB [Susol UL VCB]_User_Manual_UCGT-05/15/27/38kV",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [
      { name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "" },
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
    ],
  },
  {
    id: "dl-6",
    type: "Catalog",
    title: "LV SWGR [UL LV Panelboard] IOM Manual",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [{ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" }],
  },
];
