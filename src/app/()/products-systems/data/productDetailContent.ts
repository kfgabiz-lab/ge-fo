import {
  fetchDownloadCenterContents,
  fetchDownloadCenterFileUrl,
  type DownloadCenterItem,
  type DownloadCenterSort,
} from "@/data/support/downloadCenterData";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductKeyFeature = {
  id: string;
  title: string;
  description: string;
};

export type ProductDownloadFile = {
  name: string;
  size: string;
  /** Copy Link clipboard target */
  url: string;
};

/** Dummy download base — `url` 미지정 시 사용 */
export const PRODUCT_DOWNLOAD_LINK_BASE =
  "https://www.ls-electric.com/download" as const;

type ProductDownloadFileInput = {
  name: string;
  size: string;
  /** 생략 시 더미 URL 자동 생성. 하드코딩하려면 직접 입력 */
  url?: string;
};

/**
 * Download 파일 데이터.
 * @example
 * productDownloadFile({ name: "a.pdf", size: "1MB", url: "https://www.ls-electric.com/download/a.pdf" })
 * productDownloadFile({ name: "a.pdf", size: "1MB", url: "https://example.com/a.pdf" })
 */
export function productDownloadFile({
  name,
  size,
  url = `${PRODUCT_DOWNLOAD_LINK_BASE}/${encodeURIComponent(name)}`,
}: ProductDownloadFileInput): ProductDownloadFile {
  return { name, size, url };
}

export type ProductDownloadDescription = {
  paragraphs: string[];
  image: string;
  imageAlt?: string;
};

export type ProductDownloadItem = {
  id: string;
  type: string;
  title: string;
  date: string;
  version: string;
  versions?: string[];
  files: ProductDownloadFile[];
  description?: ProductDownloadDescription;
  /** Search results — title/file name highlight (inline or suffix) */
  highlight?: string;
};

// 다운로드센터 공통 최신 목록(DownloadCenterItem[]) → 제품상세 Downloads 섹션이 요구하는 ProductDownloadItem[] 변환.
// - files는 sortKey가 가장 큰(최신) 버전의 파일만 매핑한다. version/versions는 전체 버전명 기준.
// - files의 url은 filePath를 fetchDownloadCenterFileUrl로 조회한 실제 다운로드 URL(파일별 병렬 조회).
// - GenericProductDetail(HW)과 SwProductDetail(SW 4종) 양쪽에서 공유한다(중복 작성 금지).
export async function mapDownloadCenterItemsToProductDownloads(
  items: DownloadCenterItem[],
): Promise<ProductDownloadItem[]> {
  return Promise.all(
    items.map(async (item) => {
      const latestVersion = item.versions.reduce<
        (typeof item.versions)[number] | null
      >((latest, v) => (!latest || v.sortKey > latest.sortKey ? v : latest), null);
      const files = latestVersion?.files ?? [];
      const mappedFiles: ProductDownloadFile[] = await Promise.all(
        files.map(async (file) => ({
          name: file.fileName ?? "",
          size: file.fileSizeText ?? "",
          url: await fetchDownloadCenterFileUrl(file.filePath),
        })),
      );
      const versionNames = item.versions
        .map((v) => v.versionName)
        .filter((name): name is string => Boolean(name));
      return {
        id: String(item.id),
        type: item.docTypeLabel || item.docType || "",
        title: item.title ?? "",
        date: item.date ?? "",
        version: latestVersion?.versionName ?? "",
        versions: versionNames,
        files: mappedFiles,
      } satisfies ProductDownloadItem;
    }),
  );
}

// 제품상세 Downloads 섹션 페이지 크기.
// 기획서(fo/docs/dev/products-systems/product.png DESCRIPTION 20번) "리스트에 최대 5개 데이터 출력 /
// 5개 초과 시 페이징처리" 에 명시된 값이다. Download Center(support, 12개)와 다른 화면 전용 값이라
// 공유 상수를 쓰지 않고 여기서 별도로 정의한다.
export const PRODUCT_DOWNLOADS_PAGE_SIZE = 5;

