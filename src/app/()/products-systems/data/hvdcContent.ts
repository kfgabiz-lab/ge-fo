import type { DevicesProductFeatureListItem } from "@/components/content/DevicesProductFeaturesSection";

const hvdcImg = (file: string) => `/img/devices-systems/hvdc/${file}`;

export const hvdcHero = {
  tagline: null,
  title: "SCADA",
  description:
    "LS ELECTRIC\u2019s Beyond X SCADA system provides seamless data interfacing from field devices to power SCADA systems through integrated engineering of key power system components, including DPR, DPM, uninterruptible power supply (UPS), energy storage systems (ESS), generators, and more, supporting reliable power supply.",
};

export const hvdcOverview = {
  image: hvdcImg("overview_hero.webp"),
  imageAlt: "SCADA control room monitoring systems",
  title:
    "Beyond Monitoring: Driving Grid \nResiliency through Intelligent Automation",
  description:
    "Beyond X SCADA provides real-time power data analysis and operator-centric control to support stable and reliable grid operations.\nBy combining advanced monitoring, automation, and rapid response capabilities, the solution enhances power system reliability and operational efficiency.",
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
        "ECMS supports power plants in the operation, management, monitoring, and control of power generation equipment.",
      image: hvdcImg("application_ecms.webp"),
    },
    {
      id: "app-2",
      title: "PQMS",
      subtitle: "(Power Quality Management System)",
      description:
        "PQMS collects and analyzes power quality data in\nreal time to help identify key causes of power quality degradation.",
      image: hvdcImg("application_pqms.webp"),
    },
    {
      id: "app-3",
      title: "SAS",
      subtitle: "(Substation Automation System)",
      description:
        "SAS provides a digital substation automation solution that enables unmanned operation of substations.",
      image: hvdcImg("application_sas.webp"),
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
  title: "Highlights and Capabilities",
  blocks: [
    {
      id: "why-pq",
      title: "Enhanced PQ analysis function",
      lead: "Real-time monitoring of substation power systems enables real-time event transmission and provides critical information when grid faults or power quality issues occur. The system supports stable facility operation by accurately identifying abnormal system conditions.",
      cards: [
        {
          title: "PQ waveform data analysis",
          description:
            "Supports analysis of PQ instantaneous waveforms, harmonics, phase angles, and RMS values, with a two-cursor analysis function.",
          image: hvdcImg("why_pq_01.webp"),
        },
        {
          title: "PQ data analysis",
          description: "Enables easy extraction of analysis results.",
          image: hvdcImg("why_pq_02.webp"),
        },
        {
          title: "Trend analysis of PQ event occurrence",
          description:
            "Provides event occurrence trends by time period, including specific time periods, daily events, and daily event counts.",
          image: hvdcImg("why_pq_03.webp"),
        },
        {
          title: "Standard curve analysis (CBEMA, ITIC, SEMI)",
          description:
            "Supports CBEMA, ITIC, and SEMI standard curve analysis for power quality assessment.",
          image: hvdcImg("why_pq_04.webp"),
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
            "The PSDR function records all analog and digital data every two seconds and stores the data in files. Users can select a file based on a specific time and replay historical data for the selected period.",
          image: hvdcImg("why_psdr_01.webp"),
        },
        {
          title: "Create database",
          description:
            "Provides PSDR viewport and creation functions independently of the real-time operating system.",
          image: hvdcImg("why_psdr_02.webp"),
        },
      ],
    },
  ] satisfies HvdcWhyBlock[],
};

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

export const hvSystemIntro = {
  parentLabel: "Products & Systems",
  title: "Software",
  description: hvdcHero.description,
};

export const hvSystemProducts = [
  {
    id: "hv-1",
    href: "/product/scada",
    image: hvdcImg("overview_hero.webp"),
    title: "SCADA",
    description: hvdcHero.description,
  },
];
