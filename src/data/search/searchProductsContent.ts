import type { SearchProductItem } from "@/data/search/searchAllContent";
import { searchAllProducts } from "@/data/search/searchAllContent";
import type {
  DownloadActiveFilterChip,
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";

/** Figma 4701:84687 — Search Products tab + filter */
export const searchProductsPage = {
  totalResults: 2658,
  pageSize: 10,
} as const;

export const searchProductActiveFilterDefaults: DownloadActiveFilterChip[] = [
  { id: "sp-filter-cat-mccb", group: "Category", value: "Susol UL MCCB" },
  { id: "sp-filter-type-catalog", group: "Types", value: "Catalog" },
  { id: "sp-filter-type-manuals", group: "Types", value: "Manuals" },
];

export const searchProductCategories: DownloadCategoryOption[] = [
  {
    id: "lv-products",
    label: "LV Products and Systems",
    count: 100,
    hasArrow: true,
    defaultExpanded: true,
    nested: [
      {
        id: "acb",
        label: "Air Circuit Breaker / Power Circuit Breaker",
        count: 60,
      },
      {
        id: "mccb",
        label: "Molded Case Circuit Breaker",
        count: 60,
      },
      {
        id: "mccb-susol-ul",
        label: "Susol UL MCCB",
        count: 30,
      },
      {
        id: "mccb-susol-smart",
        label: "Susol UL Smart MCCB",
        count: 10,
      },
      {
        id: "mccb-susol-1kv",
        label: "Susol UL MCCB(up to 1000V)",
        count: 20,
      },
      { id: "mcb", label: "Miniature Circuit Breaker", count: 100 },
      { id: "spd", label: "Surge Protective Device", count: 60 },
      { id: "ul67", label: "UL67 Panelboard", count: 100 },
      { id: "rpp", label: "Remote Power Panel", count: 100 },
      { id: "ul891", label: "UL891 Switchboard", count: 100 },
      { id: "ul1558", label: "UL1558 Switchgear", count: 100 },
      { id: "ehouse", label: "E House", count: 100 },
      { id: "contactor", label: "Magnetic Contactor", count: 60 },
      { id: "vfd", label: "Variable Fequency Drive", count: 100 },
    ],
  },
  {
    id: "mv-products",
    label: "MV Products and Systems",
    count: 100,
    hasArrow: true,
  },
  {
    id: "hv-systems",
    label: "HV Systems",
    count: 100,
    hasArrow: true,
  },
  {
    id: "dc-devices",
    label: "DC Products",
    count: 100,
    hasArrow: true,
  },
  {
    id: "iac",
    label: "Industrial Automation and Control",
    count: 100,
    hasArrow: true,
  },
  {
    id: "software",
    label: "Software",
    count: 100,
    hasArrow: true,
  },
];

export const searchProductDocumentTypes: DownloadFilterOption[] = [
  { id: "catalogs", label: "Catalogs", count: 100 },
  { id: "manuals", label: "Manuals", count: 100 },
  { id: "drawings", label: "Drawings", count: 100 },
  { id: "certificates", label: "Certificates", count: 100 },
  { id: "software", label: "Software", count: 100 },
  { id: "tech", label: "Tech Data", count: 100 },
  { id: "firmware", label: "OS/Firmware", count: 0 },
];

const productPool: SearchProductItem[] = [
  ...searchAllProducts,
  {
    id: "sp-5",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/product_mccb.png",
    category: "DC Device",
    highlight: "Molded Case Circuit Breaker",
    title: "Susol UL Smart MCCB",
    description: "The Global Standard",
  },
  {
    id: "sp-6",
    href: "/products-systems/lv-automation",
    image: "/img/devices-systems/products/product_magnetic_contactor.png",
    category: "DC Device",
    highlight: "Variable Fequency Drive",
    title: "G100",
    description: "Compact AC Drive for general purpose",
  },
];

export function getSearchProductPageItems(page: number, pageSize: number): SearchProductItem[] {
  const start = (page - 1) * pageSize;
  const items: SearchProductItem[] = [];

  for (let i = 0; i < pageSize; i++) {
    const globalIndex = start + i;
    const source = productPool[globalIndex % productPool.length];
    items.push({
      ...source,
      id: `${source.id}-${globalIndex}`,
    });
  }

  return items;
}