// 제품상세 Downloads 섹션 "Sort by" 옵션.
// 기획서(fo/docs/dev/products-systems/product.png DESCRIPTION 21번)가 지정한 4종 그대로이며,
// 표시 순서도 기획서 나열 순서를 따른다. PC 드롭다운(DevicesProductDownloads)과
// 모바일 정렬 시트(DevicesProductDownloadsMobileControls)가 같은 목록을 공유한다(중복 정의 금지).
export const productDownloadsSortOptions = [
  { value: "doctype", label: "Document Type" },
  { value: "newest", label: "Most Recent" },
  { value: "title", label: "A to Z" },
  { value: "title_desc", label: "Z to A" },
] as const satisfies ReadonlyArray<{ value: DownloadCenterSort; label: string }>;

// 기본 선택값 — 기획서 "Default 정렬순서 : Document Type".
export const PRODUCT_DOWNLOADS_DEFAULT_SORT: DownloadCenterSort = "doctype";

// 정렬 코드 → 표시 라벨. 드롭다운 renderValue / 모바일 트리거 라벨이 공유한다.
export function productDownloadsSortLabel(sort: DownloadCenterSort): string {
  return (
    productDownloadsSortOptions.find((option) => option.value === sort)?.label ??
    "Sort by"
  );
}

// 제품상세 Downloads 섹션 1페이지 조회 결과.
export type ProductDownloadsPage = {
  items: ProductDownloadItem[];
  /** 필터 조건 전체 건수(현재 페이지 건수 아님) — "Showing x-y of N results" 의 N */
  totalElements: number;
  /** 최소 1(0건이어도 페이저는 1페이지로 표시) */
  totalPages: number;
};

// 제품상세 Downloads 섹션 페이지 조회(SSR 초기 렌더 / 클라이언트 페이지 이동 공용).
// - 페이징은 BE(download-center/contents)에 위임한다. 전체 목록을 받아 클라이언트에서 잘라내지 않는다
//   (기획서 페이저가 68페이지까지 그려진 대용량 목록이라 전량 조회가 성립하지 않는다).
// - page 는 UI 기준 1-based. BE 는 0-based 라 여기서 변환한다.
// - 정렬도 BE 위임이다. 기본값(doctype)은 SSR 초기 렌더와 클라이언트 초기 상태가 반드시 같아야 하므로
//   여기 기본 인자 한 곳에서만 정한다(호출부에서 각자 지정하지 말 것).
// - GenericProductDetail(HW) / SwProductDetail(SW 4종) / DevicesProductDownloads(클라이언트) 세 곳이
//   같은 조건으로 조회해야 하므로 조회+변환을 이 함수 한 곳에만 둔다(중복 작성 금지).
// - productCodes: 현재 제품과 연계된 파일만 노출하기 위한 제품코드 필터(기획서 DESCRIPTION 18번).
//   BE(download-center/contents)의 productCodes 파라미터(CSV)로 위임한다.
export async function fetchProductDownloadsPage({
  docTypes,
  productCodes,
  page = 1,
  sort = PRODUCT_DOWNLOADS_DEFAULT_SORT,
}: {
  docTypes: string[];
  /** 연계 제품코드(product.product_code). 제품코드를 못 구하면 빈 배열로 넘긴다. */
  productCodes: string[];
  page?: number;
  sort?: DownloadCenterSort;
}): Promise<ProductDownloadsPage> {
  // ⚠️ 제품코드가 하나도 없으면 BE 를 호출하지 않고 즉시 빈 페이지를 돌려준다.
  //    BE 는 productCodes 가 비면 "필터 없음"으로 보고 전체 목록을 반환하는데,
  //    기획서 18번("현재 제품과 연계된 파일만 출력") 기준에서 제품코드를 못 구한 상황은
  //    "연계 파일 0건"이지 "전체 노출"이 아니다. 호출을 생략해야 무관한 전체 목록 노출을 막을 수 있다.
  if (productCodes.length === 0) {
    return { items: [], totalElements: 0, totalPages: 1 };
  }

  const res = await fetchDownloadCenterContents({
    docTypes,
    productCodes,
    sort,
    page: Math.max(0, page - 1),
    size: PRODUCT_DOWNLOADS_PAGE_SIZE,
  });

  return {
    items: await mapDownloadCenterItemsToProductDownloads(res.content),
    totalElements: res.totalElements,
    totalPages: Math.max(1, res.totalPages),
  };
}

