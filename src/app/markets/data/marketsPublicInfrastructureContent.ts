import {
  type BenefitItem,
  type IndustryTab,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";
import type { MarketStatItem } from "./marketsDataCenterContent";

export const publicInfrastructureHero = {
  subtitle:
    "Powering resilient, efficient, and future-ready infrastructure for communities and essential public services.",
  title: "Public Infrastructure",
  heroImage: "/img/markets/public-infrastructure/hero/hero.webp",
};

export const publicInfrastructureIntro = {
  titleLines: ["Reliable Power for", "Critical Infrastructure"],
  text: "Public infrastructure is the vital foundation of modern society, requiring uncompromising power reliability, intelligent automation, and resilient operational systems. As cities continue to modernize, infrastructure operators face increasing pressure to improve energy efficiency, ensure operational continuity, and embrace digital transformation. LS ELECTRIC provides a comprehensive portfolio of low- and medium-voltage power distribution systems, including our industry-leading Susol series circuit breakers, advanced Power Transformers (up to 550kV/800MVA), and the GridSol CARE digital management platform. From government facilities and global transportation hubs to critical water treatment plants and mission-critical healthcare institutions, our integrated solutions are engineered to enhance operational stability and optimize energy usage. By converging advanced electrical technologies with smart ICT-based automation, LS ELECTRIC empowers operators to build safer, smarter, and more sustainable environments for the communities they serve.",
};

export const publicInfrastructureStats: MarketStatItem[] = [
  {
    id: "pi-continuity",
    label: "Continuity",
    value: "Maximum Availability",
    sublabel: "",
    description:
      "High-availability control and intelligent energy management ensure uninterrupted operation of mission-critical infrastructure.",
  },
  {
    id: "pi-efficiency",
    label: "Efficiency",
    value: "Operational Intelligence",
    sublabel: "",
    description:
      "Real-time monitoring, automated control, and data-driven optimization improve operational efficiency and decision-making.",
  },
  {
    id: "pi-sustainability",
    label: "Sustainability",
    value: "Resilience & Scalability",
    sublabel: "",
    description:
      "Flexible, scalable solutions support reliable infrastructure operation while enabling future expansion and smart grid integration.",
  },
];

export const publicInfrastructureIndustryTabs: IndustryTab[] = [
  {
    id: "government",
    label: "Federal, State, and Municipal Government",
    title: "Federal, State, and Municipal Government",
    description:
      "LS ELECTRIC offers robust power distribution and energy management solutions tailored for government administrative facilities and civic infrastructure. Our integrated systems, featuring UL-listed switchgear and intelligent protection relays, support facility modernization and provide enhanced energy visibility. By utilizing our IoT-enabled monitoring platforms, government entities can optimize operational efficiency and meet strict sustainability mandates with scalable, future-ready electrical architectures",
    image: "/img/markets/public-infrastructure/explore/img_government.webp",
  },
  {
    id: "airports",
    label: "Airports",
    title: "Airports",
    description:
      "Modern aviation hubs require 24/7 reliability across terminals, runway systems, and baggage handling. LS ELECTRIC is a proven leader in airport power modernization, exemplified by our recent project to implement Substation Automation (SA) at Incheon International Airport. This project involves upgrading 154kV GIS (Gas Insulated Switchgear) and integrating IED-based control systems under the IEC 61850 international standard, enabling complete automation of monitoring, measurement, and control.\n\nOur comprehensive airport solutions—from design and manufacturing to SCADA system installation—ensure real-time power management and a seamless, uninterruptible power supply. By combining high-performance automation with proven field experience, LS ELECTRIC helps global airports reduce operational costs, enhance system transparency, and proactively respond to the growing energy demands of the aviation industry.",
    image: "/img/markets/public-infrastructure/explore/img_airports.webp",
  },
  {
    id: "water",
    label: "Water and Wastewater",
    title: "Water and Wastewater",
    description:
      "Water treatment and pumping stations demand stable process control and high-durability motor management. LS ELECTRIC provides specialized electrical and automation solutions, such as high-efficiency VFDs and PLC-based control systems, that optimize flow rates while reducing energy consumption. Our integrated approach supports the modernization of aging water infrastructure, enabling predictive maintenance and ensuring consistent regulatory performance for municipal utilities.",
    image: "/img/markets/public-infrastructure/explore/img_water.webp",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    title: "Healthcare",
    description:
      "In healthcare, power continuity is a matter of life and death. LS ELECTRIC delivers redundant power distribution and backup power integration designed for hospitals, laboratories, and medical campuses. Featuring intelligent circuit protection like the Susol Smart MCCB with LSIG relay functions, our solutions ensure uninterrupted operation of mission-critical life-support systems. We help healthcare operators maintain safe, resilient, and energy-optimized environments for patient care.",
    image: "/img/markets/public-infrastructure/explore/img_healthcare.webp",
  },
];

export const publicInfrastructureReferences: ReferenceItem[] = [
  {
    id: "pi-ref-1",
    href: "",
    image: "/img/markets/public-infrastructure/references/ref_01.webp",
    title: "Large-scale HVAC control for Incheon International Airport",
    description:
      "LS ELECTRIC supplied HVAC control solutions for Incheon International Airport, one of the world's busiest aviation hubs, helping ensure stable and energy-efficient operation of large-scale heating, ventilation, and air conditioning systems. Designed for continuous 24/7 operation, the solution supports reliable climate control across airport terminals while improving energy efficiency and operational stability.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "Large-scale HVAC control for Incheon International Airport",
      images: ["/img/markets/public-infrastructure/references/ref_01.webp"],
      overview: [
        "LS ELECTRIC supplied HVAC control solutions for Incheon International Airport, one of the world's busiest aviation hubs, helping ensure stable and energy-efficient operation of large-scale heating, ventilation, and air conditioning systems. Designed for continuous 24/7 operation, the solution supports reliable climate control across airport terminals while improving energy efficiency and operational stability.\n\n- Continuous operation for mission-critical airport facilities\n- Optimized energy consumption through variable-speed control\n- Stable indoor climate for passenger terminals\n- Reduced maintenance through intelligent drive control\n- Reliable operation of large-scale HVAC equipment",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        {
          label: "Application",
          lines: [
            "Fan & Pump Control",
            "HVAC Control System",
            "BACnet-based Building Communication",
            "Energy-efficient Motor Control",
          ],
        },
        {
          label: "Scope of Work",
          value: "Fan & Pump Drive (VFD), Motor Control, Industrial Networks",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pi-ref-2",
    href: "",
    image: "/img/markets/public-infrastructure/references/ref_02.webp",
    title: "K-water Metropolitan Water Management System",
    description:
      "LS ELECTRIC delivered an integrated monitoring and control system for K-water's metropolitan water supply network, one of Korea's largest public water infrastructure projects. The solution centralizes the operation of multiple intake facilities, water treatment plants, pumping stations, and transmission pipelines into a single operation center, enabling real-time monitoring, remote control, and stable water supply management across the metropolitan region.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "K-water Metropolitan Water Management System",
      images: ["/img/markets/public-infrastructure/references/ref_02.webp"],
      overview: [
        "LS ELECTRIC delivered an integrated monitoring and control system for K-water's metropolitan water supply network, one of Korea's largest public water infrastructure projects. The solution centralizes the operation of multiple intake facilities, water treatment plants, pumping stations, and transmission pipelines into a single operation center, enabling real-time monitoring, remote control, and stable water supply management across the metropolitan region.\n\nDesigned for mission-critical infrastructure, the system incorporates redundant control architecture and industrial communication networks to ensure continuous operation while improving operational efficiency and response to system events.\n\n- Centralized management of geographically distributed water facilities\n- Reliable 24/7 operation through redundant control architecture\n- Real-time visibility across the entire water supply network\n- Faster response to abnormal operating conditions\n- Improved operational efficiency through remote monitoring and control\n- Stable water supply for millions of residents\n- Scalable architecture supporting future network expansion",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        {
          label: "Application",
          lines: [
            "Centralized Water Management",
            "Redundant Control System",
            "Integrated Monitoring & Control",
            "Asset Monitoring",
            "Alarm & Event Management",
          ],
        },
        {
          label: "Scope of Work",
          value: "PLC, Redundant PLC, SCADA, Industrial Networks, RTUs",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pi-ref-3",
    href: "",
    image: "/img/markets/public-infrastructure/references/ref_03.webp",
    title: "Thailand Railway Signaling System Modernization",
    description:
      "To support the modernization of Thailand's national railway network, LS ELECTRIC delivered advanced railway signaling solutions for multiple phases of the country's railway infrastructure program. The project aimed to improve operational safety, efficiency, and reliability while supporting future railway network expansion.",
    location: "Thailand",
    country: "",
    modal: {
      modalTitle: "Thailand Railway Signaling System Modernization",
      images: ["/img/markets/public-infrastructure/references/ref_03.webp"],
      overview: [
        "To support the modernization of Thailand's national railway network, LS ELECTRIC delivered advanced railway signaling solutions for multiple phases of the country's railway infrastructure program. The project aimed to improve operational safety, efficiency, and reliability while supporting future railway network expansion.\n\nLS ELECTRIC provided engineering, system design, and supervision, along with advanced signaling technologies including Computer-Based Interlocking (CBI), Centralized Traffic Control (CTC), and ETCS Level 1. Through the successful execution of multiple railway projects over two decades, LS ELECTRIC established a strong track record in delivering reliable transportation infrastructure solutions across Thailand.",
      ],
      keyInfo: [
        { label: "Location", value: "Thailand" },
        { label: "Application", value: "Public Railway Infrastructure" },
        {
          label: "Scope of Work",
          value:
            "Engineering & design, Railway signaling system (CBI, CTC, ETCS Level 1), Wayside equipment",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const publicInfrastructureBenefits: BenefitItem[] = [
  {
    id: "pi-b1",
    href: "",
    title: "Operational Reliability & Continuity",
    description:
      "Ensure stable, 24/7 operation of essential public services through high-reliability power distribution and diagnostic technologies.",
    capabilities:
      "Advanced UL-listed switchgear and IED-based Substation Automation (SA) that enables complete automation of power monitoring and control for mission-critical facilities like international airports.",
    image: "/img/markets/public-infrastructure/benefits/benefit_01.webp",
  },
  {
    id: "pi-b2",
    href: "",
    title: "Scalable & Future-Proof Infrastructure",
    description:
      "Support long-term community growth and modernization with flexible, modular electrical systems.",
    capabilities:
      "Open communication protocols (Modbus, Ethernet) and modular hardware design that simplify integration with existing and future infrastructure.",
    image: "/img/markets/public-infrastructure/benefits/benefit_02.webp",
    reverse: true,
  },
  {
    id: "pi-b3",
    href: "",
    title: "Advanced Safety & Regulatory Compliance",
    description:
      "Prioritize public safety and ensure compliance with strict North American industry standards.",
    capabilities:
      "UL-listed Arc-Resistant equipment and intelligent Susol Smart MCCB units that provide precision metering and equipment maintenance diagnostics.",
    image: "/img/markets/public-infrastructure/benefits/benefit_03.webp",
  },
  {
    id: "pi-b4",
    href: "",
    title: "Energy Efficiency & Smart Operations",
    description:
      "Reduce the financial burden on public budgets through data-driven energy optimization and smart management.",
    capabilities:
      "IEC 61850 compliant systems and GridSol CARE cloud-based monitoring that minimize energy waste while lowering operational and maintenance costs through real-time data.",
    image: "/img/markets/public-infrastructure/benefits/benefit_04.webp",
    reverse: true,
  },
];

export const publicInfrastructureWhyItems: WhyItem[] = [
  {
    id: "pi-why-1",
    href: "",
    title: "Critical Service Reliability",
    description:
      "LS ELECTRIC delivers resilient power systems that support the uninterrupted operation of essential facilities such as airports, hospitals, water treatment plants, and government buildings.",
    icon: "/img/markets/public-infrastructure/why/why_01.svg",
  },
  {
    id: "pi-why-2",
    href: "",
    title: "Smart Facility Management",
    description:
      "Integrated monitoring and control technologies help public organizations optimize operations, enhance asset performance, and lower lifecycle costs.",
    icon: "/img/markets/public-infrastructure/why/why_02.svg",
  },
  {
    id: "pi-why-3",
    href: "",
    title: "Sustainable Infrastructure",
    description:
      "Energy-efficient power solutions, renewable integration, and storage technologies help communities meet sustainability goals while preparing for future growth.",
    icon: "/img/markets/public-infrastructure/why/why_03.svg",
  },
];

export const publicInfrastructureProducts: ProductItem[] = [
  {
    id: "pi-p1",
    href: "/product/metasol-ms",
    image: "/img/markets/public-infrastructure/products/product_01.webp",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "pi-p2",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_02.webp",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "pi-p3",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_03.webp",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "pi-p4",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_04.webp",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "pi-p5",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_05.webp",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "pi-p6",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_06.webp",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "pi-p7",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_07.webp",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "pi-p8",
    href: "",
    image: "/img/markets/public-infrastructure/products/product_08.webp",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
