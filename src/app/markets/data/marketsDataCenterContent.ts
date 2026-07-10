import type {
  BenefitItem,
  FaqItem,
  ProductItem,
  ReferenceItem,
  WhyItem,
} from "./marketsContent";

export const dataCenterHero = {
  subtitle: "Agile, modular power for the AI-driven era.",
  title: "Data Centers",
  heroImage: "/img/markets/data-center/hero.jpg",
};

export const dataCenterIntro = {
  titleLines: ["Powering the", "Next Generation of AI Data Centers"],
  text: "As Asia’s first and only provider of a full UL-certified switchgear line-up , LS ELECTRIC delivers the mission-critical components that power the world’s leading data centers. From hyperscale cloud environments to gigawatt-scale AI infrastructure, our field-proven technologies ensure seamless integration and strict local compliance. By supplying modular power systems and intelligent management platforms, we optimize individual site deployment, reducing overall installation time by 30%.From the high-voltage utility source to the server rack, we invest in a high-performance portfolio engineered to give next-generation data centers exactly what they need, when they need it.",
};

export type MarketStatItem = {
  id: string;
  label: string;
  value: string;
  valueUnit?: string;
  valueSuffix?: string;
  sublabel: string;
  description: string;
};

export const dataCenterReferences: ReferenceItem[] = [
  {
    id: "dc-ref-1",
    href: "",
    image: "/img/markets/data-center/references/ref_01.jpg",
    title: "HV-LV Integrated Turnkey Supply",
    description:
      "The rapid expansion of AI data centers has increased demand for reliable and integrated power infrastructure solutions. This project focused on providing a comprehensive electrical package to support a large-scale data center facility with high-voltage and low-voltage equipment.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "HV-LV Integrated Turnkey Supply",
      images: ["/img/markets/data-center/references/ref_01.jpg"],
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
    id: "dc-ref-2",
    href: "",
    image: "/img/markets/data-center/references/ref_02.jpg",
    title: "Australian Data Center Project",
    description:
      "PROJECT DUNE is a data center project in Australia aimed at providing an integrated solution by combining advanced power infrastructure and building automation capabilities. The project focuses on delivering reliable and cost-effective solutions for global colocation data center customers.",
    location: "Australia",
    country: "",
    modal: {
      modalTitle: "Australian Data Center Project",
      images: ["/img/markets/data-center/references/ref_02.jpg"],
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
    id: "dc-ref-3",
    href: "",
    image: "/img/markets/data-center/references/ref_03.jpg",
    title: "AI Data Center Demonstration Testbed",
    description:
      "To address the rapid expansion of the global data center market, the company and a strategic partner established a collaborative demonstration testbed. This facility aims to strengthen validation capabilities in power and cooling infrastructure, supporting joint market entry into the emerging AI data center sector.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "AI Data Center Demonstration Testbed",
      images: ["/img/markets/data-center/references/ref_03.jpg"],
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

export const dataCenterStats: MarketStatItem[] = [
  {
    id: "ul",
    label: "Global safety compliant",
    value: "UL-Certified",
    sublabel: "reliability and compliance",
    description:
      "As the first and only Asian provider of a full UL-certified switchgear line-up, we ensure seamless local compliance and reliability for the most demanding North American power infrastructures.",
  },
  {
    id: "powerone",
    label: "Reduce installation time by up to",
    value: "30",
    valueUnit: "%",
    valueSuffix: " Reduce",
    sublabel: "reliability and compliance",
    description:
      'Our modular "Beyond PowerONE" solution streamlines engineering and installation, reducing construction lead times by up to 30% while maximizing space efficiency through compact design.',
  },
  {
    id: "monitoring",
    label: "Real-time monitoring of",
    value: "1,000,000",
    sublabel: "tags per second for AI workloads",
    description:
      "From 800V DC architectures to AI-driven DCIM platforms, our intelligent solutions provide real-time monitoring and predictive maintenance to power the next generation of gigawatt-scale AI workloads.",
  },
];

export const dataCenterBenefits: BenefitItem[] = [
  {
    id: "dc-b1",
    href: "",
    title: "Intelligent Grid Connection",
    description:
      "Uninterrupted operation and selective fault isolation for mission-critical power supply.",
    capabilities:
      "We provide ultra-high-voltage substation equipment (up to 154kV) and Gas Insulated Switchgear (GIS) to ensure stable interconnection with the utility grid.",
    image: "/img/markets/img_benefit_01.png",
  },
  {
    id: "dc-b2",
    href: "",
    title: "Efficient Power Distribution",
    description:
      "The first and only UL-certified full-lineup supplier in Asia, ensuring full compliance with North American local regulations.",
    capabilities:
      "We provide a full lineup of UL-certified medium-voltage (MV) and low-voltage (LV) switchgear, along with energy-efficient cast resin transformers.",
    image: "/img/markets/img_benefit_02.png",
    reverse: true,
  },
  {
    id: "dc-b3",
    href: "",
    title: "Uninterruptible<br>Power Protection",
    description:
      "Proven with over 85% market share in Korea, delivering mission-critical reliability and rapid response capability.",
    capabilities:
      "An integrated emergency power system including high-performance UPS (up to 500kVA FAT capacity), STS, and a synchronized CTTS generator transfer system.",
    image: "/img/markets/img_benefit_03.png",
  },
  {
    id: "dc-b4",
    href: "",
    title: "AI-Ready<br>Smart Automation",
    description:
      "Real-time monitoring and autonomous HVAC optimization through 3D digital twin visualization.",
    capabilities:
      "A next-generation platform (Beyond Cube) capable of processing one million data points per second, with AI-based predictive diagnostics.",
    image: "/img/markets/img_benefit_04.png",
    reverse: true,
  },
];

export const dataCenterWhyItems: WhyItem[] = [
  {
    id: "dc-why-1",
    href: "",
    title: "Fast deployment & response",
    description:
      "Extensive references in the North American market (including Big Tech companies and energy corporations)",
    icon: "/img/markets/img_why_01.png",
  },
  {
    id: "dc-why-2",
    href: "",
    title: "Proven reliability",
    description:
      "Extensive references in the North American market (including Big Tech companies and energy corporations)",
    icon: "/img/markets/img_why_02.png",
  },
  {
    id: "dc-why-3",
    href: "",
    title: "Energy efficiency",
    description:
      "Up to 40% reduction in energy consumption (applicable to HVAC Optimal Free Cooling solutions within data centers)",
    icon: "/img/markets/img_why_03.png",
  },
];

export const dataCenterWhyDescription =
  "We understand that in the public sector, failure is not an option";

export const dataCenterFaqItems: FaqItem[] = [
  {
    question: "What UL-certified switchgear does LS ELECTRIC offer for data centers?",
    answer:
      "We provide a full lineup of UL-certified medium-voltage and low-voltage switchgear, metal-clad switchgear, and arc-resistant distribution equipment designed for North American data center compliance.",
  },
  {
    question: "How does Beyond PowerONE reduce installation time?",
    answer:
      "Beyond PowerONE modular power skids streamline engineering and on-site assembly, reducing construction lead times by up to 30% compared with conventional stick-built electrical rooms.",
  },
  {
    question: "Can LS ELECTRIC support AI-scale monitoring workloads?",
    answer:
      "Yes. Our Beyond Cube DCIM platform processes up to one million data points per second with AI-based predictive diagnostics for real-time facility visibility.",
  },
];

export const dataCenterProducts: ProductItem[] = [
  {
    id: "dc-p1",
    href: "/devices-systems/motor-control/metasol-ms",
    image: "/img/markets/solutions/product_mcsg.png",
    title: "MCSG (Metal Clad Switchgear)",
    category: "Switchgear",
    badges: 1,
  },
  {
    id: "dc-p2",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Beyond PowerONE",
    category: "Modular Power",
  },
  {
    id: "dc-p3",
    href: "",
    image: "/img/markets/solutions/product_ul_lv_swgr.png",
    title: "UL LV SWGR",
    category: "Switchgear",
  },
  {
    id: "dc-p4",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Beyond Cube DCIM",
    category: "DCIM",
    badges: 2,
  },
  {
    id: "dc-p5",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "High-Performance UPS",
    category: "UPS",
  },
  {
    id: "dc-p6",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "ESS PCS & Battery",
    category: "BESS",
  },
  {
    id: "dc-p7",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Gas Insulated Switchgear",
    category: "GIS",
  },
  {
    id: "dc-p8",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "HVAC Optimal Free Cooling",
    category: "Cooling",
  },
];