// Downloads 섹션 노출 여부 판정용 건수 조회(기획서 DESCRIPTION 18번).
// ⚠️ 화면에 렌더되는 초기 목록(fetchProductDownloadsPage)과 목적이 다르다.
//   - 목록 조회: 문서유형 기본 체크(Catalog/Manual) 조건 → 필터 UI 초기값과 SSR 결과를 맞추기 위함.
//   - 이 함수: 기획서 18번은 "연계된 파일이 1개이상 존재하는 경우에만 해당 섹션 출력"으로 문서유형을 제한하지 않는다.
//     따라서 docTypes 를 주지 않고(= 전체 문서유형) 건수만 센다. Certificates/Drawings/Software/Tech Data 만
//     연계된 제품도 섹션이 노출돼야 한다.
// 건수만 필요하므로 size: 1 로 최소 조회하고, 파일별 CTP URL 을 조회하는 무거운 변환
// (mapDownloadCenterItemsToProductDownloads)은 거치지 않는다.
// GenericProductDetail(HW) / SwProductDetail(SW 4종) 양쪽에서 공유한다(중복 작성 금지).
export async function fetchProductDownloadsGateCount(
  productCodes: string[],
): Promise<number> {
  // 제품코드를 못 구한 상황은 "연계 파일 0건"이지 "전체 노출"이 아니다(fetchProductDownloadsPage 와 동일 가드).
  // BE 는 productCodes 가 비면 필터 없음으로 보고 전체 건수를 반환하므로 호출 자체를 생략한다.
  if (productCodes.length === 0) return 0;
  const res = await fetchDownloadCenterContents({ productCodes, size: 1 });
  return res.totalElements;
}

export type ProductOtherItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  /** Figma subtitle — e.g. category line under title */
  subtitle?: string;
  /** 단일 뱃지 (badge1, 80px) — `badges` 미사용 시 호환 */
  badge?: boolean;
  /** 1: type1 (80px) · 2: type2 (72px) — 각 1개 뱃지 */
  badges?: 1 | 2;
};

/** @deprecated H100 Plus uses per-item subtitles (Figma 4288:43708) */
export const metasolMsOtherProductsSubtitle =
  "Metasol Contactor & Overload Relay";

export type ProductDetail = {
  slug: string;
  category: string;
  series: string;
  subtitle: string;
  description: string;
  /** 실이미지 없으면 null — 렌더 쪽에서 이미지 영역 자체를 생략한다(플레이스홀더 미사용) */
  image: string | null;
  specs: ProductSpec[];
  keyFeatures: ProductKeyFeature[];
  /** product_etc.line_up 리치텍스트 HTML(그대로 렌더). 정적 템플릿은 빈 문자열 */
  lineUp: string;
  downloads: ProductDownloadItem[];
  otherProducts: ProductOtherItem[];
  youtubeVideoId: string;
  /** product.awards — "01"이면 iF Design Awards 수상. 히어로 로고/문구(8번) 조건부 노출용. 정적 템플릿은 미설정(undefined) */
  awards?: string;
  parentHref: string;
  parentLabel: string;
  configuratorHref?: string;
  /** product_etc.connect_portal — configuratorHref와 동일 값이지만 Help 카드(help-1) CTA 링크로 별도 노출한다 */
  connectPortal?: string;
  configuratorExternal?: boolean;
  configuratorBannerBg?: string;
  expertBannerHref?: string;
  expertBannerExternal?: boolean;
  expertContactEmail?: string;
};

