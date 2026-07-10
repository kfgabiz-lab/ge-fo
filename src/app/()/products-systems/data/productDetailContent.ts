export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductKeyFeature = {
  id: string;
  title: string;
  description: string;
};

export type ProductLineupTypeCell = {
  image: string;
  label: string;
};

export type ProductLineupRow = {
  type: ProductLineupTypeCell;
  ratedCurrent: string;
  /** Figma: pipe-separated interrupting values */
  interrupting: string[];
  standard: string;
  /** Taller row (e.g. long type label) — Figma 246px */
  tall?: boolean;
};

/** Figma 4288:43889 — VFD frame spec table (Frame × Horse Power × Motor Rating) */
export type ProductFrameLineupRow = {
  label: string;
  values: string[];
};

export type ProductFrameLineup = {
  columns: string[];
  rows: ProductFrameLineupRow[];
};

export type ProductDownloadFile = {
  name: string;
  size: string;
};

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

/** devices_product_lineup · type1(MCCB) · type2(VFD frame) */
export type ProductLineupVariant = "type1" | "type2";

export type ProductDetail = {
  slug: string;
  category: string;
  series: string;
  subtitle: string;
  description: string;
  image: string;
  specs: ProductSpec[];
  keyFeatures: ProductKeyFeature[];
  lineup?: ProductLineupRow[];
  /** 가이드: type1(MCCB) · type2(VFD frame) */
  lineupVariant?: ProductLineupVariant;
  frameLineup?: ProductFrameLineup;
  downloads: ProductDownloadItem[];
  otherProducts: ProductOtherItem[];
  youtubeVideoId: string;
  parentHref: string;
  parentLabel: string;
  configuratorHref?: string;
  configuratorExternal?: boolean;
  configuratorBannerBg?: string;
  expertBannerHref?: string;
  expertBannerExternal?: boolean;
  expertContactEmail?: string;
};

/** Figma 4288:43926 — H100 Plus Key Features */
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

const sharedInterrupting = ["35 kA(Ni)", "65 kA(Hi)", "100 kA(Li)"];

/** variant=type1 · devices_product_lineup type1 */
export const sharedLineup: ProductLineupRow[] = [
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts150.png",
      label: "UTS150",
    },
    ratedCurrent: "40-150A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts250.png",
      label: "UTS250",
    },
    ratedCurrent: "250A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts400.png",
      label: "UTS400",
    },
    ratedCurrent: "250-400A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts600.png",
      label: "UTS600",
    },
    ratedCurrent: "600A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts1200.png",
      label: "HVDC(High Voltage Direct Current Transmission System)",
    },
    ratedCurrent: "800-1200A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
    tall: true,
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
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
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
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
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
      { name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "" },
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
    ],
  },
];

/** Figma 4288:43889 — H100 Plus frame lineup */
const h100PlusFrameLineup: ProductFrameLineup = {
  columns: ["A~F Frame", "G~I Frame", "J~L Frame"],
  rows: [
    {
      label: "Horse Power",
      values: ["1~125", "150~400", "500~1000"],
    },
    {
      label: "Motor Rating",
      values: ["0.75 kW~90 kW", "110 kW~250 kW", "315kW~750kW"],
    },
  ],
};

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
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
    ],
  },
  {
    id: "dl-2",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 9, 2025",
    version: "",
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
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
    ],
  },
  {
    id: "dl-4",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      { name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "" },
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
    ],
  },
  {
    id: "dl-5",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
    ],
  },
];

