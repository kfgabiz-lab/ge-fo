import {
  productDownloadFile,
  type ProductDownloadFile,
  type ProductDownloadItem,
} from "@/app/()/products-systems/data/productDetailContent";
import { emptyStateIconSrc } from "@/data/commonAssets";

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

export type DownloadActiveFilterChip = {
  id: string;
  group: "Category" | "Types";
  value: string;
};

export const downloadCenterNoDataSearchQuery = "XYZ" as const;

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

export const downloadDocumentTypes: DownloadFilterOption[] = [
  { id: "C", label: "Catalogs", count: 100 },
  { id: "M", label: "Manuals", count: 100 },
  { id: "D", label: "Drawings", count: 100 },
  { id: "R", label: "Certificates", count: 100 },
  { id: "S", label: "Software", count: 100 },
  { id: "O", label: "Tech Data", count: 100 },
];

export const downloadDocTypeCodes = ["C", "M", "D", "S", "R", "O"] as const;

// 제품상세 Downloads 섹션의 문서유형 기본 체크 상태 = 전체 6종(Catalog/Manual/Drawings/Software/Certificates/Tech Data).
// 기획서 18번("연계된 파일이 1개 이상 존재하는 경우에만 섹션 출력")이 문서유형을 제한하지 않으므로,
// 기본값을 전체로 두면 SSR 조회 1건이 "섹션 노출 판정"과 "화면에 보여줄 초기 목록"을 동시에 만족한다
// (별도 게이트 카운트 조회 불필요 / 인증서만 연계된 제품도 진입 즉시 목록에 보인다).
export const productDownloadsDefaultDocTypes: string[] = [...downloadDocTypeCodes];

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