/** Figma 6843:64936 — H100 Plus Key Features */
const h100PlusKeyFeatures: ProductKeyFeature[] = [
  {
    id: "kf-1",
    title: "Fan and Pump Protection & Optimization",
    description:
      "Built-in functions such as No-Flow detection help protect and optimize fan and pump equipment.",
  },
  {
    id: "kf-2",
    title: "Energy-Saving Control",
    description:
      "Advanced PID control and Sleep Mode help improve energy efficiency in HVAC applications.",
  },
  {
    id: "kf-3",
    title: "Dedicated Hand-Off-Auto Keypad",
    description: "Equipped with a Hand-Off-Auto keypad for intuitive operation.",
  },
  {
    id: "kf-4",
    title: "Building Automation Connectivity",
    description:
      "Supports building and HVAC automation protocols, including BACnet, N2, and Modbus.",
  },
];

export const productDownloadDescriptionSample: ProductDownloadDescription = {
  paragraphs: [
    "Due to internal structure changes due to the addition of the history alarm function starting from V3.80, a HistoryAlarm Error Message may occur if alarm data from the existing V3.70 or lower version remains in the device. When updating to version V3.80 or upper, be sure to check [Delete all monitoring data ]. (The device’s existing alarm, logging, and recipe data will be deleted.)",
    "Starting from V3.80.0605, the warning message has been strengthened when NVRAM data is not deleted. Please refer to the 3.80.0605 Release Note.",
    "When the HMI is turned off, turn on the backup battery switch on the back of the device and take action related to NVRAM as described in Release Note.",
  ],
  image: "/img/devices/product/download_description.png",
  imageAlt: "Download software interface screenshot",
};

const sharedDownloads: ProductDownloadItem[] = [
  {
    id: "dl-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    description: productDownloadDescriptionSample,
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "dl-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" }),
    ],
  },
  {
    id: "dl-3",
    type: "Manual",
    title: "Cast Resin Transformer [Transformer]_Catalog_IEEE_EN_202110",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      productDownloadFile({ name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "", url: "https://www.ls-electric.com/download/LS_Solution_Overview_EN_CZZZ02-04-202603" }),
      productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" }),
    ],
  },
];

/** Figma 5841:132459 — downloads list (5 items) */
const metasolMsDownloads: ProductDownloadItem[] = [
  {
    id: "dl-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
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
    version: "",
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "dl-3",
    type: "Manual",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" }),
    ],
  },
  {
    id: "dl-4",
    type: "Manual",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      productDownloadFile({ name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "", url: "https://www.ls-electric.com/download/LS_Solution_Overview_EN_CZZZ02-04-202603" }),
      productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" }),
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "dl-5",
    type: "Manual",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
];

/** Figma 6788:8339 — Metasol MS Key Features */
const metasolMsKeyFeatures: ProductKeyFeature[] = [
  {
    id: "kf-1",
    title: "Control Performance",
    description:
      "Provides reliable switching control for industrial motor and load circuits. Designed for dependable control performance across various operating environments.",
  },
  {
    id: "kf-2",
    title: "Safety Design",
    description:
      "Enclosed construction helps minimize arc exposure. Finger-proof design helps enhance operator safety during installation and maintenance.",
  },
  {
    id: "kf-3",
    title: "Wide Product Lineup",
    description:
      "Available in 9 frame sizes and 25 current ratings. Allows flexible product selection for different equipment capacities.",
  },
  {
    id: "kf-4",
    title: "Configuration Efficiency",
    description:
      "Compact design helps improve space efficiency in control panels. Easily configured with accessories such as auxiliary contacts, interlocks, and surge units.",
  },
];

