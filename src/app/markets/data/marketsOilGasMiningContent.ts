import {
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
  heroImage: "/img/markets/oil-gas-mining/hero/hero.webp",
  secondaryCta: {
    label: "Get the Whitepaper",
    href: "/docs/Oil_Gas_Mining.pdf",
    icon: "download" as const,
  },
};

export const oilGasMiningIntro = {
  titleLines: [
    "Powering Critical Energy & ",
    "Resource Industries with ",
    "Robust and Intelligent Solutions",
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
    image: "/img/markets/oil-gas-mining/explore/img_petroleum.webp",
  },
  {
    id: "mining",
    label: "Metals & Mining",
    title: "Metals & Mining",
    description:
      "LS ELECTRIC provides robust electrical and automation solutions tailored for mining and metal processing environments. Designed to withstand extreme conditions, our systems ensure reliable operation, enhanced productivity, and reduced maintenance costs.",
    image: "/img/markets/oil-gas-mining/explore/img_mining.webp",
  },
  {
    id: "marine",
    label: "Marine",
    title: "Marine",
    description:
      "LS ELECTRIC offers compact, reliable, and high-performance electrical solutions for marine and offshore environments. Our solutions ensure stable power supply and safe operation under challenging maritime conditions.",
    image: "/img/markets/oil-gas-mining/explore/img_marine.webp",
  },
];

