import type { DevicesProductFeatureListItem } from "@/components/content/DevicesProductFeaturesSection";
import {
  productDownloadDescriptionSample,
  type ProductDownloadItem,
  type ProductOtherItem,
} from "./productDetailContent";
import type { ProductNavItem } from "../components/product/DevicesProductNav";

const hvdcImg = (file: string) => `/img/devices-systems/hvdc/${file}`;

export const hvdcHero = {
  tagline: null,
  title: "SCADA",
  description:
    "LS ELECTRIC\u2019s Beyond X SCADA system provides seamless data interface from field devices to power SCADA operation systems through integrated engineering of key unit systems (DPR, DPM, UPS, BATTERY, GEN, etc.) for reliable power supply.",
};

export const hvdcOverview = {
  image: hvdcImg("overview_hero.jpg"),
  imageAlt: "SCADA control room monitoring systems",
  title:
    "Beyond Monitoring: Driving Grid\nResiliency through Intelligent Automation.",
  description:
    "GridSol Care SCADA delivers real-time power data analysis and operator-centric control for stable, reliable grid operations.\nBy combining advanced monitoring, automation, and rapid response capabilities,\nit enhances power system reliability and operational efficiency.",
};

export const hvdcBenefitsSection = {
  title: "Key Features",
  items: [
    {
      id: "benefit-1",
      title: "Scalable Platform-Based Architecture",
      bullets: [
        "Platform-based system architecture supports flexible expansion and system configuration.",
      ],
    },
    {
      id: "benefit-2",
      title: "Reliable System Operation and Data Processing",
      bullets: [
        "Reliable server operation, database updates, and stable high-performance data processing support dependable system operation.",
      ],
    },
    {
      id: "benefit-3",
      title: "Enhanced Monitoring and Operational Convenience",
      bullets: [
        "Trend history, reporting functions, multiple communication protocols, external system interfaces, and specialized functions help improve operator usability.",
      ],
    },
    {
      id: "benefit-4",
      title: "Advanced Power Quality Analysis and Real-Time Control",
      bullets: [
        "Real-time power quality monitoring and event analysis enable rapid response to disturbances, improving grid stability and reducing recovery time.",
      ],
    },
  ] satisfies DevicesProductFeatureListItem[],
};

export type HvdcApplication = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export const hvdcApplicationsSection = {
  title: "Main Applied Area",
  description: "",
  items: [
    {
      id: "app-1",
      title: "ECMS",
      subtitle: "(Electrical Equipment Control Monitoring System)",
      description:
        "ECMS is designed for power plants to support the operation, management, monitoring, and control of power generation equipment.",
      image: hvdcImg("application_ecms.jpg"),
    },
    {
      id: "app-2",
      title: "PQMS",
      subtitle: "(Power Quality Management System)",
      description:
        "PQMS collects and analyzes power quality data in\nreal time to help identify key causes of power quality degradation.",
      image: hvdcImg("application_pqms.jpg"),
    },
    {
      id: "app-3",
      title: "SAS",
      subtitle: "(Substation Automation System)",
      description:
        "SAS provides a digital substation automation solution for unmanned operation at individual substations.",
      image: hvdcImg("application_sas.jpg"),
    },
  ] satisfies HvdcApplication[],
};

export type HvdcWhyBlock = {
  id: string;
  title: string;
  lead?: string;
  layout?: "default" | "split";
  cards: { title: string; description: string; image: string }[];
};

