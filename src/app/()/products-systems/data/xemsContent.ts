import type { DevicesProductFeatureDescItem } from "@/components/content/DevicesProductFeaturesSection";
import {
  productDownloadDescriptionSample,
  type ProductDownloadItem,
  type ProductOtherItem,
} from "./productDetailContent";
import type { ProductNavItem } from "../components/product/DevicesProductNav";
import type { HvdcApplication, HvdcWhyBlock } from "./hvdcContent";

const xemsImg = (file: string) => `/img/devices-systems/xems/${file}`;

export const xemsHero = {
  title: "xEMS",
  description:
    "LS ELECTRIC Beyond X™ xEMS provides energy management solutions for energy generation, storage, and consumption. Through FEMS and BEMS solutions, xEMS supports energy savings, efficient operation, demand management, and alternatives to emergency generator operation.",
};

export const xemsOverview = {
  image: xemsImg("overview_hero.jpg"),
  imageAlt: "Industrial control room with energy monitoring dashboards",
  title: "Integrated Energy Management for\nSmarter Operations.",
  description:
    "xEMS combines FEMS and BEMS capabilities into a unified platform for monitoring, analysing, and optimising energy use. It helps maximise efficiency while supporting sustainable operations.",
};

export const xemsBenefitsSection = {
  title: "Key Features",
  items: [
    {
      id: "benefit-1",
      title: "Energy Monitoring",
      description:
        "Monitors energy usage and operating conditions to support visibility across facilities.",
    },
    {
      id: "benefit-2",
      title: "Energy Management",
      description:
        "Supports efficient energy operation and demand management for factories and commercial buildings.",
    },
    {
      id: "benefit-3",
      title: "Energy Analysis",
      description:
        "Provides energy data analysis to help improve energy savings and operational efficiency.",
    },
    {
      id: "benefit-4",
      title: "Energy Optimization",
      description:
        "Supports baseline management, peak demand control, load shedding, renewable energy integration, and energy-saving initiatives to improve overall energy performance.",
    },
  ] satisfies DevicesProductFeatureDescItem[],
};

export const xemsEnergySolutionsSection = {
  title: "Energy Management Solutions",
  description: "",
  items: [
    {
      id: "fems",
      title: "FEMS",
      subtitle: "(Factory Energy Management System)",
      description:
        "FEMS provides an energy management solution for industrial facilities, supporting energy monitoring, management, and analysis across factory operations.",
      image: xemsImg("application_fems.jpg"),
    },
    {
      id: "bems",
      title: "BEMS",
      subtitle: "(Building Energy Management System)",
      description:
        "BEMS provides a control and management solution for commercial buildings, supporting efficient building energy operation and management.",
      image: xemsImg("application_bems.jpg"),
    },
  ] satisfies HvdcApplication[],
  diagramImage: xemsImg("energy_diagram.png"),
  diagramAlt: "Beyond X FEMS energy management capability diagram and maturity levels",
};

export const xemsWhySection = {
  title: "Highlights & Capabilities",
  blocks: [
    {
      id: "why-acquisition",
      title: "Energy Information Acquisition / Management",
      lead: "Collects various energy data scattered around buildings/factories in real-time, enabling objectification, quantification, and history inquiry of the data.",
      cards: [
        { title: "", description: "", image: xemsImg("why_acquisition_01.jpg") },
        { title: "", description: "", image: xemsImg("why_acquisition_02.jpg") },
      ],
    },
    {
      id: "why-diagnosis",
      title: "Energy Diagnosis / Analysis",
      lead: "Diagnoses and analyzes energy data collected in various ways, using various analysis tools to analyze energy usage information.",
      cards: [
        { title: "", description: "", image: xemsImg("why_diagnosis_01.jpg") },
        { title: "", description: "", image: xemsImg("why_diagnosis_02.jpg") },
      ],
    },
    {
      id: "why-efficiency",
      title: "Energy Efficiency & Saving",
      lead: "Sets a baseline using analyzed data on energy usage and conducts efficiency activities to find and manage energy reduction items objectively.",
      cards: [
        { title: "", description: "", image: xemsImg("why_efficiency_01.jpg") },
        { title: "", description: "", image: xemsImg("why_efficiency_02.jpg") },
      ],
    },
    {
      id: "why-pq",
      title: "Power Quality Monitoring / Analysis",
      lead: "Utilizes the platform of Power SCADA to apply key functions of existing SCADA to the FEMS Web solution, and includes proprietary communication protocols such as DNP 3.0, IEC61850, and standard communication protocols like MODBUS TCP.",
      cards: [
        { title: "", description: "", image: xemsImg("why_pq_01.jpg") },
        { title: "", description: "", image: xemsImg("why_pq_02.jpg") },
      ],
    },
  ] satisfies HvdcWhyBlock[],
};

export const xemsDownloads: ProductDownloadItem[] = [
  {
    id: "xems-dl-1",
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
    id: "xems-dl-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
  },
  {
    id: "xems-dl-3",
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

const XEMS_OTHER_PRODUCT_SUBTITLE = "Metasol Contactor & Overload Relay";

export const xemsOtherProductsTitle = "Relavant Products";

export const xemsOtherProducts: ProductOtherItem[] = [
  {
    id: "xems-op-1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Metasol MS",
    subtitle: XEMS_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "xems-op-2",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/other/product_other_mcb.png",
    title: "Miniature circuit breaker",
    subtitle: XEMS_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "xems-op-3",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_mms.png",
    title: "Metasol MMS",
    subtitle: XEMS_OTHER_PRODUCT_SUBTITLE,
    badges: 2,
  },
  {
    id: "xems-op-4",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/other/product_other_susol_ul_mccb.png",
    title: "Susol UL MCCB",
    subtitle: XEMS_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "xems-op-5",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Magnetic Contactor",
    subtitle: XEMS_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "xems-op-6",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Overload Relay",
    subtitle: XEMS_OTHER_PRODUCT_SUBTITLE,
  },
];

export const xemsFaqItems = [
  {
    question: "What is xEMS and how does it support energy management?",
    answer:
      "xEMS is LS ELECTRIC\u2019s unified energy management platform that combines FEMS and BEMS capabilities to monitor, analyse, and optimise energy across industrial and commercial facilities.",
  },
  {
    question: "What is the difference between FEMS and BEMS within xEMS?",
    answer:
      "FEMS focuses on factory and industrial energy monitoring, management, and analysis. BEMS provides building energy control and management for commercial facilities. Both are integrated under the xEMS platform.",
  },
  {
    question: "Which communication protocols does xEMS support?",
    answer:
      "xEMS supports proprietary protocols such as DNP 3.0 and IEC 61850, along with standard protocols like Modbus TCP, enabling integration with existing power and building systems.",
  },
];

export const xemsNavItems: readonly ProductNavItem[] = [
  { id: "product-overview", label: "Overview" },
  { id: "product-benefits", label: "Key Features" },
  { id: "product-applications", label: "Applications" },
  { id: "product-why", label: "Why" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-other", label: "Relavant Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
];
