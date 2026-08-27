import {
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
  heroImage: "/img/markets/power-grid/hero/hero.webp",
  secondaryCta: {
    label: "Get the Whitepaper",
    href: "/docs/PowerGrid.pdf",
    icon: "download" as const,
  },
};

export const powerGridIntro = {
  titleLines: [
    "Enabling Resilient and Efficient",
    "Power Networks with Smart Grid & Energy Solutions",
  ],
  text:
    "LS ELECTRIC supports the evolving power grid ecosystem with advanced power and automation solutions including Power Generation, Transmission & Distribution, Microgrids, BESS, and Renewable Energy. Our comprehensive portfolio ensures stable and efficient energy flow across the grid, from centralized generation to distributed energy resources. With intelligent grid technologies, digital monitoring systems, and high-reliability equipment, we enhance grid resilience, optimize energy efficiency, and enable seamless integration of renewable and storage systems. LS ELECTRIC empowers utilities and operators to achieve sustainable, flexible, and future-ready energy infrastructure.",
};

export const powerGridIndustryTabs: IndustryTab[] = [
  {
    id: "generation",
    label: "Power Generation, Transmission & Distribution",
    title: "Power Generation, Transmission<br>& Distribution",
    description:
      "LS ELECTRIC delivers comprehensive power solutions across generation, transmission, and distribution networks, ensuring stable and efficient energy flow. With proven technologies in switchgear, transformers, and protection systems, we enhance grid reliability, minimize losses, and support large-scale infrastructure with fast and dependable delivery.",
    image: "/img/markets/power-grid/explore/img_generation.webp",
  },
  {
    id: "microgrids",
    label: "Microgrids",
    title: "Microgrids",
    description:
      "LS ELECTRIC enables flexible and resilient microgrid solutions by integrating distributed energy resources with advanced control and automation systems. Our smart microgrid platforms optimize energy usage, ensure stable operation in both grid-connected and islanded modes, and support energy independence for critical facilities.",
    image: "/img/markets/power-grid/explore/img_microgrids.webp",
  },
  {
    id: "bess",
    label: "BESS",
    title: "BESS (Battery Energy Storage Systems)",
    description:
      "LS ELECTRIC provides high-performance BESS solutions with optimized power conversion systems (PCS) and reliable electrical infrastructure. Our solutions improve grid stability, support peak shaving, and enhance renewable energy utilization, backed by safe system design and efficient energy management capabilities.",
    image: "/img/markets/power-grid/explore/img_bess.webp",
    cta: {
      title: "Contact LS Energy Solutions for BESS",
      email: "sales@ls-es.com",
      copyLabel: "Copy Email",
      copyLabelMobile: "Copy Link",
    },
  },
  {
    id: "utilities",
    label: "Utilities",
    title: "Utilities",
    description:
      "LS ELECTRIC partners with utilities to modernize grid infrastructure through intelligent power distribution and digital monitoring solutions. Our robust equipment and smart grid technologies improve operational efficiency, enable real-time asset management, and ensure long-term reliability in evolving energy environments.",
    image: "/img/markets/power-grid/explore/img_utilities.webp",
  },
  {
    id: "renewables",
    label: "Renewables",
    title: "Renewables",
    description:
      "LS ELECTRIC supports renewable energy integration with advanced electrical and automation solutions tailored for solar, wind, and hybrid energy systems. Our technologies enable seamless grid connection, maximize energy efficiency, and ensure stable operation while accelerating the transition toward sustainable energy systems.",
    image: "/img/markets/power-grid/explore/img_renewables.webp",
  },
];

