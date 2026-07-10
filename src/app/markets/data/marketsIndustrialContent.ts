import type { MarketStatItem } from "./marketsDataCenterContent";
import {
  marketsBenefitImages,
  type BenefitItem,
  type IndustryTab,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";

export const industrialHero = {
  subtitle: "Smart, Efficient & Sustainable Industrial Operations",
  title: "Industrial",
  heroImage: "/img/markets/industrial/hero/hero.jpg",
};

export const industrialIntro = {
  titleLines: ["Powering Smart &", "Efficient Industrial Innovation"],
  paragraphs: [
    "LS ELECTRIC empowers industrial sectors—including Automotive, Semiconductor, Machinery, and Food & Beverage—with advanced automation and power solutions. From PLCs and drives to smart factory systems, we deliver precision, efficiency, and reliability.",
    "Our data-driven technologies optimize productivity, reduce downtime, and support sustainable, high-performance operations.",
  ],
};

export const industrialStats: MarketStatItem[] = [
  {
    id: "ind-production",
    label: "Production control",
    value: "High-Speed & Precise",
    sublabel: "",
    description:
      "Optimized automation for fast and accurate production control.",
  },
  {
    id: "ind-energy",
    label: "Process stability​",
    value: "Stable&\nContinuous​​",
    sublabel: "",
    description:
      "Reliable operation with minimized downtime and enhanced process stability.",
  },
  {
    id: "ind-diagnosis",
    label: "Diagnosis and monitoring",
    value: "Smart & Efficient",
    sublabel: "",
    description:
      "Predictive diagnostics and integrated monitoring for optimized maintenance.",
  },
];

export const industrialIndustryTabs: IndustryTab[] = [
  {
    id: "automotive",
    label: "Automotive",
    title: "Automotive",
    description:
      "LS ELECTRIC's automotive solution delivers a highly reliable and efficient production environment by leveraging a redundant RAPInet-based network for fast and stable communication, along with rapid fault response through advanced diagnostic features. Its OPC UA-based integrated architecture enables seamless scalability from field-level devices to MES, while supporting various industrial protocols for enhanced flexibility and compatibility. In addition, predictive maintenance functions enable proactive equipment management and reduced downtime. Combined with durable HMI and long-lifespan drive technologies, it maximizes operational reliability, convenience, and overall efficiency across the entire automotive production process.",
    image: "/img/markets/industrial/explore/img_automotive.jpg",
  },
  {
    id: "semiconductor",
    label: "Semiconductor",
    title: "Semiconductor",
    description:
      "LS ELECTRIC's semiconductor solutions deliver high precision, stable power quality, and reliable operation for sensitive manufacturing environments. Advanced PLCs and drives enable accurate, high-speed control, while integrated monitoring and energy management ensure real-time visibility, optimized efficiency, and reduced downtime. Built on a scalable and robust network architecture, the solution enhances productivity and ensures consistent process quality.",
    image: "/img/markets/industrial/explore/img_semiconductor.jpg",
  },
  {
    id: "machinery",
    label: "Machinery",
    title: "Machinery",
    description:
      "LS ELECTRIC's Machinery solutions focus on delivering high-performance, precise, and flexible control for a wide range of industrial equipment. With advanced PLCs, motion control, and high-efficiency drives, they enable accurate positioning, high-speed operation, and synchronized control across complex machinery systems. The solutions support diverse industrial communication protocols, ensuring seamless integration with existing equipment and systems. In addition, intuitive HMI and integrated software tools enhance usability, reduce engineering time, and simplify maintenance. Overall, LS ELECTRIC provides a reliable and scalable automation platform that improves productivity, ensures consistent quality, and optimizes machine performance.",
    image: "/img/markets/industrial/explore/img_machinery.jpg",
  },
  {
    id: "food-beverage",
    label: "Food & Beverage",
    title: "Food & Beverage",
    description:
      "LS ELECTRIC's Food & Beverage solutions are designed to ensure hygiene, consistency, and efficiency across the entire production process. They provide precise control of mixing, filling, and packaging through advanced PLCs and drives, while maintaining stable operations even in demanding environments. With integrated monitoring and traceability capabilities, the solutions support strict quality control and regulatory compliance. In addition, energy-efficient drives and smart automation help reduce operating costs and improve productivity, enabling manufacturers to achieve reliable, high-quality production at scale.",
    image: "/img/markets/industrial/explore/img_food_beverage.jpg",
  },
];

export const industrialReferences: ReferenceItem[] = [
  {
    id: "ind-ref-1",
    href: "",
    image: "/img/markets/industrial/references/ref_01.jpg",
    title: "Automotive Assembly Line Automation",
    description:
      "LS ELECTRIC implemented an integrated automation solution for a major automotive assembly line, combining PLCs, drives, and RAPInet-based networking to improve production speed, reliability, and real-time diagnostics across the facility.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "Automotive Assembly Line Automation",
      images: ["/img/markets/industrial/references/ref_01.jpg"],
      overview: [
        "LS ELECTRIC implemented an integrated automation solution for a major automotive assembly line, combining PLCs, drives, and RAPInet-based networking to improve production speed, reliability, and real-time diagnostics across the facility.",
        "The project integrated field devices, control systems, and MES connectivity through an OPC UA-based architecture, enabling seamless data flow from shop floor to management systems.",
        "Predictive maintenance and advanced diagnostic features helped reduce unplanned downtime and improve overall equipment effectiveness across the production process.",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        { label: "Application", value: "Automotive Manufacturing" },
        {
          label: "Scope of Work",
          value: "PLC, drives, industrial networking, and MES integration",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ind-ref-2",
    href: "",
    image: "/img/markets/industrial/references/ref_02.jpg",
    title: "Smart Factory Platform Deployment",
    description:
      "A leading manufacturer deployed LS ELECTRIC's smart factory platform to connect production equipment, enable real-time monitoring, and optimize energy usage across multiple production lines.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "Smart Factory Platform Deployment",
      images: ["/img/markets/industrial/references/ref_02.jpg"],
      overview: [
        "A leading manufacturer deployed LS ELECTRIC's smart factory platform to connect production equipment, enable real-time monitoring, and optimize energy usage across multiple production lines.",
        "Edge computing and data analytics capabilities provided operators with actionable insights for production optimization and proactive maintenance planning.",
        "The solution improved operational visibility, reduced energy consumption, and supported scalable expansion for future manufacturing requirements.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "Smart Factory" },
        {
          label: "Scope of Work",
          value: "Edge Hub, data analytics, and production monitoring platform",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ind-ref-3",
    href: "",
    image: "/img/markets/industrial/references/ref_03.jpg",
    title: "Semiconductor Fab Power & Control Upgrade",
    description:
      "LS ELECTRIC supplied power distribution and automation systems for a semiconductor fabrication facility upgrade, ensuring stable process control and high-reliability operation in a demanding cleanroom environment.",
    location: "Taiwan",
    country: "",
    modal: {
      modalTitle: "Semiconductor Fab Power & Control Upgrade",
      images: ["/img/markets/industrial/references/ref_03.jpg"],
      overview: [
        "LS ELECTRIC supplied power distribution and automation systems for a semiconductor fabrication facility upgrade, ensuring stable process control and high-reliability operation in a demanding cleanroom environment.",
        "Integrated motion control, PLC systems, and industrial networking supported precise equipment coordination across critical production processes.",
        "The upgrade enhanced system stability, reduced maintenance intervals, and improved overall fab productivity.",
      ],
      keyInfo: [
        { label: "Location", value: "Taiwan" },
        { label: "Application", value: "Semiconductor Manufacturing" },
        {
          label: "Scope of Work",
          value: "Power distribution, PLC, and motion control systems",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const industrialBenefits: BenefitItem[] = [
  {
    id: "ind-b1",
    href: "",
    title: "Enhanced Productivity",
    description:
      "High-performance PLCs, drives, and automation systems enable faster, more precise operations, improving overall production efficiency.",
    capabilities:
      "Optimizing production performance through high-speed PLCs, precision drives, and integrated automation systems, enabling faster cycle times and synchronized operations",
    image: marketsBenefitImages.benefit05,
  },
  {
    id: "ind-b2",
    href: "",
    title: "Maximized Reliability<br>& Uptime",
    description:
      "Robust power and control solutions ensure stable operations, minimizing downtime and supporting continuous production.",
    capabilities:
      "Stable and continuous operations with robust power distribution, protection systems, and condition monitoring for proactive fault prevention",
    image: marketsBenefitImages.benefit06,
    reverse: true,
  },
  {
    id: "ind-b3",
    href: "",
    title: "Energy Efficiency<br>& Cost Reduction",
    description:
      "Advanced energy management and optimized system control help reduce energy consumption and operational costs.",
    capabilities:
      "Reduced energy consumption and operational costs by implementing high-efficiency drives, energy monitoring systems, and optimized power management",
    image: marketsBenefitImages.benefit09,
  },
  {
    id: "ind-b4",
    href: "",
    title: "Smart & Scalable<br>Integration",
    description:
      "Seamless integration with smart factory and digital platforms enables data-driven decision-making and flexible system expansion.",
    capabilities:
      "Data-driven operations and future-ready expansion through smart factory solutions, seamless system integration, and scalable digital platforms",
    image: marketsBenefitImages.benefit10,
    reverse: true,
  },
];

export const industrialWhyItems: WhyItem[] = [
  {
    id: "ind-why-1",
    href: "",
    title: "Technological Innovation",
    description:
      "High-performance PLCs, AC drives, servo systems, smart factory platforms, and industrial networking solutions",
    icon: "/img/markets/img_why_01.svg",
  },
  {
    id: "ind-why-2",
    href: "",
    title: "Operational Optimization",
    description:
      "Optimized production performance, reduced downtime, and improved energy efficiency across manufacturing operations",
    icon: "/img/markets/img_why_02.svg",
  },
  {
    id: "ind-why-3",
    href: "",
    title: "Proven Reliability",
    description:
      "Highly reliable automation and power solutions tailored to the demanding requirements of industrial production environments",
    icon: "/img/markets/img_why_03.svg",
  },
];

export const industrialProducts: ProductItem[] = [
  {
    id: "ind-p1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/markets/industrial/products/product_01.jpg",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "ind-p2",
    href: "",
    image: "/img/markets/industrial/products/product_02.jpg",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "ind-p3",
    href: "",
    image: "/img/markets/industrial/products/product_03.jpg",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "ind-p4",
    href: "",
    image: "/img/markets/industrial/products/product_04.jpg",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "ind-p5",
    href: "",
    image: "/img/markets/industrial/products/product_05.jpg",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "ind-p6",
    href: "",
    image: "/img/markets/industrial/products/product_06.jpg",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "ind-p7",
    href: "",
    image: "/img/markets/industrial/products/product_07.jpg",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "ind-p8",
    href: "",
    image: "/img/markets/industrial/products/product_08.jpg",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