export const oilGasMiningReferences: ReferenceItem[] = [
  {
    id: "ogm-ref-1",
    href: "",
    image: "/img/markets/oil-gas-mining/references/ref_01.webp",
    title: "Oil Production Pump Jack Automation",
    description:
      "LS ELECTRIC provides advanced Pump Jack automation solutions for oil production applications using its iS7 Variable Frequency Drive. Through firmware-based regenerative energy avoidance and optional iRU regenerative units, the solution enhances production reliability, optimizes energy efficiency, and ensures stable operation in demanding oil field environments.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "Oil Production Pump Jack Automation",
      images: ["/img/markets/oil-gas-mining/references/ref_01.webp"],
      overview: [
        "LS ELECTRIC provides advanced Pump Jack automation solutions for oil production applications using its iS7 Variable Frequency Drive. Through firmware-based regenerative energy avoidance and optional iRU regenerative units, the solution enhances production reliability, optimizes energy efficiency, and ensures stable operation in demanding oil field environments.\n\n- Constant production speed\n- Improved energy efficiency\n- Reduced wasted regenerative energy\n- Higher production stability",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        {
          label: "Application",
          lines: [
            "Pump Jack Automation",
            "Artificial Lift Systems",
            "Oil Well Production Control",
            "Motor Drive Control",
            "Regenerative Energy Management",
          ],
        },
        {
          label: "Scope of Work",
          value:
            "VFD(iS7), Regenerative Energy Avoidance Control, iRU Regenerative Unit",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ogm-ref-2",
    href: "",
    image: "/img/markets/oil-gas-mining/references/ref_02.webp",
    title: "220/33kV AIS Turnkey Substation",
    description:
      "To strengthen Sri Lanka's power transmission network, LS ELECTRIC delivered a turnkey EPC solution for a 220/33kV AIS substation in Mannar. The project supports reliable power distribution through an integrated substation equipped with high-voltage switchgear, transformers, and advanced automation systems.",
    location: "Sri Lanka",
    country: "",
    modal: {
      modalTitle: "220/33kV AIS Turnkey Substation",
      images: ["/img/markets/oil-gas-mining/references/ref_02.webp"],
      overview: [
        "To strengthen Sri Lanka's power transmission network, LS ELECTRIC delivered a turnkey EPC solution for a 220/33kV AIS substation in Mannar. The project supports reliable power distribution through an integrated substation equipped with high-voltage switchgear, transformers, and advanced automation systems.",
        "LS ELECTRIC provided end-to-end engineering, procurement, and construction services, supplying major substation equipment including power transformers, AIS, GIS, protection and control systems, and the Substation Automation System (SAS). The successful execution established LS ELECTRIC's presence in the Sri Lankan power market and demonstrated its capabilities in large-scale transmission infrastructure projects.",
      ],
      keyInfo: [
        { label: "Location", value: "Sri Lanka" },
        { label: "Application", value: "Power Transmission Substation" },
        {
          label: "Scope of Work",
          value:
            "220/33kV 167MVA power transformers, 220kV AIS, 33kV GIS, Relay Control Panel (RCP), Substation Automation System (SAS)",
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ogm-ref-3",
    href: "",
    image: "/img/markets/oil-gas-mining/references/ref_03.webp",
    title: "Large-scale EV Battery Manufacturing Facility",
    description:
      "Following the successful delivery of the first phase of a major EV battery manufacturing facility in the United States, LS ELECTRIC secured the second-phase project to support the expansion of one of North America's largest battery production sites. The project required a reliable and integrated power distribution system to ensure stable operation of high-capacity manufacturing lines.",
    location: "United States",
    country: "",
    modal: {
      modalTitle: "Large-scale EV Battery Manufacturing Facility",
      images: ["/img/markets/oil-gas-mining/references/ref_03.webp"],
      overview: [
        "Following the successful delivery of the first phase of a major EV battery manufacturing facility in the United States, LS ELECTRIC secured the second-phase project to support the expansion of one of North America's largest battery production sites. The project required a reliable and integrated power distribution system to ensure stable operation of high-capacity manufacturing lines.",
        "LS ELECTRIC supplied a comprehensive electrical package, including medium-voltage switchgear, low-voltage switchboards, cast resin transformers, UPS systems, and busducts. The project further demonstrated the company's ability to deliver integrated power infrastructure solutions for large-scale battery manufacturing facilities and strengthened its position in the rapidly growing EV battery industry.",
      ],
      keyInfo: [
        { label: "Location", value: "United States" },
        { label: "Application", value: "Industrial Process Plant" },
        {
          label: "Scope of Work",
          lines: [
            "MV switchgears",
            "LV switchboards",
            "Cast resin transformers",
            "UPS",
            "Busducts",
            "Panel boards",
            "VFD(Variable Frequency Drive)",
          ],
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
    image: "/img/markets/oil-gas-mining/benefits/benefit_01.webp",
  },
  {
    id: "ogm-b2",
    href: "",
    title: "Maximized Reliability & Continuous Uptime",
    description:
      "Mission-critical operations demand uninterrupted power. LS ELECTRIC delivers highly reliable power distribution and protection systems that ensure stable operation and minimize unplanned downtime.",
    capabilities:
      "Robust switchgear, advanced protection relays, condition monitoring, and fault detection systems for stable, continuous operation",
    image: "/img/markets/oil-gas-mining/benefits/benefit_02.webp",
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
    image: "/img/markets/oil-gas-mining/benefits/benefit_03.webp",
  },
  {
    id: "ogm-b4",
    href: "",
    title: "Integrated Automation & Smart Monitoring",
    description:
      "From process automation to real-time monitoring, LS ELECTRIC enables data-driven operations that enhance efficiency, improve visibility, and support predictive maintenance across complex industrial processes.",
    capabilities:
      "PLCs, drives, SCADA systems, real-time monitoring, and integrated automation platforms for optimized and intelligent operations",
    image: "/img/markets/oil-gas-mining/benefits/benefit_04.webp",
    reverse: true,
  },
];

export const oilGasMiningWhyItems: WhyItem[] = [
  {
    id: "ogm-why-1",
    href: "",
    title: "Heavy-Duty Reliability",
    description:
      "LS ELECTRIC's rugged electrical infrastructure solutions are engineered to withstand harsh operating conditions while maintaining safe and dependable performance.",
    icon: "/img/markets/oil-gas-mining/why/why_01.svg",
  },
  {
    id: "ogm-why-2",
    href: "",
    title: "Energy-Efficient Process Control",
    description:
      "Intelligent automation and motor control technologies help optimize processes, reduce energy consumption, and improve overall operational efficiency.",
    icon: "/img/markets/oil-gas-mining/why/why_02.svg",
  },
  {
    id: "ogm-why-3",
    href: "",
    title: "Unified Power & Automation",
    description:
      "A fully integrated portfolio of electrical and automation solutions simplifies project execution while improving plant-wide visibility and control.",
    icon: "/img/markets/oil-gas-mining/why/why_03.svg",
  },
];

export const oilGasMiningProducts: ProductItem[] = [
  {
    id: "ogm-p1",
    href: "/product/metasol-ms",
    image: "/img/markets/oil-gas-mining/products/product_01.webp",
    title: "Metasol MS",
    category: "Metasol Contactor & Overload Relay",
  },
  {
    id: "ogm-p2",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_02.webp",
    title: "Miniature circuit breaker",
    category: "The Global Standard",
  },
  {
    id: "ogm-p3",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_03.webp",
    title: "Metasol MMS",
    category: "Metasol Contactor & Overload Relay",
    badges: 2,
  },
  {
    id: "ogm-p4",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_04.webp",
    title: "Susol UL MCCB",
    category: "Susol UL Molded Case Circuit Breaker",
  },
  {
    id: "ogm-p5",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_05.webp",
    title: "DMPi",
    category: "Intelligent Digital Motor Protection Relay",
    badges: 2,
  },
  {
    id: "ogm-p6",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_06.webp",
    title: "IMP",
    category: "Intelligent Motor Protection Relay",
  },
  {
    id: "ogm-p7",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_07.webp",
    title: "MMP",
    category: "Small Electronic Motor Protection Relay",
  },
  {
    id: "ogm-p8",
    href: "",
    image: "/img/markets/oil-gas-mining/products/product_08.webp",
    title: "GMP",
    category: "Electronic Motor Protection Relay",
  },
];
