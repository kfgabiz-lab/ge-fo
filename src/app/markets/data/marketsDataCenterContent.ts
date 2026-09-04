import type {
  BenefitItem,
  FaqItem,
  ProductItem,
  ReferenceItem,
  WhyItem,
} from "./marketsContent";

export const dataCenterHero = {
  subtitle: "Agile, modular power for the AI-driven era.",
  title: "Data Center",
  heroImage: "/img/markets/data-center/hero.webp",
  secondaryCta: {
    label: "Get the Whitepaper",
    href: "/docs/DataCenter.pdf",
    icon: "download" as const,
  },
};

export const dataCenterIntro = {
  titleLines: ["Powering the", "Next Generation of AI Data Centers"],
  text: "As Asia’s first and only provider of a full UL-certified switchgear line-up, LS ELECTRIC delivers the mission-critical components that power the world’s leading data centers. From hyperscale cloud environments to gigawatt-scale AI infrastructure, our field-proven technologies ensure seamless integration and strict local compliance. By supplying modular power systems and intelligent management platforms, we optimize individual site deployment, reducing overall installation time by 30%. From the high-voltage utility source to the server rack, we invest in a high-performance portfolio engineered to give next-generation data centers exactly what they need, when they need it.",
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
    image: "/img/markets/data-center/references/ref_01.webp?27",
    title: "AI Hyperscale Data Center Power Distribution Project",
    description:
      "LS ELECTRIC delivered an integrated power distribution solution for a large-scale AI hyperscale data center project in the United States.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "AI Hyperscale Data Center Power Distribution Project",
      images: ["/img/markets/data-center/references/ref_01.webp?27"],
      overview: [
        "LS ELECTRIC delivered an integrated power distribution solution for a large-scale AI hyperscale data center project in the United States.",
        "Facing an exceptionally aggressive construction schedule, the project required large volumes of critical electrical equipment to be engineered, manufactured, and delivered within a significantly shortened timeframe. LS ELECTRIC responded with its Quick Ship capabilities and integrated supply approach, accelerating engineering and production while closely coordinating procurement and logistics.",
        "Through streamlined project execution and flexible transportation strategies, LS ELECTRIC successfully supported the customer's demanding schedule, demonstrating its capability to deliver reliable power infrastructure for fast-track, large-scale data center projects.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "AI Hyperscale Data Center" },
        {
          label: "Scope of Work",
          lines: [
            "38kV Metal-Clad Switchgear",
            "38kV Unit Substations",
            "Distribution Transformers",
            "Low-Voltage Switchboards",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "dc-ref-2",
    href: "",
    image: "/img/markets/data-center/references/ref_02.webp?27",
    title: "Large-Scale AI Data Center Power Distribution Project",
    description:
      "LS ELECTRIC secured a major multi-million dollar supply contract with one of the world’s leading technology and cloud service companies for a large scale AI data center project in North America.",
    location: "North America",
    country: "",
    modal: {
      modalTitle: "Large-Scale AI Data Center Power Distribution Project",
      images: ["/img/markets/data-center/references/ref_02.webp?27"],
      overview: [
        "LS ELECTRIC secured a major multi-million dollar supply contract with one of the world's leading technology and cloud service companies for a large scale AI data center project in North America.",
        "LS ELECTRIC will provide highly reliable medium voltage power distribution solutions to support the intensive power demands and continuous operation of AI infrastructure. By leveraging an expanding North American production and service network, LS ELECTRIC will also enhance supply flexibility and significantly shorten delivery lead times to support the accelerated data center deployment.",
        "This project demonstrates LS ELECTRIC’s capability to support mission critical infrastructure for global technology leaders and reinforces its position as a trusted power solution partner for the growing AI data center market.",
      ],
      keyInfo: [
        { label: "Location", value: "North America" },
        { label: "Application", value: "AI Hyperscale Data Center" },
        {
          label: "Scope of Work",
          lines: [
            "Medium-Voltage Switchgear",
            "Medium-Voltage Circuit Breakers",
            "Power Distribution Systems",
            "Engineering & Technical Support",
            "Local Production & Delivery Support",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "dc-ref-3",
    href: "",
    image: "/img/markets/data-center/references/ref_03.webp?27",
    title: "Clean Energy Power Distribution Project",
    description:
      "LS ELECTRIC partnered with a leading North American clean energy technology provider to supply power distribution equipment supporting its rapidly growing data center business.",
    location: "North America",
    country: "",
    modal: {
      modalTitle: "Clean Energy Power Distribution Project",
      images: ["/img/markets/data-center/references/ref_03.webp?27"],
      overview: [
        "LS ELECTRIC partnered with a leading North American clean energy technology provider to supply power distribution equipment supporting its rapidly growing data center business.",
        "To meet demanding project schedules and recurring orders, LS ELECTRIC developed standardized switchboard designs and proactively secured critical components in advance. This streamlined engineering and production, significantly reduced lead times and enabled faster, more flexible delivery as customer demand increased.",
        "The project demonstrates LS ELECTRIC's ability to combine design standardization, strategic procurement, and local technical support to reliably support fast growing data center infrastructure.",
      ],
      keyInfo: [
        { label: "Location", value: "North America" },
        {
          label: "Application",
          value: "Clean Energy Solutions for Data Centers",
        },
        {
          label: "Scope of Work",
          lines: [
            "38kV Medium Voltage Switchgear",
            "UL891 Low Voltage Switchboards",
            "UL67 Low Voltage Panelboards",
          ],
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
    label: "Expedited installation time",
    value: "30",
    valueUnit: "%",
    valueSuffix: " Reduction",
    sublabel: "in construction lead times",
    description:
      'Our modular "Beyond PowerONE" solution streamlines engineering and installation, reducing construction lead times by up to 30% while maximizing space efficiency through compact design.',
  },
  {
    id: "monitoring",
    label: "Real-time monitoring",
    value: "1,000,000",
    valueSuffix: "+",
    sublabel: "tags per second for AI workloads",
    description:
      "From 800V DC architectures to AI-driven Data Center Infrastructure Management platforms, our intelligent solutions provide real-time monitoring and predictive maintenance to power the next generation of gigawatt-scale AI workloads.",
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
    image: "/img/markets/data-center/benefits/benefit_01.webp",
  },
  {
    id: "dc-b2",
    href: "",
    title: "Efficient Power Distribution",
    description:
      "The first and only UL-certified full-lineup supplier in Asia, ensuring full compliance with North American local regulations.",
    capabilities:
      "We provide a full lineup of UL-certified medium-voltage (MV) and low-voltage (LV) switchgear, along with energy-efficient cast resin transformers.",
    image: "/img/markets/data-center/benefits/benefit_02.webp",
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
    image: "/img/markets/data-center/benefits/benefit_03.webp",
  },
  {
    id: "dc-b4",
    href: "",
    title: "AI-Ready<br>Smart Automation",
    description:
      "Real-time monitoring and autonomous HVAC optimization through 3D digital twin visualization.",
    capabilities:
      "A next-generation platform (Beyond Cube) capable of processing one million data points per second, with AI-based predictive diagnostics.",
    image: "/img/markets/data-center/benefits/benefit_04.webp",
    reverse: true,
  },
];

export const dataCenterWhyItems: WhyItem[] = [
  {
    id: "dc-why-1",
    href: "",
    title: "Mission-Critical Reliability",
    description:
      "LS ELECTRIC delivers highly reliable power distribution, protection, and monitoring solutions that help ensure continuous uptime for hyperscale, colocation, and AI-driven data center environments.",
    icon: "/img/markets/data-center/why/why_01.svg",
  },
  {
    id: "dc-why-2",
    href: "",
    title: "AI-Ready Scalability",
    description:
      "From traditional facilities to next-generation AI data centers, LS ELECTRIC provides scalable electrical infrastructure designed to support growing power densities and future capacity expansion.",
    icon: "/img/markets/data-center/why/why_02.svg",
  },
  {
    id: "dc-why-3",
    href: "",
    title: "Integrated Energy Intelligence",
    description:
      "By combining power infrastructure with advanced monitoring and energy management platforms, LS ELECTRIC enables operators to improve efficiency, visibility, and operational control.",
    icon: "/img/markets/data-center/why/why_03.svg",
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
    href: "/product/metasol-ms",
    image: "/img/markets/solutions/product_mcsg.webp",
    title: "MCSG (Metal Clad Switchgear)",
    category: "Switchgear",
  },
  {
    id: "dc-p2",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Beyond PowerONE",
    category: "Modular Power",
  },
  {
    id: "dc-p3",
    href: "",
    image: "/img/markets/solutions/product_ul_lv_swgr.webp",
    title: "UL LV SWGR",
    category: "Switchgear",
  },
  {
    id: "dc-p4",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Beyond Cube DCIM",
    category: "DCIM",
    badges: 2,
  },
  {
    id: "dc-p5",
    href: "",
    image: "/img/main/product_01.webp",
    title: "High-Performance UPS",
    category: "UPS",
  },
  {
    id: "dc-p6",
    href: "",
    image: "/img/main/product_01.webp",
    title: "ESS PCS & Battery",
    category: "BESS",
  },
  {
    id: "dc-p7",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Gas Insulated Switchgear",
    category: "GIS",
  },
  {
    id: "dc-p8",
    href: "",
    image: "/img/main/product_01.webp",
    title: "HVAC Optimal Free Cooling",
    category: "Cooling",
  },
];
