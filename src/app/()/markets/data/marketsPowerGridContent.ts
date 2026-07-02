import {
  marketsBenefitImages,
  type BenefitItem,
  type IndustryTab,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";
import type { SustainabilityCard } from "../components/MarketsSustainability";
import type { SmartGridUseCase } from "../components/MarketsSmartGrid";

export const powerGridHero = {
  subtitle:
    "Reliable, Intelligent & Sustainable Power Infrastructure for Modern Energy Systems",
  title: "Power Grid",
  heroImage: "/img/markets/power-grid/hero/hero.jpg",
};

export const powerGridIntro = {
  titleLines: [
    "Enabling Resilient and Efficient",
    "Power Networks with Smart Grid & Energy Solutions",
  ],
  paragraphs: [
    "LS ELECTRIC supports the evolving power grid ecosystem with advanced power and automation solutions including Power Generation, Transmission & Distribution, Microgrids, BESS, and Renewable Energy. Our comprehensive portfolio ensures stable and efficient energy flow across the grid, from centralized generation to distributed energy resources.",
    "With intelligent grid technologies, digital monitoring systems, and high-reliability equipment, we enhance grid resilience, optimize energy efficiency, and enable seamless integration of renewable and storage systems. LS ELECTRIC empowers utilities and operators to achieve sustainable, flexible, and future-ready energy infrastructure.",
  ],
};

export const powerGridIndustryTabs: IndustryTab[] = [
  {
    id: "generation",
    label: "Power Generation, Transmission & Distribution",
    title: "Power Generation, Transmission<br>& Distribution",
    description:
      "LS ELECTRIC delivers comprehensive power solutions across generation, transmission, and distribution networks, ensuring stable and efficient energy flow. With proven technologies in switchgear, transformers, and protection systems, we enhance grid reliability, minimize losses, and support large-scale infrastructure with fast and dependable delivery.",
    image: "/img/markets/power-grid/explore/img_generation.jpg",
  },
  {
    id: "microgrids",
    label: "Microgrids",
    title: "Microgrids",
    description:
      "LS ELECTRIC enables flexible and resilient microgrid solutions by integrating distributed energy resources with advanced control and automation systems. Our smart microgrid platforms optimize energy usage, ensure stable operation in both grid-connected and islanded modes, and support energy independence for critical facilities.",
    image: "/img/markets/power-grid/explore/img_microgrids.jpg",
  },
  {
    id: "bess",
    label: "BESS",
    title: "BESS (Battery Energy Storage Systems)",
    description:
      "LS ELECTRIC provides high-performance BESS solutions with optimized power conversion systems (PCS) and reliable electrical infrastructure. Our solutions improve grid stability, support peak shaving, and enhance renewable energy utilization, backed by safe system design and efficient energy management capabilities.",
    image: "/img/markets/power-grid/explore/img_bess.jpg",
  },
  {
    id: "utilities",
    label: "Utilities",
    title: "Utilities",
    description:
      "LS ELECTRIC partners with utilities to modernize grid infrastructure through intelligent power distribution and digital monitoring solutions. Our robust equipment and smart grid technologies improve operational efficiency, enable real-time asset management, and ensure long-term reliability in evolving energy environments.",
    image: "/img/markets/power-grid/explore/img_utilities.jpg",
  },
  {
    id: "renewables",
    label: "Renewables",
    title: "Renewables",
    description:
      "LS ELECTRIC supports renewable energy integration with advanced electrical and automation solutions tailored for solar, wind, and hybrid energy systems. Our technologies enable seamless grid connection, maximize energy efficiency, and ensure stable operation while accelerating the transition toward sustainable energy systems.",
    image: "/img/markets/power-grid/explore/img_renewables.jpg",
  },
];

export const powerGridReferences: ReferenceItem[] = [
  {
    id: "pg-ref-1",
    href: "",
    image: "/img/markets/power-grid/references/ref_01.jpg",
    title: "Lotte Hanoi Mall",
    description:
      "LS ELECTRIC ultimately succeeded in winning the contract to supply EHV switchgears, LV switchgears, and integrated power distribution for this large-scale commercial development.",
    location: "Vietnam",
    country: "",
    modal: {
      modalTitle: "Lotte Hanoi Mall",
      images: ["/img/markets/power-grid/references/ref_01.jpg"],
      overview: [
        "LS ELECTRIC ultimately succeeded in winning the contract to supply EHV switchgears, LV switchgears, and integrated power distribution for this large-scale commercial development.",
        "The project required coordinated high-voltage and low-voltage equipment engineered for reliable operation across a complex mixed-use facility with demanding load profiles.",
        "Through integrated engineering and supply, LS ELECTRIC helped the customer streamline installation, reduce coordination risk, and deliver a stable power infrastructure foundation.",
      ],
      keyInfo: [
        { label: "Location", value: "Vietnam" },
        { label: "Application", value: "Commercial Complex" },
        {
          label: "Scope of Work",
          value: "EHV switchgears and LV switchgears supply",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pg-ref-2",
    href: "",
    image: "/img/markets/power-grid/references/ref_02.jpg",
    title: "LG USA New Headquarters",
    description:
      "As such, we supplied various equipment such as 38kV MV switchgears, MV transformers, UL 891 switchgears, and coordinated low-voltage distribution for the new headquarters campus.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "LG USA New Headquarters",
      images: ["/img/markets/power-grid/references/ref_02.jpg"],
      overview: [
        "As such, we supplied various equipment such as 38kV MV switchgears, MV transformers, UL 891 switchgears, and coordinated low-voltage distribution for the new headquarters campus.",
        "The solution was designed to meet North American standards while supporting the customer's goals for energy efficiency and operational reliability across the facility.",
        "Integrated delivery of medium-voltage and low-voltage systems helped accelerate commissioning and ensure consistent performance across the campus power architecture.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "Corporate Headquarters" },
        {
          label: "Scope of Work",
          value: "38kV MV switchgears, MV transformers, UL 891 switchgears",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pg-ref-3",
    href: "",
    image: "/img/markets/power-grid/references/ref_03.jpg",
    title: "KPX Energy Management System",
    description:
      "Owing to the next-generation EMS constructed at the site, operators can now optimally manage power generation, analyze systems, and improve grid-wide operational visibility.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "KPX Energy Management System",
      images: ["/img/markets/power-grid/references/ref_03.jpg"],
      overview: [
        "Owing to the next-generation EMS constructed at the site, operators can now optimally manage power generation, analyze systems, and improve grid-wide operational visibility.",
        "The energy management system integrates real-time monitoring, analytics, and control capabilities to support efficient power operations across the network.",
        "This project demonstrates LS ELECTRIC's ability to deliver advanced digital platforms that enhance reliability and decision-making for mission-critical energy infrastructure.",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        { label: "Application", value: "Energy Management System" },
        {
          label: "Scope of Work",
          value: "Next-generation EMS design and implementation",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const powerGridBenefits: BenefitItem[] = [
  {
    id: "pg-b1",
    href: "",
    title: "Grid Stability<br>& Power Reliability",
    description:
      "LS ELECTRIC ensures stable and uninterrupted power flow across generation, transmission, and distribution networks, supporting critical infrastructure and utility operations.",
    capabilities:
      "High-performance switchgear, protection relays, fault detection systems, and grid stabilization solutions for reliable power delivery",
    image: marketsBenefitImages.benefit05,
  },
  {
    id: "pg-b2",
    href: "",
    title: "Smart Grid<br>& Digitalized Operations",
    description:
      "From utilities to microgrids, LS ELECTRIC enables intelligent grid management through advanced automation and real-time monitoring technologies.",
    capabilities:
      "SCADA systems, EMS/DMS platforms, real-time monitoring, and integrated automation for optimized grid operation",
    image: marketsBenefitImages.benefit10,
    reverse: true,
  },
  {
    id: "pg-b3",
    href: "",
    title: "Energy Storage<br>& Renewable Integration",
    description:
      "Supporting the transition to clean energy, LS ELECTRIC provides solutions that seamlessly integrate renewables and energy storage systems into the grid.",
    capabilities:
      "BESS solutions, power conversion systems (PCS), renewable interconnection technologies, and grid balancing solutions",
    image: marketsBenefitImages.benefit09,
  },
  {
    id: "pg-b4",
    href: "",
    title: "Flexible & Scalable Power Infrastructure",
    description:
      "Designed for diverse applications including utilities, microgrids, and distributed energy systems, LS ELECTRIC solutions offer scalable and adaptable power infrastructure.",
    capabilities:
      "Modular substations, microgrid solutions, distribution systems, and flexible grid architecture for evolving energy demands",
    image: marketsBenefitImages.benefit04,
    reverse: true,
  },
];

export const powerGridSustainabilityCards: SustainabilityCard[] = [
  {
    id: "pg-sus-1",
    image: "/img/markets/power-grid/sustainability/card_01.jpg",
    title: "Sustainability & ESG Leadership",
    bullets: [
      "LS ELECTRIC has established a structured ESG management system, strengthening sustainability across environmental, social, and governance areas.",
      "Through continuous initiatives and global certifications, we enhance corporate value while driving responsible and sustainable business operations.",
    ],
  },
  {
    id: "pg-sus-2",
    image: "/img/markets/power-grid/sustainability/card_02.jpg",
    title: "Carbon Neutrality & Renewable Transition",
    bullets: [
      "LS ELECTRIC is committed to achieving carbon neutrality by 2040 and expanding renewable energy usage through RE100 participation.",
      "We accelerate the energy transition by improving efficiency, increasing renewable sourcing, and leveraging solutions such as solar, RECs, and PPAs.",
    ],
  },
];

export const powerGridSmartGridUseCases: SmartGridUseCase[] = [
  {
    id: "pg-sg-1",
    title: "BESS Use Case 1 (3MW / 6MWh)",
    description:
      "LS ELECTRIC deployed a grid-support BESS in a utility distribution network with high PV penetration, delivering voltage regulation through reactive power control and ensuring stable grid operation",
  },
  {
    id: "pg-sg-2",
    title: "BESS Use Case 2 (250kW / 500kWh)",
    description:
      "LS ELECTRIC implemented a BESS solution for utility distribution systems to enable load leveling and peak shaving, improving line capacity utilization and supporting Non-Wire Alternatives (NWA)",
  },
  {
    id: "pg-sg-3",
    title: "Microgrid Use Case (Uiwang Microgrid Project)",
    description:
      "LS ELECTRIC operates its own microgrid integrating PV, BESS, and EV charging infrastructure, enabling seamless transition between grid-connected and islanded modes with real-time energy management",
  },
];

export const powerGridSmartGridOperation: SmartGridUseCase[] = [
  {
    id: "pg-sg-op-1",
    description:
      "LS ELECTRIC microgrid enables flexible operation across grid-connected mode, planned islanding with seamless transfer, and unplanned islanding supported by rapid black-start capability.",
  },
  {
    id: "pg-sg-op-2",
    description:
      "The system enhances energy efficiency, reduces operational costs, and ensures stable power supply through intelligent control of distributed energy resources and energy storage systems.",
  },
];

export const powerGridWhyItems: WhyItem[] = [
  {
    id: "pg-why-1",
    href: "",
    title: "Technological Innovation",
    description:
      "Low-voltage protection devices, power distribution systems, smart electrical rooms, BEMS, and renewable energy solutions",
    icon: "/img/markets/img_why_01.svg",
  },
  {
    id: "pg-why-2",
    href: "",
    title: "Operational Optimization",
    description:
      "Optimized power consumption, reduced operating costs, and improved energy efficiency across building facilities",
    icon: "/img/markets/img_why_02.svg",
  },
  {
    id: "pg-why-3",
    href: "",
    title: "Proven Reliability",
    description:
      "Highly reliable and safe power infrastructure tailored to the demanding requirements of commercial buildings",
    icon: "/img/markets/img_why_03.svg",
  },
];

export const powerGridProducts: ProductItem[] = [
  {
    id: "pg-p1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/markets/power-grid/products/product_01.jpg",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "pg-p2",
    href: "",
    image: "/img/markets/power-grid/products/product_02.jpg",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "pg-p3",
    href: "",
    image: "/img/markets/power-grid/products/product_03.jpg",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "pg-p4",
    href: "",
    image: "/img/markets/power-grid/products/product_04.jpg",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "pg-p5",
    href: "",
    image: "/img/markets/power-grid/products/product_05.jpg",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "pg-p6",
    href: "",
    image: "/img/markets/power-grid/products/product_06.jpg",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "pg-p7",
    href: "",
    image: "/img/markets/power-grid/products/product_07.jpg",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "pg-p8",
    href: "",
    image: "/img/markets/power-grid/products/product_08.jpg",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
