import {
  marketsBenefitImages,
  type BenefitItem,
  type IndustryTab,
  type ProductItem,
  type ReferenceItem,
  type WhyItem,
} from "./marketsContent";

export const oilGasMiningHero = {
  subtitle:
    "Reliable, Safe & High-Performance Solutions for Harsh Industrial Environments",
  title: "Oil & Gas, Mining Industries",
  heroImage: "/img/markets/oil-gas-mining/hero/hero.jpg",
};

export const oilGasMiningIntro = {
  titleLines: [
    "Powering Critical Energy &",
    "Resource Industries with", "Robust and Intelligent Solutions",
  ],
  text: "LS ELECTRIC supports critical industries, including Petroleum & Chemical Refineries, Metals & Mining, and Marine, with reliable power distribution and advanced automation solutions. Designed for harsh and hazardous environments, our portfolio ensures safety, system stability, and continuous uptime. From explosion-proof systems and heavy-duty switchgear to integrated automation and monitoring platforms, we improve efficiency, reduce downtime, and enable safe, sustainable operations across complex industrial processes.",
};

export const oilGasMiningIndustryTabs: IndustryTab[] = [
  {
    id: "petroleum",
    label: "Petroleum & Chemical Refineries",
    title: "Petroleum & Chemical Refineries",
    description:
      "LS ELECTRIC provides reliable power and automation solutions for refineries and chemical plants, ensuring safe, continuous operations while enhancing stability, reducing downtime, and improving overall efficiency.",
    image: "/img/markets/oil-gas-mining/explore/img_petroleum.jpg",
  },
  {
    id: "mining",
    label: "Metals & Mining",
    title: "Metals & Mining",
    description:
      "LS ELECTRIC provides robust electrical and automation solutions tailored for mining and metal processing environments. Designed to withstand extreme conditions, our systems ensure reliable operation, enhanced productivity, and reduced maintenance costs.",
    image: "/img/markets/oil-gas-mining/explore/img_mining.jpg",
  },
  {
    id: "marine",
    label: "Marine",
    title: "Marine",
    description:
      "LS ELECTRIC offers compact, reliable, and high-performance electrical solutions for marine and offshore environments. Our solutions ensure stable power supply and safe operation under challenging maritime conditions.",
    image: "/img/markets/oil-gas-mining/explore/img_marine.jpg",
  },
];

export const oilGasMiningReferences: ReferenceItem[] = [
  {
    id: "ogm-ref-1",
    href: "",
    image: "/img/markets/oil-gas-mining/references/ref_01.jpg",
    title: "Lotte Hanoi Mall",
    description:
      "LS ELECTRIC ultimately succeeded in winning the contract to supply EHV switchgears, LV switchgears, and integrated power distribution for this large-scale commercial development.",
    location: "Vietnam",
    country: "",
    modal: {
      modalTitle: "Lotte Hanoi Mall",
      images: ["/img/markets/oil-gas-mining/references/ref_01.jpg"],
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
    id: "ogm-ref-2",
    href: "",
    image: "/img/markets/oil-gas-mining/references/ref_02.jpg",
    title: "LG USA New Headquarters",
    description:
      "As such, we supplied various equipment such as 38kV MV switchgears, MV transformers, UL 891 switchgears, and coordinated low-voltage distribution for the new headquarters campus.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "LG USA New Headquarters",
      images: ["/img/markets/oil-gas-mining/references/ref_02.jpg"],
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
    id: "ogm-ref-3",
    href: "",
    image: "/img/markets/oil-gas-mining/references/ref_03.jpg",
    title: "KPX Energy Management System",
    description:
      "Owing to the next-generation EMS constructed at the site, operators can now optimally manage power generation, analyze systems, and improve grid-wide operational visibility.",
    location: "South Korea",
    country: "",
    modal: {
      modalTitle: "KPX Energy Management System",
      images: ["/img/markets/oil-gas-mining/references/ref_03.jpg"],
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

export const oilGasMiningBenefits: BenefitItem[] = [
  {
    id: "ogm-b1",
    href: "",
    title: "Hazardous Environment Safety & Compliance",
    description:
      "Engineered for oil, gas, and mining sites, LS ELECTRIC solutions are designed to operate safely in explosive and high-risk environments, ensuring compliance with global standards while protecting personnel and assets.",
    capabilities:
      "Explosion-proof compatible systems, high-reliability switchgear, protection devices, and solutions designed for hazardous and high-risk industrial zones",
    image: marketsBenefitImages.benefit05,
  },
  {
    id: "ogm-b2",
    href: "",
    title: "Maximized Reliability & Continuous Uptime",
    description:
      "Mission-critical operations demand uninterrupted power. LS ELECTRIC delivers highly reliable power distribution and protection systems that ensure stable operation and minimize unplanned downtime.",
    capabilities:
      "Robust switchgear, advanced protection relays, condition monitoring, and fault detection systems for stable, continuous operation",
    image: marketsBenefitImages.benefit06,
    reverse: true,
  },
  {
    id: "ogm-b3",
    href: "",
    title: "Heavy-Duty Performance in Extreme Conditions",
    description:
      "Built to withstand harsh environments such as heat, dust, vibration, and corrosion, LS ELECTRIC products ensure long-term durability and consistent performance in mining sites, refineries, and offshore platforms.",
    capabilities:
      "Durable equipment design, high-performance drives, corrosion-resistant systems, and solutions optimized for extreme industrial conditions",
    image: marketsBenefitImages.benefit07,
  },
  {
    id: "ogm-b4",
    href: "",
    title: "Integrated Automation & Smart Monitoring",
    description:
      "From process automation to real-time monitoring, LS ELECTRIC enables data-driven operations that enhance efficiency, improve visibility, and support predictive maintenance across complex industrial processes.",
    capabilities:
      "PLCs, drives, SCADA systems, real-time monitoring, and integrated automation platforms for optimized and intelligent operations",
    image: marketsBenefitImages.benefit08,
    reverse: true,
  },
];

export const oilGasMiningWhyItems: WhyItem[] = [
  {
    id: "ogm-why-1",
    href: "",
    title: "Technological Innovation",
    description:
      "Low-voltage protection devices, power distribution systems, smart electrical rooms, BEMS, and renewable energy solutions",
    icon: "/img/markets/img_why_01.svg",
  },
  {
    id: "ogm-why-2",
    href: "",
    title: "Operational Optimization",
    description:
      "Optimized power consumption, reduced operating costs, and improved energy efficiency across building facilities",
    icon: "/img/markets/img_why_02.svg",
  },
  {
    id: "ogm-why-3",
    href: "",
    title: "Proven Reliability",
    description:
      "Highly reliable and safe power infrastructure tailored to the demanding requirements of commercial buildings",
    icon: "/img/markets/img_why_03.svg",
  },
];

export const oilGasMiningProducts: ProductItem[] = [
  {
    id: "ogm-p1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/img/markets/oil-gas-mining/products/product_01.jpg",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "ogm-p2",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_02.jpg",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "ogm-p3",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_03.jpg",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "ogm-p4",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_04.jpg",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "ogm-p5",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_05.jpg",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "ogm-p6",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_06.jpg",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "ogm-p7",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_07.jpg",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "ogm-p8",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_08.jpg",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