export const hvdcWhySection = {
  title: "Highlights & Capabilities",
  blocks: [
    {
      id: "why-pq",
      title: "Enhanced PQ analysis function",
      lead: "By real-time monitoring of the substation/substation power system, when a grid accident or power quality event occurs, event information is transmitted in real time and additional information is provided.\nWe provide services for stable facility operation by accurately recognizing the abnormal state of the system.",
      cards: [
        {
          title: "PQ waveform data analysis",
          description:
            "Supports PQ instantaneous value waveform analysis and harmonic, phase angle, RMS analysis function (Two cursor analysis function is provided)",
          image: hvdcImg("why_pq_01.jpg"),
        },
        {
          title: "PQ data analysis",
          description: "Provides easy data extraction of analysis results",
          image: hvdcImg("why_pq_02.jpg"),
        },
        {
          title: "Trend analysis of PQ event occurrence",
          description:
            "Provides event occurrence trend by time (specific time period, daily event, daily event occurrence)",
          image: hvdcImg("why_pq_03.jpg"),
        },
        {
          title: "Standard curve analysis (CBEMA, ITIC, SEMI)",
          description:
            "Provides CBEMA, ITIC, SEMI standard curve analysis function according to power quality standards",
          image: hvdcImg("why_pq_04.jpg"),
        },
      ],
    },
    {
      id: "why-psdr",
      title: "PSDR function",
      cards: [
        {
          title: "Historical data",
          description:
            "The PSDR function saves all analog and digital data every 2 seconds and manages them as files,and the user can select a file at a specific point in time. Provides a function to replay historical data for that time",
          image: hvdcImg("why_psdr_01.jpg"),
        },
        {
          title: "Create database",
          description:
            "It provides PSDR viewport and PSDR database creation functions independently of the real-time operating system",
          image: hvdcImg("why_psdr_02.jpg"),
        },
      ],
    },
  ] satisfies HvdcWhyBlock[],
};


export const hvdcDownloads: ProductDownloadItem[] = [
  {
    id: "hvdc-dl-1",
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
    id: "hvdc-dl-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
  },
  {
    id: "hvdc-dl-3",
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

const HVDC_OTHER_PRODUCT_SUBTITLE = "Metasol Contactor & Overload Relay";

export const hvdcOtherProductsTitle = "Relavant Products";

export const hvdcOtherProducts: ProductOtherItem[] = [
  {
    id: "hvdc-op-1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Metasol MS",
    subtitle: HVDC_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "hvdc-op-2",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/other/product_other_mcb.png",
    title: "Miniature circuit breaker",
    subtitle: HVDC_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "hvdc-op-3",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_mms.png",
    title: "Metasol MMS",
    subtitle: HVDC_OTHER_PRODUCT_SUBTITLE,
    badges: 2,
  },
  {
    id: "hvdc-op-4",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/img/devices-systems/products/other/product_other_susol_ul_mccb.png",
    title: "Susol UL MCCB",
    subtitle: HVDC_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "hvdc-op-5",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Magnetic Contactor",
    subtitle: HVDC_OTHER_PRODUCT_SUBTITLE,
  },
  {
    id: "hvdc-op-6",
    href: "",
    image: "/img/devices-systems/products/other/product_other_metasol_ms.png",
    title: "Overload Relay",
    subtitle: HVDC_OTHER_PRODUCT_SUBTITLE,
  },
];

export const hvdcFaqItems = [
  {
    question: "What is SCADA and what role does it play in power grid management?",
    answer:
      "SCADA (Supervisory Control and Data Acquisition) monitors and controls electrical infrastructure in real time. LS ELECTRIC SCADA centralizes substation data, operator control, and analytics to improve grid visibility and response.",
  },
  {
    question: "How does server and network redundancy ensure continuous operation?",
    answer:
      "Redundant servers, front-end processors (FEP), and network paths allow 24/7/365 operation. If one component fails, the backup maintains data acquisition and control without interrupting critical monitoring.",
  },
  {
    question: "Which communication protocols are supported for integration?",
    answer:
      "The system supports IEC 61850, DNP 3.0, Modbus, and RESTful API, enabling integration with existing utility systems, protection relays, and third-party applications.",
  },
];

export const hvdcNavItems: readonly ProductNavItem[] = [
  { id: "product-overview", label: "Overview" },
  { id: "product-benefits", label: "Key Features" },
  { id: "product-applications", label: "Applications" },
  { id: "product-why", label: "Why" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-other", label: "Relavant Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
];

export const hvSystemIntro = {
  parentLabel: "Products & Systems",
  parentHref: "/products-systems/motor-control",
  title: "Software",
  description: hvdcHero.description,
};

export const hvSystemProducts = [
  {
    id: "hv-1",
    href: "/products-systems/software/scada",
    image: hvdcImg("overview_hero.jpg"),
    title: "SCADA",
    description: hvdcHero.description,
  },
];
