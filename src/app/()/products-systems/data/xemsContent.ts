import type { DevicesProductFeatureDescItem } from "@/components/content/DevicesProductFeaturesSection";
import type { HvdcApplication, HvdcWhyBlock } from "./hvdcContent";

const xemsImg = (file: string) => `/img/devices-systems/xems/${file}`;

export const xemsHero = {
  title: "xEMS",
  description:
    "LS ELECTRIC Beyond X™ xEMS provides energy management solutions for energy generation, storage, and consumption. Through FEMS and BEMS solutions, xEMS supports energy savings, efficient operation, demand management, and alternatives to emergency generator operation.",
};

export const xemsOverview = {
  image: xemsImg("overview_hero.webp"),
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
      image: xemsImg("application_fems.webp"),
    },
    {
      id: "bems",
      title: "BEMS",
      subtitle: "(Building Energy Management System)",
      description:
        "BEMS provides a control and management solution for commercial buildings, supporting efficient building energy operation and management.",
      image: xemsImg("application_bems.webp"),
    },
  ] satisfies HvdcApplication[],
  diagramImage: xemsImg("energy_diagram.svg"),
  diagramAlt: "Beyond X FEMS energy management capability diagram and maturity levels",
  diagramLogo: xemsImg("energy_diagram_logo.svg"),
  diagramCapabilities: [
    "Scaling SCADA systems",
    "Efficiency and reduction",
    "Energy diagnostic analysis",
    "Energy Acquisition Management",
    "Maintenance education",
    "Standard protocol interconnection",
    "Operation / Interface",
    "Equipment / System Management",
  ],
  diagramLevels: [
    {
      id: "level-1",
      label: "Energy Management",
      title: "Level 1",
      description: "Real-time monitoring and history inquiry of hierarchical energy data",
    },
    {
      id: "level-2",
      label: "Energy Management",
      title: "Level 2",
      description:
        "Production information system integration for hierarchical per unit calculation",
    },
    {
      id: "level-3",
      label: "Energy Management",
      title: "Level 3",
      description: "Setting of energy Baseline by site hierarchy",
    },
    {
      id: "level-4",
      label: "Energy Management",
      title: "Level 4",
      description:
        "Energy analysis and efficiency activities, energy data analysis tools, energy analysis consulting services",
    },
    {
      id: "level-5",
      label: "Energy Management",
      title: "Level 5",
      description:
        "Energy goal setting, communication, KPI, EnPI setting, energy management activities",
    },
  ],
};

export const xemsWhySection = {
  title: "Highlights & Capabilities",
  blocks: [
    {
      id: "why-acquisition",
      title: "Energy Information Acquisition / Management",
      lead: "Collects various energy data scattered around buildings/factories in real-time, enabling objectification, quantification, and history inquiry of the data.",
      cards: [
        { title: "", description: "", image: xemsImg("why_acquisition_01.webp") },
        { title: "", description: "", image: xemsImg("why_acquisition_02.webp") },
      ],
    },
    {
      id: "why-diagnosis",
      title: "Energy Diagnosis / Analysis",
      lead: "Diagnoses and analyzes energy data collected in various ways, using various analysis tools to analyze energy usage information.",
      cards: [
        { title: "", description: "", image: xemsImg("why_diagnosis_01.webp") },
        { title: "", description: "", image: xemsImg("why_diagnosis_02.webp") },
      ],
    },
    {
      id: "why-efficiency",
      title: "Energy Efficiency & Saving",
      lead: "Sets a baseline using analyzed data on energy usage and conducts efficiency activities to find and manage energy reduction items objectively.",
      cards: [
        { title: "", description: "", image: xemsImg("why_efficiency_01.webp") },
        { title: "", description: "", image: xemsImg("why_efficiency_02.webp") },
      ],
    },
    {
      id: "why-pq",
      title: "Power Quality Monitoring / Analysis",
      lead: "Utilizes the platform of Power SCADA to apply key functions of existing SCADA to the FEMS Web solution, and includes proprietary communication protocols such as DNP 3.0, IEC61850, and standard communication protocols like MODBUS TCP.",
      cards: [
        { title: "", description: "", image: xemsImg("why_pq_01.webp") },
        { title: "", description: "", image: xemsImg("why_pq_02.webp") },
      ],
    },
  ] satisfies HvdcWhyBlock[],
};

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
