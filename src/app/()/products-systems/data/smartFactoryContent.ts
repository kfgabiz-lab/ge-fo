import type { DevicesProductFeatureListItem } from "@/components/content/DevicesProductFeaturesSection";
import {
  productDownloadDescriptionSample,
  type ProductDownloadItem,
  type ProductOtherItem,
} from "./productDetailContent";
import type { ProductNavItem } from "../components/product/DevicesProductNav";
import type { HvdcApplication, HvdcWhyBlock } from "./hvdcContent";

const smartFactoryImg = (file: string) => `/pub/img/devices-systems/smart-factory/${file}`;

export const smartFactoryHero = {
  title: "Smart Factory",
  description:
    "LS ELECTRIC Diagnosis is a condition monitoring and diagnostic solution for power equipment. It monitors, diagnoses, and predicts potential failures caused by major component defects, natural aging, or unexpected system conditions during operation. The solution helps improve power supply reliability and support stable equipment operation.",
};

export const smartFactoryOverview = {
  image: smartFactoryImg("overview_hero.jpg"),
  imageAlt: "Smart factory diagnostic monitoring control room",
  title: "Predictive Asset Diagnostics:\nEnhancing Reliability Through Intelligent Monitoring",
  description:
    "Diagnosis detects abnormalities and predicts potential failures through real-time equipment monitoring. It helps improve reliability and ensure stable operation of power assets.",
};

export const smartFactoryBenefitsSection = {
  title: "Key Features",
  items: [
    {
      id: "benefit-1",
      title: "Proven Reliability",
      bullets: [
        "Delivered and successfully operated across critical industries including data centers, oil & gas, petrochemicals, steel, and semiconductor facilities, demonstrating a strong track record of reliable performance.",
      ],
    },
    {
      id: "benefit-2",
      title: "Advanced Event Analysis with Machine Learning",
      bullets: [
        "Utilises machine learning-based analytics to perform advanced event and fault analysis, enabling deeper insights into equipment conditions and operational abnormalities.",
      ],
    },
    {
      id: "benefit-3",
      title: "Reduced Downtime",
      bullets: [
        "Minimises plant downtime through real-time monitoring and high-speed Gigabit Ethernet communication, enabling rapid detection and response to abnormal conditions.",
      ],
    },
    {
      id: "benefit-4",
      title: "Convenient Maintenance and Inspection",
      bullets: [
        "Supports systematic and precise maintenance through intuitive CMD interfaces for individual equipment and a CMS platform capable of monitoring assets across up to 200 sites.",
      ],
    },
  ] satisfies DevicesProductFeatureListItem[],
};

export const smartFactoryApplicationsSection = {
  title: "Main Applied Area",
  description: "",
  items: [
    {
      id: "app-1",
      title: "Transmission-Level Diagnosis System",
      subtitle: "(HV CMD)",
      description:
        "Provides condition monitoring and diagnostic capabilities for high-voltage power equipment, including HV GIS and power transformers, to support reliable operation of transmission assets.",
      image: smartFactoryImg("application_transmission.jpg"),
    },
    {
      id: "app-2",
      title: "Distribution-Level Diagnosis System",
      subtitle: "(MV/LV CMD)",
      description:
        "Provides condition monitoring and diagnostics for medium and low voltage equipment, including cast resin transformers, switchboards, and distribution systems.",
      image: smartFactoryImg("application_distribution.jpg"),
    },
    {
      id: "app-3",
      title: "Centralised Monitoring System",
      subtitle: "(CMS)",
      description:
        "An integrated monitoring and management platform that connects with up to 200 CMD systems, enabling centralised supervision of substation assets across domestic and international sites.",
      image: smartFactoryImg("application_cms.jpg"),
    },
  ] satisfies HvdcApplication[],
};

