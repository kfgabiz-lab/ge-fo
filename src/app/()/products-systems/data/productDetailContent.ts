import {
  fetchDownloadCenterContents,
  fetchDownloadCenterFileUrl,
  fetchDownloadDocTypes,
  hasSelectableVersions,
  type DownloadCenterItem,
  type DownloadCenterSort,
} from "@/data/support/downloadCenterData";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

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
  url: string;
};

export const PRODUCT_DOWNLOAD_LINK_BASE =
  "https://www.ls-electric.com/download" as const;

type ProductDownloadFileInput = {
  name: string;
  size: string;
  url?: string;
};

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
  showVersionSelect?: boolean;
  files: ProductDownloadFile[];
  description?: ProductDownloadDescription;
  highlight?: string;
};

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
        showVersionSelect: hasSelectableVersions(item),
        files: mappedFiles,
      } satisfies ProductDownloadItem;
    }),
  );
}

export const PRODUCT_DOWNLOADS_PAGE_SIZE = 5;

export const productDownloadsSortOptions = [
  { value: "doctype", label: "Document Type" },
  { value: "newest", label: "Most Recent" },
  { value: "title", label: "A to Z" },
  { value: "title_desc", label: "Z to A" },
] as const satisfies ReadonlyArray<{ value: DownloadCenterSort; label: string }>;

export const PRODUCT_DOWNLOADS_DEFAULT_SORT: DownloadCenterSort = "";

export function productDownloadsSortLabel(sort: DownloadCenterSort): string {
  if (!sort) return "Select";
  return (
    productDownloadsSortOptions.find((option) => option.value === sort)?.label ??
    "Select"
  );
}

export type ProductDownloadsPage = {
  items: ProductDownloadItem[];
  totalElements: number;
  totalPages: number;
};

export async function fetchProductDownloadsPage({
  docTypes,
  productCodes,
  page = 1,
  sort = PRODUCT_DOWNLOADS_DEFAULT_SORT,
  q,
}: {
  docTypes: string[];
  productCodes: string[];
  page?: number;
  sort?: DownloadCenterSort;
  q?: string;
}): Promise<ProductDownloadsPage> {
  if (productCodes.length === 0) {
    return { items: [], totalElements: 0, totalPages: 1 };
  }

  const res = await fetchDownloadCenterContents({
    docTypes,
    productCodes,
    sort,
    q,
    page: Math.max(0, page - 1),
    size: PRODUCT_DOWNLOADS_PAGE_SIZE,
  });

  return {
    items: await mapDownloadCenterItemsToProductDownloads(res.content),
    totalElements: res.totalElements,
    totalPages: Math.max(1, res.totalPages),
  };
}

export type ProductDownloadsInitialData = {
  docTypeOptions: DownloadFilterOption[];
  page: ProductDownloadsPage;
};

export async function fetchProductDownloadsInitialData(
  productCodes: string[],
): Promise<ProductDownloadsInitialData> {
  const docTypeOptions = await fetchDownloadDocTypes();
  const page = await fetchProductDownloadsPage({
    docTypes: docTypeOptions.map((option) => option.id),
    productCodes,
  });

  return { docTypeOptions, page };
}

export type ProductOtherItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  subtitle?: string;
  badge?: boolean;
  badges?: 1 | 2;
};

export type ProductDetail = {
  slug: string;
  category: string;
  series: string;
  subtitle: string;
  description: string;
  image: string | null;
  specs: ProductSpec[];
  keyFeatures: ProductKeyFeature[];
  lineUp: string;
  downloads: ProductDownloadItem[];
  otherProducts: ProductOtherItem[];
  youtubeVideoId: string;
  awards?: string;
  parentHref: string;
  parentLabel: string;
  configuratorHref?: string;
  connectPortal?: string;
  configuratorExternal?: boolean;
  configuratorBannerBg?: string;
  expertBannerHref?: string;
  expertBannerExternal?: boolean;
  expertContactEmail?: string;
};

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
  image: "/img/devices/product/download_description.webp",
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

export const metasolMsDetail: ProductDetail = {
  slug: "metasol-ms",
  parentHref: "/product-range/magnetic-contactor",
  parentLabel: "Magnetic Contactor",
  category: "Magnetic Contactor",
  series: "Metasol MS",
  subtitle: "",
  description:
    "Metasol MS is a high-reliability motor starter solution designed for stable control and protection of industrial motor circuits. It provides dependable switching and protection functions required for motor operation, while its enclosed structure helps minimize arc exposure. With a compact design, Metasol MS supports safer operation and efficient control panel configuration. A wide range of ratings, various accessories, and support for global standards make it suitable for industrial motor control applications.",
  image: "/img/devices-systems/product/product_metasol_ms_hero.webp",
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
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.webp",
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

export const h100PlusDetail: ProductDetail = {
  slug: "h100_plus",
  parentHref: "/product-range/variable-frequency-drive",
  parentLabel: "Variable Frequency Drive",
  category: "Variable Frequency Drive",
  series: "H100 Plus",
  subtitle: "",
  description:
    "H100+ is an HVAC drive designed for fan and pump applications. It provides dedicated protection functions and control technology to support energy-efficient operation in HVAC systems. With intuitive operation and support for various building automation communication protocols, H100+ enables smart and efficient HVAC control.",
  image: "/img/devices-systems/product/product_h100_plus_hero.webp",
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
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.webp",
  expertBannerHref: "/support/contact-us",
  expertContactEmail: "automation_support.us@lselectricamerica.com",
  otherProducts: [],
};

export const h100PlusFaqItems = metasolMsFaqItems;

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
      image: "/img/devices-systems/products/other/product_other_sp100.webp",
      title: "SP100",
      subtitle: "H100 add-on optimizer",
    },
    {
      id: "op-g100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_g100.webp",
      title: "G100",
      subtitle: "General Drive",
    },
    {
      id: "op-m100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_m100.webp",
      title: "M100",
      subtitle: "Micro Drive",
    },
    {
      id: "op-s100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_s100.webp",
      title: "S100",
      subtitle: "Standard Drive",
    },
    {
      id: "op-is7",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_is7.webp",
      title: "iS7",
      subtitle: "Premium Drive",
    },
  ],
};

export const productTemplateFaqItems = h100PlusFaqItems;

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

export const susolUlSmartMccbDetail: ProductDetail = {
  slug: "susol-ul-smart-mccb",
  parentHref: "/product-range/air-circuit-breaker-power-circuit-breaker",
  parentLabel: "Air Circuit Breaker / Power Circuit Breaker",
  category: "Air Circuit Breaker / Power Circuit Breaker",
  series: "Susol UL ACB",
  subtitle: "",
  description:
    "The premium Susol UL Air Circuit Breaker (ACB) is designed to meet customer requirements with high interrupting capacity, a lineup up to 6000 A, and a frame structure optimized for switchboard design. The Susol UL ACB is equipped with advanced Trip Relays that support measurement, diagnostics, analysis, and communication. Together with a complete power monitoring and protection coordination system, it provides an integrated solution for power distribution applications.",
  image: "/img/devices-systems/product/product_susol_ul_smart_mccb_hero.webp",
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
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.webp",
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

export const metasolMsNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

export const h100PlusNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

export const susolUlSmartMccbNavItems = [
  { id: "product-key-feature", label: "Key Features" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;