/** Figma 4288:43648 — H100 Plus product detail (metasol-ms route) */
export const metasolMsDetail: ProductDetail = {
  slug: "metasol-ms",
  parentHref: "/products-systems/lv-automation",
  parentLabel: "Variable Frequency Drive",
  category: "Variable Frequency Drive",
  series: "H100 Plus",
  subtitle: "",
  description:
    "H100+ is an HVAC drive designed for fan and pump applications. It provides dedicated protection functions and control technology to support energy-efficient operation in HVAC systems. With intuitive operation and support for various building automation communication protocols, H100+ enables smart and efficient HVAC control.",
  image: "/img/devices-systems/product/product_h100_plus_hero.png",
  specs: [
    { label: "Motor rating", value: "1~1000HP (7.5~400HP/600VAC)" },
    { label: "Standard", value: "UL61800-5-1 based design" },
    {
      label: "Marine Cert.",
      value: "ABS, DNV/GL, LR, KR, NK, BV, RINA, CCS, RS",
    },
  ],
  keyFeatures: h100PlusKeyFeatures,
  lineupVariant: "type2",
  frameLineup: h100PlusFrameLineup,
  downloads: metasolMsDownloads,
  youtubeVideoId: "E3wi6qPy1Cc",
  configuratorHref: "https://connect.ls-electric.com/product/config?id=a0TTJ00000uqvlV2AQ",
  configuratorExternal: true,
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.png",
  expertBannerHref: "/support/contact-us",
  expertContactEmail: "automation_support.us@lselectricamerica.com",
  otherProducts: [
    {
      id: "op-sp100",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_sp100.png",
      title: "SP100",
      subtitle: "H100 add-on optimizer",
      // badges: 2,
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

/** H100 Plus product detail — /devices-systems/motor-control/h100_plus */
export const h100PlusDetail: ProductDetail = {
  ...metasolMsDetail,
  slug: "h100_plus",
};

export const h100PlusFaqItems = metasolMsFaqItems;

/** Figma 4513:49636 — Susol UL Smart MCCB Key Features */
const susolUlSmartMccbKeyFeatures: ProductKeyFeature[] = [
  {
    id: "kf-1",
    title: "Energy Optimization",
    description:
      "Measures current, voltage, power, and energy to help analyze power consumption by equipment. This supports energy efficiency improvements and power quality monitoring.",
  },
  {
    id: "kf-2",
    title: "Flexible Application",
    description:
      "Available in 150–1200 AF frames with multiple Trip Unit options, from ETSi to ETLi. Users can select the appropriate functionality for different low-voltage distribution applications.",
  },
  {
    id: "kf-3",
    title: "Reliable Protection",
    description:
      "Supports LSIG protection functions to respond to various fault conditions. With interrupting capacity up to 150 kA and a UL-compliant design, it provides reliable power system protection.",
  },
  {
    id: "kf-4",
    title: "Smart Management",
    description:
      "Provides event logs, fault history, and power data recording. Communication-based remote monitoring helps support maintenance and system management.",
  },
];

const mccbInterrupting = ["35 kA(Ni)", "65 kA(Hi)", "100 kA(Li)"];

/** Figma 4513:49818 — Susol UL Smart MCCB lineup (variant=type1) */
const susolUlSmartMccbLineup: ProductLineupRow[] = [
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts150.png",
      label: "UTS150",
    },
    ratedCurrent: "40-150A",
    interrupting: mccbInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts250.png",
      label: "UTS250",
    },
    ratedCurrent: "250A",
    interrupting: mccbInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts400.png",
      label: "UTS400",
    },
    ratedCurrent: "250-400A",
    interrupting: mccbInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts600.png",
      label: "UTS600",
    },
    ratedCurrent: "600A",
    interrupting: mccbInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts800.png",
      label: "UTS800",
    },
    ratedCurrent: "400~800 A",
    interrupting: mccbInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts1200.png",
      label: "UTS1200",
    },
    ratedCurrent: "800-1200A",
    interrupting: mccbInterrupting,
    standard: "UL 489, CSA",
  },
];

/** Figma 4513:49636 — Susol UL Smart MCCB product detail */
export const susolUlSmartMccbDetail: ProductDetail = {
  slug: "susol-ul-smart-mccb",
  parentHref: "/products-systems/motor-control",
  parentLabel: "Molded Case Circuit Breaker",
  category: "Molded Case Circuit Breaker",
  series: "Susol UL Smart MCCB",
  subtitle: "High Voltage Direct Current Transmission System",
  description:
    "The premium Susol UL Smart MCCB is a digitally enabled molded case circuit breaker designed for low-voltage power distribution systems. With a wide range of current ratings and interrupting capacities, it supports various system requirements while providing reliable circuit protection. Equipped with a Smart Trip Unit, the Susol UL Smart MCCB integrates metering, diagnostics, and communication functions to support stable protection and more efficient energy management.",
  image: "/img/devices-systems/product/product_susol_ul_smart_mccb_hero.png",
  specs: [
    { label: "Rated Current", value: "40–1200 A" },
    {
      label: "Interrupting Capacity",
      value: "Up to 150 kA at 240 Vac\nUp to 100 kA at 480 Vac",
    },
    { label: "Standards", value: "UL 489, CSA" },
  ],
  keyFeatures: susolUlSmartMccbKeyFeatures,
  lineupVariant: "type1",
  lineup: susolUlSmartMccbLineup,
  downloads: metasolMsDownloads,
  youtubeVideoId: "",
  configuratorHref: "https://connect.ls-electric.com/product/config?id=a0TTJ00000uqvlV2AQ",
  configuratorExternal: true,
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.png",
  expertBannerHref: "/support/contact-us",
  expertContactEmail: "automation_support.us@lselectricamerica.com",
  otherProducts: [
    {
      id: "op-susol-ul-mccb",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_susol_ul_mccb_1.png",
      title: "Susol UL MCCB",
      // badges: 2,
    },
    {
      id: "op-susol-ul-mccb-1000v",
      href: "#",
      image: "/img/devices-systems/products/other/product_other_susol_ul_mccb.png",
      title: "Susol UL MCCB(up to 1000V)",
    },
  ],
};

export const susolUlSmartMccbFaqItems = metasolMsFaqItems;

export const productDetailsBySlug: Record<string, ProductDetail> = {
  "metasol-ms": metasolMsDetail,
  h100_plus: h100PlusDetail,
  "susol-ul-smart-mccb": susolUlSmartMccbDetail,
};

export function getProductDetail(slug: string): ProductDetail | undefined {
  return productDetailsBySlug[slug];
}

export const productDetailNavItems = [
  { id: "product-key-feature", label: "Key Feature" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-other", label: "Other Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

/** Figma 4513:50001 — Susol UL Smart MCCB (no Video section) */
export const susolUlSmartMccbNavItems = [
  { id: "product-key-feature", label: "Key Feature" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-other", label: "Other Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;