export const smartFactoryWhySection = {
  title: "System Architecture",
  description:
    "Diagnosis System architecture from data acquisition to centralised monitoring and remote operation.",
  blocks: [
    {
      id: "why-dau",
      title: "DAU (Data Acquisition Unit)",
      lead: "Collects diagnostic data from power equipment through a compact and flexible hardware platform designed for easy installation and maintenance.",
      cards: [
        { title: "", description: "", image: smartFactoryImg("why_dau_01.jpg") },
        { title: "", description: "", image: smartFactoryImg("why_dau_02.jpg") },
      ],
    },
    {
      id: "why-cmd",
      title: "CMD (Condition Monitoring & Diagnostic System)",
      lead: "Provides AI-based condition monitoring, diagnostics, trend analysis, alarm management, and reporting at the local site level.",
      cards: [
        { title: "", description: "", image: smartFactoryImg("why_cmd_01.jpg") },
        { title: "", description: "", image: smartFactoryImg("why_cmd_02.jpg") },
      ],
    },
    {
      id: "why-cms",
      title: "CMS (Centralised Management System)",
      lead: "Enables centralised monitoring and management of up to 200 substations through integrated diagnostics and reporting.",
      cards: [
        { title: "", description: "", image: smartFactoryImg("why_cms_01.jpg") },
        { title: "", description: "", image: smartFactoryImg("why_cms_02.jpg") },
      ],
    },
    {
      id: "why-mobile",
      title: "Mobile HMI",
      layout: "split",
      lead:
        "Provides real-time access to equipment status, alarms,\nand diagnostic information anytime and anywhere through\na web-based mobile interface.",
      cards: [{ title: "", description: "", image: smartFactoryImg("why_mobile_01.jpg") }],
    },
  ] satisfies HvdcWhyBlock[],
};

export const smartFactoryDownloads: ProductDownloadItem[] = [
  {
    id: "smart-factory-dl-1",
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
    id: "smart-factory-dl-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
  },
  {
    id: "smart-factory-dl-3",
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

const SMART_FACTORY_OTHER_PRODUCT_SUBTITLE = "Metasol Contactor & Overload Relay";

export const smartFactoryOtherProductsTitle = "Relavant Products";

export const smartFactoryOtherProducts: ProductOtherItem[] = [
  {
    id: "smart-factory-op-1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/pub/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Metasol MS",
    subtitle: SMART_FACTORY_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "smart-factory-op-2",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/pub/img/devices-systems/products/other/product_other_mcb.png",
    title: "Miniature circuit breaker",
    subtitle: SMART_FACTORY_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "smart-factory-op-3",
    href: "",
    image: "/pub/img/devices-systems/products/other/product_other_metasol_mms.png",
    title: "Metasol MMS",
    subtitle: SMART_FACTORY_OTHER_PRODUCT_SUBTITLE,
    badges: 2,
  },
  {
    id: "smart-factory-op-4",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/pub/img/devices-systems/products/other/product_other_susol_ul_mccb.png",
    title: "Susol UL MCCB",
    subtitle: SMART_FACTORY_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "smart-factory-op-5",
    href: "",
    image: "/pub/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Magnetic Contactor",
    subtitle: SMART_FACTORY_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "smart-factory-op-6",
    href: "",
    image: "/pub/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Overload Relay",
    subtitle: SMART_FACTORY_OTHER_PRODUCT_SUBTITLE,
  },
];

export const smartFactoryFaqItems = [
  {
    question: "What is LS ELECTRIC Diagnosis and how does it support Smart Factory operations?",
    answer:
      "LS ELECTRIC Diagnosis is a condition monitoring and diagnostic solution that detects abnormalities and predicts potential equipment failures in real time, helping improve power supply reliability across industrial facilities.",
  },
  {
    question: "What are DAU, CMD, and CMS in the diagnosis system?",
    answer:
      "DAU collects diagnostic data from field equipment. CMD provides AI-based local monitoring, diagnostics, and reporting. CMS centralises management of up to 200 substations for integrated supervision.",
  },
  {
    question: "Can diagnostic information be accessed remotely?",
    answer:
      "Yes. The Mobile HMI provides web-based access to equipment status, alarms, and diagnostic information from anywhere, supporting faster response and maintenance planning.",
  },
];

export const smartFactoryNavItems: readonly ProductNavItem[] = [
  { id: "product-overview", label: "Overview" },
  { id: "product-benefits", label: "Key Features" },
  { id: "product-applications", label: "Applications" },
  { id: "product-why", label: "Why" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-other", label: "Relavant Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
];