/** Figma 6788:8339 — Metasol MS product detail */
export const metasolMsDetail: ProductDetail = {
  slug: "metasol-ms",
  parentHref: "/products-category/lv-products-and-systems",
  parentLabel: "Magnetic Contactor",
  category: "Magnetic Contactor",
  series: "Metasol MS",
  subtitle: "",
  description:
    "Metasol MS is a high-reliability motor starter solution designed for stable control and protection of industrial motor circuits. It provides dependable switching and protection functions required for motor operation, while its enclosed structure helps minimize arc exposure. With a compact design, Metasol MS supports safer operation and efficient control panel configuration. A wide range of ratings, various accessories, and support for global standards make it suitable for industrial motor control applications.",
  image: "/img/devices-systems/product/product_metasol_ms_hero.png",
  specs: [
    { label: "Rated Current", value: "6 ~ 2650 A" },
    { label: "Rated Operational Voltage", value: "690, 1000 V" },
    { label: "Standard", value: "UL 60947-4-1" },
  ],
  keyFeatures: metasolMsKeyFeatures,
  lineUp: "",
  downloads: metasolMsDownloads,
  youtubeVideoId: "E3wi6qPy1Cc",
  configuratorHref: "https://connect.ls-electric.com/product/config?id=a0TTJ00000uqvlV2AQ",
  configuratorExternal: true,
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.png",
  expertBannerHref: "/support/contact-us",
  expertContactEmail: "automation_support.us@lselectricamerica.com",
  otherProducts: [],
};

export const metasolMsFaqItems = [
  {
    question:
      "What is a Hoist private auxiliary contact and what is the difference with the normal auxiliary contact?",
    answer:
      "A hoist private auxiliary contact is dedicated to hoist control circuits and signals hoist-specific operating states. A normal auxiliary contact provides general status indication for standard motor control applications and is not configured for hoist-specific interlocking sequences.",
  },
  {
    question: "In what standard should I decide the Thermal type overload relay?",
    answer:
      "Select the thermal overload relay class based on the applicable motor protection standard for your region and application, such as IEC 60947-4-1 or UL 508. Match the relay trip class and current range to the motor full-load current and starting duty.",
  },
  {
    question: "In which case would the off delay unit be used?",
    answer:
      "An off-delay unit is used when a controlled output must remain energized for a set time after the input signal turns off, such as cooling fan run-on, sequential shutdown, or maintaining auxiliary power during transfer operations.",
  },
];

/** Figma 6843:64936 — H100 Plus product detail */
export const h100PlusDetail: ProductDetail = {
  slug: "h100_plus",
  parentHref: "/product-range/variable-frequency-drive",
  parentLabel: "Variable Frequency Drive",
  category: "Variable Frequency Drive",
  series: "H100 Plus",
  subtitle: "",
  description:
    "H100+ is an HVAC drive designed for fan and pump applications. It provides dedicated protection functions and control technology to support energy-efficient operation in HVAC systems. With intuitive operation and support for various building automation communication protocols, H100+ enables smart and efficient HVAC control.",
  image: "/img/devices-systems/product/product_h100_plus_hero.png",
  specs: [
    { label: "Motor rating", value: "1 - 1000HP" },
    {
      label: "Supply Voltage",
      value: "3 x 200-240VAC, 380-480VAC, 525-600VAC",
    },
    { label: "Standard", value: "UL, cUL, CE, RoHS, Marine, OSHPD" },
  ],
  keyFeatures: h100PlusKeyFeatures,
  lineUp: "",
  downloads: metasolMsDownloads,
  youtubeVideoId: "E3wi6qPy1Cc",
  configuratorHref: "https://connect.ls-electric.com/product/config?id=a0TTJ00000uqvlV2AQ",
  configuratorExternal: true,
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.png",
  expertBannerHref: "/support/contact-us",
  expertContactEmail: "automation_support.us@lselectricamerica.com",
  otherProducts: [],
};

export const h100PlusFaqItems = metasolMsFaqItems;

/** Product detail page template — copied from H100 Plus (`/motor-control/h100_plus`) */
export const productTemplateDetail: ProductDetail = {
  ...h100PlusDetail,
  slug: "template",
  series: "Product Template",
  category: "Product Category",
  parentLabel: "Product Category",
  parentHref: "/products-category/lv-products-and-systems",
  description:
    "Product detail page template based on the H100 Plus layout. Replace hero copy, specs, key features, lineup, downloads, video, and other products for each new product page.",
  otherProducts: [
    {
      id: "op-sp100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_sp100.png",
      title: "SP100",
      subtitle: "H100 add-on optimizer",
    },
    {
      id: "op-g100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_g100.png",
      title: "G100",
      subtitle: "General Drive",
    },
    {
      id: "op-m100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_m100.png",
      title: "M100",
      subtitle: "Micro Drive",
    },
    {
      id: "op-s100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_s100.png",
      title: "S100",
      subtitle: "Standard Drive",
    },
    {
      id: "op-is7",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_is7.png",
      title: "iS7",
      subtitle: "Premium Drive",
    },
  ],
};

