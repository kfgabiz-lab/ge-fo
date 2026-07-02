import type { MarketStatItem } from "./marketsDataCenterContent";
import {
  marketsBenefitImages,
  type BenefitItem,
  type ProductItem,
  type ReferenceItem,
} from "./marketsContent";

export const commercialResidentialIntro = {
  titleLines: ["Energy-Efficient &", "Intelligent Building Infrastructure"],
  text: "LS ELECTRIC delivers integrated building power solutions—from low-voltage distribution and protection devices to BEMS, smart electrical rooms, and solar-PV/ESS integration. These solutions enhance power reliability, energy efficiency, and safety while enabling data-driven optimization and supporting sustainable, ESG-ready Commercial & Buildings environments.",
};

export const commercialResidentialStats: MarketStatItem[] = [
  {
    id: "cr-power",
    label: "Power consumption",
    value: "Saved up to 25%",
    sublabel: "",
    description:
      "Optimized HVAC control helps reduce power consumption by up to 25%, improving overall building energy efficiency.",
  },
  {
    id: "cr-energy",
    label: "Energy usage",
    value: "Reduced Operating Costs",
    sublabel: "",
    description:
      "Optimized part-load performance helps lower energy usage and reduce overall operating costs.",
  },
  {
    id: "cr-stable",
    label: "Stable System Performance",
    value: "Reliable&Efficient",
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
    image: "/img/markets/commercial-residential/references/ref_01.jpg",
    title: "HV-LV Integrated Turnkey Supply",
    description:
      "The rapid expansion of AI data centers has increased demand for reliable and integrated power infrastructure solutions. This project focused on providing a comprehensive electrical package to support a large-scale data center facility with high-voltage and low-voltage equipment.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "HV-LV Integrated Turnkey Supply",
      images: ["/img/markets/commercial-residential/references/ref_01.jpg"],
      overview: [
        "The rapid expansion of AI data centers has increased demand for reliable and integrated power infrastructure solutions. This project focused on providing a comprehensive electrical package to support a large-scale data center facility with high-voltage and low-voltage equipment.",
        "To meet the customer's aggressive schedule and requirement for streamlined project execution, a single-source supply approach was implemented. The solution included 180 medium-voltage switchgear panels and 120 unit substations, combining coordinated engineering, procurement, manufacturing, and delivery processes to reduce integration complexity and accelerate project progress.",
        "Through integrated project management and close technical coordination, the project was successfully delivered within the required timeline. This approach helped minimize coordination risks, simplify execution for the end user, and demonstrate the value of turnkey power solutions for mission-critical data center applications.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "Data Center" },
        {
          label: "Scope of Work",
          value: "180 MV switchgear panels and 120 unit substations",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "cr-ref-2",
    href: "",
    image: "/img/markets/commercial-residential/references/ref_02.jpg",
    title: "Australian Data Center Project",
    description:
      "PROJECT DUNE is a data center project in Australia aimed at providing an integrated solution by combining advanced power infrastructure and building automation capabilities. The project focuses on delivering reliable and cost-effective solutions for global colocation data center customers.",
    location: "Australia",
    country: "",
    modal: {
      modalTitle: "Australian Data Center Project",
      images: ["/img/markets/commercial-residential/references/ref_02.jpg"],
      overview: [
        "PROJECT DUNE is a data center project in Australia aimed at providing an integrated solution by combining advanced power infrastructure and building automation capabilities. The project focuses on delivering reliable and cost-effective solutions for global colocation data center customers.",
        "To meet customer requirements for competitive pricing and high-quality electrical systems, an alternative sourcing strategy was reviewed by utilizing an established supplier network. Based on this approach, a competitive electrical package including medium-voltage switchgear, transformer solutions, and low-voltage switchgear was proposed.",
        "Through PROJECT DUNE, the company aims to strengthen its position in the Australian data center market and expand future opportunities with global customers by delivering optimized power solutions.",
      ],
      keyInfo: [
        { label: "Location", value: "Australia" },
        { label: "Application", value: "Data Center" },
        {
          label: "Scope of Work",
          value:
            "Medium-voltage switchgear, transformer solutions, and low-voltage switchgear package",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "cr-ref-3",
    href: "",
    image: "/img/markets/commercial-residential/references/ref_03.jpg",
    title: "AI Data Center Demonstration Testbed",
    description:
      "To address the rapid expansion of the global data center market, the company and a strategic partner established a collaborative demonstration testbed. This facility aims to strengthen validation capabilities in power and cooling infrastructure, supporting joint market entry into the emerging AI data center sector.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "AI Data Center Demonstration Testbed",
      images: ["/img/markets/commercial-residential/references/ref_03.jpg"],
      overview: [
        "To address the rapid expansion of the global data center market, the company and a strategic partner established a collaborative demonstration testbed. This facility aims to strengthen validation capabilities in power and cooling infrastructure, supporting joint market entry into the emerging AI data center sector.",
        "To meet requirements for a high-efficiency, high-density AI data center model, the solution integrates liquid cooling and advanced power systems. The company is delivering a power quality monitoring system and an optimized DC power architecture, combined with the partner's specialized high-density racks.",
        "This initiative establishes a valuable technical reference for next-generation data center stability and efficiency. It also strengthens long-term business cooperation between both parties, creating a solid foundation to capture future opportunities in the rapidly evolving AI infrastructure market.",
      ],
      keyInfo: [
        { label: "Location", value: "South Korea" },
        { label: "Application", value: "AI Data Center Infrastructure" },
        {
          label: "Scope of Work",
          value:
            "Power quality monitoring, DC power architecture, and high-density rack integration",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const commercialResidentialProducts: ProductItem[] = [
  {
    id: "cr-p1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/markets/commercial-residential/products/product_01.jpg",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "cr-p2",
    href: "",
    image: "/img/markets/commercial-residential/products/product_02.jpg",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "cr-p3",
    href: "",
    image: "/img/markets/commercial-residential/products/product_03.jpg",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "cr-p4",
    href: "",
    image: "/img/markets/commercial-residential/products/product_04.jpg",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "cr-p5",
    href: "",
    image: "/img/markets/commercial-residential/products/product_05.jpg",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "cr-p6",
    href: "",
    image: "/img/markets/commercial-residential/products/product_06.jpg",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "cr-p7",
    href: "",
    image: "/img/markets/commercial-residential/products/product_07.jpg",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "cr-p8",
    href: "",
    image: "/img/markets/commercial-residential/products/product_08.jpg",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
