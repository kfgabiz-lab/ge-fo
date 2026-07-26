import {
  productDownloadFile,
  type ProductDownloadFile,
  type ProductDownloadItem,
} from "@/app/()/products-systems/data/productDetailContent";
import { emptyStateIconSrc } from "@/data/commonAssets";

/** Download Center 아이템 — files에 Copy Link용 url을 포함(공용 헬퍼 productDownloadFile 재사용) */
type DownloadCenterItem = Omit<ProductDownloadItem, "files"> & {
  files: ProductDownloadFile[];
};

export const downloadCenterPage = {
  title: "Download Center",
  description:
    "You can download manuals and various files related to LS ELECTRIC products.",
  searchPlaceholder: "Find products, solutions, or resources for your business",
  searchPlaceholderMobile: "Find products, solutions, or...",
  popularSearchLabel: "Popular Keywords :",
  popularSearchLabelMobile: "Popular Search :",
  filterByLabel: "Filter by",
  sortByLabel: "Sort by",
  applyLabel: "Apply",
  mobileSortDefault: "Document Type",
  mobileSortOptions: [
    "Document Type",
    "Most Recent",
    "A to Z",
    "Z to A",
  ] as const,
  popularTags: ["MCCB", "AC Drives", "VCB", "PLC", "How to size a contactor for motor control?"],
  popularTagsMobile: {
    row1: ["MCCB", "AC Drives", "VCB", "PLC"],
    row2: ["How to size a contactor for motor control?"],
  },
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

/** Figma 6561:73639 — Download Center / No Data search field */
export const downloadCenterNoDataSearchQuery = "XYZ" as const;

/** Figma 5565:128770 — Download Center / No Data empty state */
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
  contactHref: "/support/contact-us",
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
    id: "lv-products",
    label: "LV Products and Systems",
    count: 124,
    hasArrow: true,
    defaultExpanded: true,
    nested: [
      {
        id: "acb-pcb",
        label: "Air Circuit Breaker / Power Circuit Breaker",
        count: 60,
        defaultChecked: true,
      },
      {
        id: "mccb",
        label: "Molded Case Circuit Breaker",
        count: 60,
        defaultChecked: true,
      },
    ],
  },
  {
    id: "mv-products",
    label: "MV Products and Systems",
    count: 200,
    hasArrow: true,
  },
  { id: "hv-systems", label: "HV Systems", count: 98, hasArrow: true },
  { id: "dc-products", label: "DC Products", count: 352, hasArrow: true },
  {
    id: "industrial-auto",
    label: "Industrial Automation and Control",
    count: 100,
    hasArrow: true,
  },
  { id: "software-cat", label: "Software", count: 30, hasArrow: true },
];

// Document Type 필터 — option.id = BE docType 코드(C/M/D/S/R/O)로 매핑해
// 체크된 코드가 그대로 contents API 의 docTypes 파라미터로 나가게 한다.
// (BE DOC_TYPE_LABELS: C=Catalog, M=Manuals, D=Drawings, S=Software, R=Certificates, O=Tech Data)
// - OS/Firmware 는 BE 에 대응 코드가 없어(원천 데이터 없음) 필터로 나가지 않는다(inert). 라벨/노출은 퍼블리싱 유지, count 0 정적.
// - Download Center 필터 패널의 옆 건수 배지는 doctype-counts API 실카운트로 교체된다(DownloadCenterFilterProvider).
//   여기 count 값은 그 외 화면(products-systems 다운로드 필터)에서 쓰이는 정적 폴백이다.
// - defaultChecked 는 두지 않는다 — 초기 진입 시 문서유형 미필터(전체 노출)가 되도록.
export const downloadDocumentTypes: DownloadFilterOption[] = [
  { id: "C", label: "Catalogs", count: 100 },
  { id: "M", label: "Manuals", count: 100 },
  { id: "D", label: "Drawings", count: 100 },
  { id: "R", label: "Certificates", count: 100 },
  { id: "S", label: "Software", count: 100 },
  { id: "O", label: "Tech Data", count: 100 },
  { id: "firmware", label: "OS/Firmware", count: 0 },
];

// contents API docTypes 로 전달 가능한 실제 코드(위 목록 중 BE 대응 코드만). OS/Firmware(firmware)는 제외.
export const downloadDocTypeCodes = ["C", "M", "D", "S", "R", "O"] as const;

/**
 * Figma 5841:132466 — Download Center / List (Accordion).
 * 버전 드롭다운은 `versions`가 있는 항목에만 노출된다.
 */
const downloadVersions = ["V38.0", "V37.0", "V36.0"];

export const downloadCenterItems: DownloadCenterItem[] = [
  {
    id: "dl-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: downloadVersions,
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "dl-2",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "dl-3",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: downloadVersions,
    files: [productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" })],
  },
  {
    id: "dl-4",
    type: "Manual",
    title: "Cast Resin Transformer [Transformer]_Catalog_IEEE_EN_202110",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: downloadVersions,
    files: [
      productDownloadFile({ name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "", url: "https://www.ls-electric.com/download/LS_Solution_Overview_EN_CZZZ02-04-202603" }),
      productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" }),
    ],
  },
  {
    id: "dl-5",
    type: "Catalog",
    title: "UL Susol VCB [Susol UL VCB]_User_Manual_UCGT-05/15/27/38kV",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [
      productDownloadFile({ name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "", url: "https://www.ls-electric.com/download/LS_Solution_Overview_EN_CZZZ02-04-202603" }),
      productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" }),
    ],
  },
  {
    id: "dl-6",
    type: "Catalog",
    title: "LV SWGR [UL LV Panelboard] IOM Manual",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" })],
  },
];
