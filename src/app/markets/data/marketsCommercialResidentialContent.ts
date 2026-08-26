import type { MarketStatItem } from "./marketsDataCenterContent";
import {
  marketsBenefitImages,
  type BenefitItem,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";

export const commercialResidentialIntro = {
  titleLines: ["Energy-Efficient &", "Intelligent Building Infrastructure"],
  text: "LS ELECTRIC delivers integrated building power solutions—from low-voltage distribution and protection devices to BEMS, smart electrical rooms, and solar-PV/ESS integration. These solutions enhance power reliability, energy efficiency, and safety while enabling data-driven optimization and supporting sustainable, ESG-ready Commercial & Buildings environments.",
};

export const commercialResidentialStats: MarketStatItem[] = [
  {
    id: "cr-power",
    label: "Power Consumption",
    value: "Saved up to 25%",
    sublabel: "",
    description:
      "Optimized HVAC control helps reduce power consumption by up to 25%, improving overall building energy efficiency.",
  },
  {
    id: "cr-energy",
    label: "Energy Usage",
    value: "Reduced Operating Costs",
    sublabel: "",
    description:
      "Optimized part-load performance helps lower energy usage and reduce overall operating costs.",
  },
  {
    id: "cr-stable",
    label: "Stable System Performance",
    value: "Reliable & Efficient",
    sublabel: "",
    description:
      "Dedicated HVAC control and fan/pump optimization functions help maintain stable system performance while improving operational efficiency.",
  },
];

export const commercialResidentialBenefits: BenefitItem[] = [
  {
    id: "cr-b1",
    href: "",
    title: "Reliable Power Infrastructure",
    description:
      "Ensures stable and secure power supply, minimizing downtime and protecting critical building operations.",
    capabilities:
      "Low-voltage protection devices, switchgear, transformers, and integrated power distribution solutions",
    image: marketsBenefitImages.benefit01,
  },
  {
    id: "cr-b2",
    href: "",
    title: "Energy Efficiency Optimization",
    description:
      "Optimizes energy consumption, reducing operating costs while improving overall energy efficiency.",
    capabilities: "BEMS, power monitoring systems, and data-driven energy analytics",
    image: marketsBenefitImages.benefit02,
    reverse: true,
  },
  {
    id: "cr-b3",
    href: "",
    title: "Smart Building Operation",
    description:
      "Enables real-time monitoring and data-driven operations, improving facility management and maintenance efficiency.",
    capabilities:
      "Smart electrical room solutions, digital monitoring, and integrated power management platforms",
    image: marketsBenefitImages.benefit03,
  },
  {
    id: "cr-b4",
    href: "",
    title: "Sustainable & Future-Ready Buildings",
    description:
      "Supports carbon reduction and ESG goals while enabling sustainable and future-ready building environments.",
    capabilities: "Renewable energy integration (PV), ESS, and smart energy solutions",
    image: marketsBenefitImages.benefit04,
    reverse: true,
  },
];

export const commercialResidentialReferences: ReferenceItem[] = [
  {
    id: "cr-ref-1",
    href: "",
    image: "/img/markets/commercial-residential/references/ref_01.webp",
    title: "HVAC System for IFC Mall",
    description:
      "LS ELECTRIC delivered a high-efficiency HVAC drive solution for the IFC Seoul complex, one of Korea's premier mixed-use commercial developments. By deploying 406 HVAC variable frequency drives (VFDs) with intelligent fan and pump control, the project significantly improved energy efficiency while ensuring reliable climate control across office towers, retail facilities, and hotel operations. The system achieves approximately 35% electricity cost savings, reducing annual power consumption by 14 GWh and lowering operating costs by approximately KRW 1.4 billion.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "HVAC System for IFC Mall",
      images: ["/img/markets/commercial-residential/references/ref_01.webp"],
      overview: [
        "LS ELECTRIC delivered a high-efficiency HVAC drive solution for the IFC Seoul complex, one of Korea's premier mixed-use commercial developments. By deploying 406 HVAC variable frequency drives (VFDs) with intelligent fan and pump control, the project significantly improved energy efficiency while ensuring reliable climate control across office towers, retail facilities, and hotel operations. The system achieves approximately 35% electricity cost savings, reducing annual power consumption by 14 GWh and lowering operating costs by approximately KRW 1.4 billion.\n\n- High-efficiency HVAC operation\n- Up to 35% reduction in electricity costs\n- Annual energy savings of approximately 14 GWh\n- Reduced operating expenses\n- Stable climate control for a mixed-use commercial complex\n- Optimized fan and pump performance\n- Reliable 24/7 building operation",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        {
          label: "Application",
          lines: [
            "Variable Speed Control",
            "PID Control",
            "Multi-Pump Control",
            "Soft Fill Operation",
            "Pump Clean",
            "Scheduling Operation",
            "Energy Optimization",
            "Building Automation Integration",
          ],
        },
        {
          label: "Scope of Work",
          lines: [
            "HVAC, Fan & Pump Drives (VFDs)",
            "HVAC Motor Control",
            "BACnet Communication",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "cr-ref-2",
    href: "",
    image: "/img/markets/commercial-residential/references/ref_02.webp",
    title: "Corporate Headquarters Power Infrastructure",
    description:
      "LS ELECTRIC delivered an integrated power distribution solution for a large-scale corporate headquarters and business campus in the United States. Designed to support a modern, energy-efficient workplace, the project required reliable electrical infrastructure capable of ensuring stable power supply for mission-critical office and facility operations.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "Corporate Headquarters Power Infrastructure",
      images: ["/img/markets/commercial-residential/references/ref_02.webp"],
      overview: [
        "LS ELECTRIC delivered an integrated power distribution solution for a large-scale corporate headquarters and business campus in the United States. Designed to support a modern, energy-efficient workplace, the project required reliable electrical infrastructure capable of ensuring stable power supply for mission-critical office and facility operations.\n\nLS ELECTRIC supplied a comprehensive range of medium- and low-voltage power equipment, including medium-voltage switchgear, transformers, low-voltage switchgear, power factor correction systems, and panel boards. The project demonstrated LS ELECTRIC's capability to deliver reliable and energy-efficient power infrastructure for large commercial and corporate facilities.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "Commercial Office & Corporate Campus" },
        {
          label: "Scope of Work",
          lines: [
            "38kV MV switchgears",
            "MV transformers",
            "UL 891 switchgears",
            "Power factor correction units",
            "LV transformers",
            "UL 67 Panel boards",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "cr-ref-3",
    href: "",
    image: "/img/markets/commercial-residential/references/ref_03.webp",
    title: "Lotte Hanoi Mall",
    description:
      "Lotte E&C (Engineering & Construction), one of Korea's leading EPC companies, developed Lotte Mall in Hanoi, Vietnam. As part of Lotte Group's continued expansion in Vietnam, the project created a major commercial landmark featuring retail, dining, and entertainment facilities.",
    location: "Vietnam",
    country: "",
    modal: {
      modalTitle: "Lotte Hanoi Mall",
      images: ["/img/markets/commercial-residential/references/ref_03.webp"],
      overview: [
        "Lotte E&C (Engineering & Construction), one of Korea's leading EPC companies, developed Lotte Mall in Hanoi, Vietnam. As part of Lotte Group's continued expansion in Vietnam, the project created a major commercial landmark featuring retail, dining, and entertainment facilities.\n\nAfter a three-year competitive bidding process, LS ELECTRIC secured the contract to supply EHV switchgear, LV switchgear, cast resin transformers, MCCs, distribution panels, and energization services.\n\nThe successful completion of this project demonstrated LS ELECTRIC's strong capabilities and brand recognition in Vietnam, delivering safe and reliable power solutions for one of the country's premier commercial developments.",
      ],
      keyInfo: [
        { label: "Location", value: "Vietnam" },
        { label: "Application", value: "Commercial Building" },
        {
          label: "Scope of Work",
          lines: [
            "EHV switchgears",
            "LV switchgears",
            "Cast resin transformers",
            "MCC",
            "Distribution panels",
            "Energizing procedures",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const commercialResidentialWhyItems: WhyItem[] = [
  {
    id: "cr-why-1",
    href: "",
    title: "Reliable Building Power",
    description:
      "Integrated power distribution and protection solutions ensure safe, stable, and efficient electrical operation throughout commercial and residential facilities.",
    icon: "/img/markets/commercial-residential/why/why_01.svg",
  },
  {
    id: "cr-why-2",
    href: "",
    title: "Energy Efficiency Optimization",
    description:
      "Building energy management systems and intelligent HVAC controls help reduce energy consumption, lower costs, and improve overall building performance.",
    icon: "/img/markets/commercial-residential/why/why_02.svg",
  },
  {
    id: "cr-why-3",
    href: "",
    title: "Smart Sustainable Buildings",
    description:
      "By combining digital monitoring, renewable energy integration, and energy storage technologies, LS ELECTRIC helps create smarter, more sustainable built environments.",
    icon: "/img/markets/commercial-residential/why/why_03.svg",
  },
];

export const commercialResidentialProducts: ProductItem[] = [
  {
    id: "cr-p1",
    href: "/product/metasol-ms",
    image: "/img/markets/commercial-residential/products/product_01.webp",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "cr-p2",
    href: "",
    image: "/img/markets/commercial-residential/products/product_02.webp",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "cr-p3",
    href: "",
    image: "/img/markets/commercial-residential/products/product_03.webp",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "cr-p4",
    href: "",
    image: "/img/markets/commercial-residential/products/product_04.webp",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "cr-p5",
    href: "",
    image: "/img/markets/commercial-residential/products/product_05.webp",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "cr-p6",
    href: "",
    image: "/img/markets/commercial-residential/products/product_06.webp",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "cr-p7",
    href: "",
    image: "/img/markets/commercial-residential/products/product_07.webp",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "cr-p8",
    href: "",
    image: "/img/markets/commercial-residential/products/product_08.webp",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
