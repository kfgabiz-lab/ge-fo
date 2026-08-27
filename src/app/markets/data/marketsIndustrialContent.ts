import type { MarketStatItem } from "./marketsDataCenterContent";
import {
  type BenefitItem,
  type IndustryTab,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";

export const industrialHero = {
  subtitle: "Smart, Efficient & Sustainable Industrial Operations",
  title: "Industrial",
  heroImage: "/img/markets/industrial/hero/hero.webp",
  secondaryCta: {
    label: "Get the Whitepaper",
    href: "/docs/Industrial.pdf",
    icon: "download" as const,
  },
};

export const industrialIntro = {
  titleLines: ["Powering Smart &", "Efficient Industrial Innovation"],
  paragraphs: [
    "LS ELECTRIC empowers industrial sectors—including Automotive, Semiconductor, Machinery, and Food & Beverage—with advanced automation and power solutions. From PLCs and drives to smart factory systems, we deliver precision, efficiency, and reliability. Our data-driven technologies optimize productivity, reduce downtime, and support sustainable, high-performance operations.",
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
    label: "Process stability",
    value: "Stable &\nContinuous",
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
    image: "/img/markets/industrial/explore/img_automotive.webp",
  },
  {
    id: "semiconductor",
    label: "Semiconductor",
    title: "Semiconductor",
    description:
      "LS ELECTRIC's semiconductor solutions deliver high precision, stable power quality, and reliable operation for sensitive manufacturing environments. Advanced PLCs and drives enable accurate, high-speed control, while integrated monitoring and energy management ensure real-time visibility, optimized efficiency, and reduced downtime. Built on a scalable and robust network architecture, the solution enhances productivity and ensures consistent process quality.",
    image: "/img/markets/industrial/explore/img_semiconductor.webp",
  },
  {
    id: "machinery",
    label: "Machinery",
    title: "Machinery",
    description:
      "LS ELECTRIC's Machinery solutions focus on delivering high-performance, precise, and flexible control for a wide range of industrial equipment. With advanced PLCs, motion control, and high-efficiency drives, they enable accurate positioning, high-speed operation, and synchronized control across complex machinery systems. The solutions support diverse industrial communication protocols, ensuring seamless integration with existing equipment and systems. In addition, intuitive HMI and integrated software tools enhance usability, reduce engineering time, and simplify maintenance. Overall, LS ELECTRIC provides a reliable and scalable automation platform that improves productivity, ensures consistent quality, and optimizes machine performance.",
    image: "/img/markets/industrial/explore/img_machinery.webp",
  },
  {
    id: "food-beverage",
    label: "Food & Beverage",
    title: "Food & Beverage",
    description:
      "LS ELECTRIC's Food & Beverage solutions are designed to ensure hygiene, consistency, and efficiency across the entire production process. They provide precise control of mixing, filling, and packaging through advanced PLCs and drives, while maintaining stable operations even in demanding environments. With integrated monitoring and traceability capabilities, the solutions support strict quality control and regulatory compliance. In addition, energy-efficient drives and smart automation help reduce operating costs and improve productivity, enabling manufacturers to achieve reliable, high-quality production at scale.",
    image: "/img/markets/industrial/explore/img_food_beverage.webp",
  },
];

export const industrialReferences: ReferenceItem[] = [
  {
    id: "ind-ref-1",
    href: "",
    image: "/img/markets/industrial/references/ref_01.webp",
    title: "Automation Solutions for Hyundai Motor's EV Dedicated Plant",
    description:
      "Hyundai Motor is developing its first new manufacturing plant in Ulsan in more than three decades, designed exclusively for next-generation electric vehicles. The facility incorporates advanced smart factory technologies to enhance manufacturing efficiency, product quality, and production flexibility.",
    location: "Ulsan, South Korea",
    country: "",
    modal: {
      modalTitle: "Automation Solutions for Hyundai Motor's EV Dedicated Plant",
      images: ["/img/markets/industrial/references/ref_01.webp"],
      overview: [
        "Hyundai Motor is developing its first new manufacturing plant in Ulsan in more than three decades, designed exclusively for next-generation electric vehicles. The facility incorporates advanced smart factory technologies to enhance manufacturing efficiency, product quality, and production flexibility.\n\nAs a key automation partner, LS ELECTRIC supplied an integrated automation platform encompassing PLCs, Safety PLCs, HMIs, Servo Systems, AC Drives, and industrial networking technologies. These solutions enable centralized machine control, functional safety, high-speed motion control, and seamless communication across production equipment, supporting a highly automated and reliable EV manufacturing environment.",
      ],
      keyInfo: [
        { label: "Location", value: "Ulsan, South Korea" },
        {
          label: "Application",
          lines: [
            "Body Shop automation",
            "Assembly Shop automation",
            "Material handling systems",
            "Automated production equipment control",
          ],
        },
        {
          label: "Scope of Work",
          value: "PLC, Servo & Motion Systems, VFDs, HMIs, Industrial Networks",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ind-ref-2",
    href: "",
    image: "/img/markets/industrial/references/ref_02.webp",
    title: "Gwangju Global Motors (GGM) Smart Manufacturing Automation",
    description:
      "LS ELECTRIC delivered a full suite of automation solutions for Gwangju Global Motors (GGM). The project integrated PLCs, HMIs, servo systems, AC drives, and the company's proprietary RAPIEnet industrial Ethernet across the body, paint, and assembly lines, establishing a benchmark for high-performance automotive manufacturing automation.",
    location: "Gwangju, South Korea",
    country: "",
    modal: {
      modalTitle: "Gwangju Global Motors (GGM) Smart Manufacturing Automation",
      images: ["/img/markets/industrial/references/ref_02.webp"],
      overview: [
        "LS ELECTRIC delivered a full suite of automation solutions for Gwangju Global Motors (GGM). The project integrated PLCs, HMIs, servo systems, AC drives, and the company's proprietary RAPIEnet industrial Ethernet across the body, paint, and assembly lines, establishing a benchmark for high-performance automotive manufacturing automation.\n\n- End-to-end automation across body, paint, and assembly lines\n- High-speed, deterministic industrial communication with RAPIEnet\n- Stable and reliable production line operation\n- Seamless integration of PLC, HMI, Servo, and Drives\n- Increased productivity and operational efficiency\n- Reduced dependence on proprietary overseas automation platforms",
      ],
      keyInfo: [
        { label: "Location", value: "Gwangju, South Korea" },
        {
          label: "Application",
          lines: [
            "Automotive Production Line Automation",
            "Body, Paint & Assembly Line Control",
            "Material Handling & Conveyor Systems",
            "Industrial Motion Control",
            "Factory-wide Equipment Automation",
          ],
        },
        {
          label: "Scope of Work",
          value:
            "PLC, HMI, Servo & Motion, AC Drives, Industrial Ethernet (RAPIEnet)",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ind-ref-3",
    href: "",
    image: "/img/markets/industrial/references/ref_03.webp",
    title: "1st Battery Cell Manufacturing Facility",
    description:
      "LS ELECTRIC supported the development of one of North America's largest EV battery cell manufacturing facilities by delivering a comprehensive power distribution solution for a high-capacity production plant. The project required reliable electrical infrastructure to ensure stable operation of mission-critical battery manufacturing processes.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "1st Battery Cell Manufacturing Facility",
      images: ["/img/markets/industrial/references/ref_03.webp"],
      overview: [
        "LS ELECTRIC supported the development of one of North America's largest EV battery cell manufacturing facilities by delivering a comprehensive power distribution solution for a high-capacity production plant. The project required reliable electrical infrastructure to ensure stable operation of mission-critical battery manufacturing processes.\n\nLS ELECTRIC supplied key power equipment, including high-voltage power transformers, medium-voltage switchgear, medium-voltage transformers, and panelboards. Leveraging proven expertise in industrial power systems, the project reinforced LS ELECTRIC's capabilities in delivering reliable power infrastructure for large-scale battery manufacturing facilities in the U.S.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "EV Battery Manufacturing Facility" },
        {
          label: "Scope of Work",
          value:
            "HV power transformers, MV switchgear, MV transformers, and panel boards",
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
    image: "/img/markets/industrial/benefits/benefit_01.webp",
  },
  {
    id: "ind-b2",
    href: "",
    title: "Maximized Reliability<br>& Uptime",
    description:
      "Robust power and control solutions ensure stable operations, minimizing downtime and supporting continuous production.",
    capabilities:
      "Stable and continuous operations with robust power distribution, protection systems, and condition monitoring for proactive fault prevention",
    image: "/img/markets/industrial/benefits/benefit_02.webp",
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
    image: "/img/markets/industrial/benefits/benefit_03.webp",
  },
  {
    id: "ind-b4",
    href: "",
    title: "Smart & Scalable<br>Integration",
    description:
      "Seamless integration with smart factory and digital platforms enables data-driven decision-making and flexible system expansion.",
    capabilities:
      "Data-driven operations and future-ready expansion through smart factory solutions, seamless system integration, and scalable digital platforms",
    image: "/img/markets/industrial/benefits/benefit_04.webp",
    reverse: true,
  },
];

export const industrialWhyItems: WhyItem[] = [
  {
    id: "ind-why-1",
    href: "",
    title: "Factory Automation Excellence",
    description:
      "LS ELECTRIC offers a comprehensive automation portfolio that enables manufacturers to streamline operations and improve process consistency across the production floor.",
    icon: "/img/markets/industrial/why/why_01.svg",
  },
  {
    id: "ind-why-2",
    href: "",
    title: "Productivity Optimization",
    description:
      "Advanced control, monitoring, and drive technologies help maximize equipment performance, increase throughput, and reduce operational downtime.",
    icon: "/img/markets/industrial/why/why_02.svg",
  },
  {
    id: "ind-why-3",
    href: "",
    title: "Smart Factory Innovation",
    description:
      "Digitalization, connected technologies, and data-driven insights empower manufacturers to accelerate their Industry 4.0 transformation initiatives.",
    icon: "/img/markets/industrial/why/why_03.svg",
  },
];

export const industrialProducts: ProductItem[] = [
  {
    id: "ind-p1",
    href: "/product/metasol-ms",
    image: "/img/markets/industrial/products/product_01.webp",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "ind-p2",
    href: "",
    image: "/img/markets/industrial/products/product_02.webp",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "ind-p3",
    href: "",
    image: "/img/markets/industrial/products/product_03.webp",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "ind-p4",
    href: "",
    image: "/img/markets/industrial/products/product_04.webp",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "ind-p5",
    href: "",
    image: "/img/markets/industrial/products/product_05.webp",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "ind-p6",
    href: "",
    image: "/img/markets/industrial/products/product_06.webp",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "ind-p7",
    href: "",
    image: "/img/markets/industrial/products/product_07.webp",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "ind-p8",
    href: "",
    image: "/img/markets/industrial/products/product_08.webp",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
