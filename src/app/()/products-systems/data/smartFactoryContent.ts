import type { DevicesProductFeatureListItem } from "@/components/content/DevicesProductFeaturesSection";
import type { HvdcApplication, HvdcWhyBlock } from "./hvdcContent";

const smartFactoryImg = (file: string) => `/img/devices-systems/smart-factory/${file}`;

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