export const productTemplateFaqItems = h100PlusFaqItems;

/** Figma 6788:7460 — Susol UL ACB Key Features */
const susolUlSmartMccbKeyFeatures: ProductKeyFeature[] = [
  {
    id: "kf-1",
    title: "Efficiency",
    description:
      "Modular, compact design improves space efficiency. High interrupting performance and low power loss support stable power management.",
  },
  {
    id: "kf-2",
    title: "Convenience",
    description:
      "Replaceable Trip Units and Plugs simplify maintenance. Multiple connection options and draw-out construction provide design flexibility. Field-installable accessories help improve installation efficiency.",
  },
  {
    id: "kf-3",
    title: "Reliability",
    description:
      "Supports performance ratings up to 130 kA and 847 Vac. Electronic Trip technology enables precise protection and metering. Tested for industrial environmental conditions to support reliable application.",
  },
  {
    id: "kf-4",
    title: "Smart Features",
    description:
      "Supports Modbus, BLE, NFC, and USB connectivity. Integrates protection, metering, diagnostics, and communication functions.",
  },
];

/** Figma 6788:7460 — Susol UL ACB product detail (route: susol-ul-smart-mccb) */
export const susolUlSmartMccbDetail: ProductDetail = {
  slug: "susol-ul-smart-mccb",
  parentHref: "/products-category/lv-products-and-systems",
  parentLabel: "Air Circuit Breaker / Power Circuit Breaker",
  category: "Air Circuit Breaker / Power Circuit Breaker",
  series: "Susol UL ACB",
  subtitle: "",
  description:
    "The premium Susol UL Air Circuit Breaker (ACB) is designed to meet customer requirements with high interrupting capacity, a lineup up to 6000 A, and a frame structure optimized for switchboard design. The Susol UL ACB is equipped with advanced Trip Relays that support measurement, diagnostics, analysis, and communication. Together with a complete power monitoring and protection coordination system, it provides an integrated solution for power distribution applications.",
  image: "/img/devices-systems/product/product_susol_ul_smart_mccb_hero.png",
  specs: [
    { label: "Rated Current", value: "400~6000 A" },
    {
      label: "Rated Short Circuit Current (Sym.)",
      value: "Up to 130 kA (at 508 Vac, 6000 A)\nUp to 85 kA (at 847 Vac, 4000 A)",
    },
    {
      label: "Standard",
      value: "UL 489 (C-frame), UL 1066 (D, E, G-frame)",
    },
  ],
  keyFeatures: susolUlSmartMccbKeyFeatures,
  lineUp: "",
  downloads: metasolMsDownloads,
  youtubeVideoId: "",
  configuratorHref: "https://connect.ls-electric.com/product/config?id=a0TTJ00000uqvlV2AQ",
  configuratorExternal: true,
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.png",
  expertBannerHref: "/support/contact-us",
  expertContactEmail: "automation_support.us@lselectricamerica.com",
  otherProducts: [],
};

export const susolUlSmartMccbFaqItems = metasolMsFaqItems;

export const productDetailsBySlug: Record<string, ProductDetail> = {
  "metasol-ms": metasolMsDetail,
  h100_plus: h100PlusDetail,
  "susol-ul-smart-mccb": susolUlSmartMccbDetail,
  template: productTemplateDetail,
};

export function getProductDetail(slug: string): ProductDetail | undefined {
  return productDetailsBySlug[slug];
}

export const productDetailNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-other", label: "Other Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

/** Figma 6788:8339 — Metasol MS (no Other Products) */
export const metasolMsNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

/** Figma 6843:64936 — H100 Plus (no Other Products) */
export const h100PlusNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

/** Figma 6788:7460 — Susol UL ACB (no Video / Other Products) */
export const susolUlSmartMccbNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;