export const powerGridReferences: ReferenceItem[] = [
  {
    id: "pg-ref-1",
    href: "",
    image: "/img/markets/power-grid/references/ref_01.webp",
    title: "200MW Solar Power Plant and Grid Connection Infrastructure",
    description:
      "As South Korea accelerates its renewable energy transition under the national Renewable Energy 2030 initiative, large-scale solar power projects require reliable grid connection infrastructure and integrated engineering capabilities. This project supported the development of a 200MW solar power plant on Bigeum Island by delivering a comprehensive power transmission solution from engineering to commissioning.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "200MW Solar Power Plant and Grid Connection Infrastructure",
      images: ["/img/markets/power-grid/references/ref_01.webp"],
      overview: [
        "As South Korea accelerates its renewable energy transition under the national Renewable Energy 2030 initiative, large-scale solar power projects require reliable grid connection infrastructure and integrated engineering capabilities. This project supported the development of a 200MW solar power plant on Bigeum Island by delivering a comprehensive power transmission solution from engineering to commissioning.",
        "To ensure stable power transmission to the national grid, LS ELECTRIC provided a complete EPC solution covering transmission infrastructure, substations, and grid interconnection systems, including engineering, installation, testing, commissioning, and safety inspections.",
        "This project successfully enabled reliable grid integration for one of Korea's major renewable energy developments, demonstrating LS ELECTRIC's expertise in utility-scale renewable energy and transmission infrastructure.",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        { label: "Application", value: "Utility-scale Solar Power Plant" },
        {
          label: "Scope of Work",
          value:
            "Solar panels, 154kV substation, switching stations, transmission lines, underground transmission lines, engineering, installation, testing & commissioning, supervision",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pg-ref-2",
    href: "",
    image: "/img/markets/power-grid/references/ref_02.webp",
    title: "50MW Utility-scale Solar Power Plant EPC",
    description:
      "To support Japan's growing renewable energy market, LS ELECTRIC participated in the development of the 50MW Morioka Solar Power Station through a turnkey EPC and O&M project. Delivered in partnership with Dohwa Engineering, the project provides reliable and efficient solar power generation for approximately 16,000 households.",
    location: "Japan",
    country: "",
    modal: {
      modalTitle: "50MW Utility-scale Solar Power Plant EPC",
      images: ["/img/markets/power-grid/references/ref_02.webp"],
      overview: [
        "To support Japan's growing renewable energy market, LS ELECTRIC participated in the development of the 50MW Morioka Solar Power Station through a turnkey EPC and O&M project. Delivered in partnership with Dohwa Engineering, the project provides reliable and efficient solar power generation for approximately 16,000 households.",
        "LS ELECTRIC supplied key electrical equipment, including transformers and DC junction boxes, while managing EPC execution, construction supervision, power generation performance, and long-term operation and maintenance. The successful delivery further strengthened the company's track record in utility-scale solar power projects and expanded its renewable energy presence in the Japanese market.",
      ],
      keyInfo: [
        { label: "Location", value: "Japan" },
        { label: "Application", value: "Utility-scale Solar Power Plant" },
        {
          label: "Scope of Work",
          value: "Transformers, DC junction boxes, EPC, O&M",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "pg-ref-3",
    href: "",
    image: "/img/markets/power-grid/references/ref_03.webp",
    title: "QCELLS Redeemer Project",
    description:
      "The Qcells Redeemer Project, located in Cartersville, Georgia, is one of North America's largest integrated solar manufacturing facilities. The site encompasses the complete solar supply chain, from ingot and wafer production to cell and module assembly.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "QCELLS Redeemer Project",
      images: ["/img/markets/power-grid/references/ref_03.webp"],
      overview: [
        "The Qcells Redeemer Project, located in Cartersville, Georgia, is one of North America's largest integrated solar manufacturing facilities. The site encompasses the complete solar supply chain, from ingot and wafer production to cell and module assembly.",
        "Operating a facility of this scale requires an exceptionally reliable power distribution system and a partner with a proven track record in heavy industrial manufacturing. Building on its successful execution of the nearby Qcells Eagle Project in Dalton, Georgia, LS ELECTRIC earned the client's trust through demonstrated technical expertise and robust local capabilities, securing its role as the primary power infrastructure partner for the Redeemer Project.",
        "LS ELECTRIC provided a complete power solution—supplying medium and low-voltage switchgear and distribution panels, alongside comprehensive engineering, on-site technical support, and commissioning services to ensure seamless power reliability.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        {
          label: "Application",
          value: "Renewable Energy / Solar Manufacturing",
        },
        {
          label: "Scope of Work",
          lines: [
            "MV Switchgear",
            "ATC (Automatic Transfer Controller)",
            "Molded Transformer",
            "LV Switchboard",
            "RCP",
            "HRG",
            "Panelboard",
          ],
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
    image: "/img/markets/power-grid/benefits/benefit_01.webp",
  },
  {
    id: "pg-b2",
    href: "",
    title: "Smart Grid<br>& Digitalized Operations",
    description:
      "From utilities to microgrids, LS ELECTRIC enables intelligent grid management through advanced automation and real-time monitoring technologies.",
    capabilities:
      "SCADA systems, EMS/DMS platforms, real-time monitoring, and integrated automation for optimized grid operation",
    image: "/img/markets/power-grid/benefits/benefit_02.webp",
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
    image: "/img/markets/power-grid/benefits/benefit_03.webp",
  },
  {
    id: "pg-b4",
    href: "",
    title: "Flexible & Scalable Power Infrastructure",
    description:
      "Designed for diverse applications including utilities, microgrids, and distributed energy systems, LS ELECTRIC solutions offer scalable and adaptable power infrastructure.",
    capabilities:
      "Modular substations, microgrid solutions, distribution systems, and flexible grid architecture for evolving energy demands",
    image: "/img/markets/power-grid/benefits/benefit_04.webp",
    reverse: true,
  },
];

export const powerGridSustainabilityCards: SustainabilityCard[] = [
  {
    id: "pg-sus-1",
    image: "/img/markets/power-grid/sustainability/card_01.webp",
    title: "Sustainability & ESG Leadership",
    bullets: [
      "LS ELECTRIC has established a structured ESG management system, strengthening sustainability across environmental, social, and governance areas.",
      "Through continuous initiatives and global certifications, we enhance corporate value while driving responsible and sustainable business operations.",
    ],
  },
  {
    id: "pg-sus-2",
    image: "/img/markets/power-grid/sustainability/card_02.webp",
    title: "Carbon Neutrality & Renewable Transition",
    bullets: [
      "LS ELECTRIC is committed to achieving carbon neutrality by 2040 and expanding renewable energy usage through RE100 participation.",
      "We accelerate the energy transition by improving efficiency, increasing renewable sourcing, and leveraging solutions such as solar, RECs, and PPAs.",
    ],
  },
];

export const powerGridSustainabilityTitleLines = [
  "Driving a Sustainable Energy Future by",
  "LS ELECTRIC",
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
    title: "Utility Infrastructure Expertise",
    description:
      "With decades of experience in transmission and distribution systems, LS ELECTRIC provides the reliable foundation utilities need to modernize and strengthen grid operations.",
    icon: "/img/markets/power-grid/why/why_01.svg",
  },
  {
    id: "pg-why-2",
    href: "",
    title: "Renewable & ESS Integration",
    description:
      "We help utilities seamlessly integrate renewable energy, battery storage, and distributed energy resources while maintaining grid stability and performance.",
    icon: "/img/markets/power-grid/why/why_02.svg",
  },
  {
    id: "pg-why-3",
    href: "",
    title: "Intelligent Grid Operations",
    description:
      "Advanced grid management and automation technologies provide real-time visibility, faster decision-making, and improved system reliability.",
    icon: "/img/markets/power-grid/why/why_03.svg",
  },
];

export const powerGridProducts: ProductItem[] = [
  {
    id: "pg-p1",
    href: "/product/metasol-ms",
    image: "/img/markets/power-grid/products/product_01.webp",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "pg-p2",
    href: "",
    image: "/img/markets/power-grid/products/product_02.webp",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "pg-p3",
    href: "",
    image: "/img/markets/power-grid/products/product_03.webp",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "pg-p4",
    href: "",
    image: "/img/markets/power-grid/products/product_04.webp",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "pg-p5",
    href: "",
    image: "/img/markets/power-grid/products/product_05.webp",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "pg-p6",
    href: "",
    image: "/img/markets/power-grid/products/product_06.webp",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "pg-p7",
    href: "",
    image: "/img/markets/power-grid/products/product_07.webp",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "pg-p8",
    href: "",
    image: "/img/markets/power-grid/products/product_08.webp",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
