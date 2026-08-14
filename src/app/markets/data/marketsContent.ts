export type IndustryTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  /** Explore panel CTA (예: power-grid BESS · Contact + Copy Email) */
  cta?: {
    title: string;
    email: string;
    /** PC — Figma 8549:104555 */
    copyLabel?: string;
    /** MO — Figma 8549:100751 */
    copyLabelMobile?: string;
  };
};

export type BenefitItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  capabilities: string;
  image: string;
  reverse?: boolean;
};

export const marketsBenefitImages = {
  benefit01: "/img/markets/benefits/benefit_01.webp",
  benefit02: "/img/markets/benefits/benefit_02.webp",
  benefit03: "/img/markets/benefits/benefit_03.webp",
  benefit04: "/img/markets/benefits/benefit_04.webp",
  benefit05: "/img/markets/benefits/benefit_05.webp",
  benefit06: "/img/markets/benefits/benefit_06.webp",
  benefit07: "/img/markets/benefits/benefit_07.webp",
  benefit08: "/img/markets/benefits/benefit_08.webp",
  benefit09: "/img/markets/benefits/benefit_09.webp",
  benefit10: "/img/markets/benefits/benefit_10.webp",
} as const;

export const commercialResidentialHero = {
  subtitle: "Smart & Sustainable Building Infrastructure",
  title: "Commercial & Residential",
  titleLines: ["Commercial", "& Residential"],
  heroImage: "/img/markets/commercial-residential/hero/hero.webp",
  secondaryCta: {
    label: "Get the Whitepaper",
    href: "",
    icon: "download" as const,
  },
};

export type WhyItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  icon: string;
};

export type ReferenceKeyInfoRow = {
  label: string;
  value?: string;
  lines?: string[];
};

export type ReferenceModalContent = {
  modalTitle?: string;
  images: string[];
  overview: string[];
  keyInfo: ReferenceKeyInfoRow[];
  ctaLabel: string;
  ctaHref: string;
};

export type ReferenceItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  description: string;
  location: string;
  country: string;
  modal: ReferenceModalContent;
};

export type ProductItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  category: string;
  badge?: boolean;
  badges?: 1 | 2;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const industryTabs: IndustryTab[] = [
  {
    id: "hotels",
    label: "Hotels",
    title: "Hotels",
    description:
      "LS ELECTRIC delivers reliable and energy-efficient power infrastructure for hotels, ensuring uninterrupted operations and enhanced guest comfort. With integrated solutions including low-voltage systems, smart distribution, and BEMS, hotels can optimize energy usage, reduce operational costs, and maintain a safe and comfortable environment.",
    image: "/img/markets/explore/img_hotels.webp",
  },
  {
    id: "retail",
    label: "Retail Stores",
    title: "Retail Stores",
    description:
      "For retail environments, LS ELECTRIC provides stable power distribution and smart energy management to support seamless store operations. Its solutions enable efficient lighting and HVAC control, reduce energy consumption, and enhance operational efficiency across single stores and multi-site retail chains.",
    image: "/img/markets/explore/img_retail.webp",
  },
  {
    id: "logistics",
    label: "Logistics",
    title: "Logistics",
    description:
      "LS ELECTRIC supports logistics facilities with robust power systems and intelligent monitoring solutions to ensure continuous and efficient operations. Through real-time energy management and reliable power infrastructure, warehouses and distribution centers can improve operational uptime and reduce maintenance risks.",
    image: "/img/markets/explore/img_logistics.webp",
  },
  {
    id: "commercial",
    label: "Commercial Buildings",
    title: "Commercial Buildings",
    description:
      "LS ELECTRIC offers integrated building power solutions combining switchgear, smart electrical rooms, and BEMS for optimized building performance. These solutions enhance energy efficiency, ensure power reliability, and enable data-driven building operations for offices, data centers, and large commercial facilities.",
    image: "/img/markets/explore/img_commercial.webp",
  },
  {
    id: "residential",
    label: "Residential",
    title: "Residential",
    description:
      "For residential environments, LS ELECTRIC provides safe and efficient electrical systems including low-voltage protection devices and smart energy solutions. These solutions enhance electrical safety, improve energy efficiency, and support the development of smart and sustainable living environments.",
    image: "/img/markets/explore/img_residential.webp",
  },
];

export const benefits: BenefitItem[] = [
  {
    id: "1",
    href: "",
    title: "Reliable Power <br> Infrastructure",
    description:
      "Ensures stable and secure power supply, minimizing downtime and protecting critical building operations.",
    capabilities:
      "Low-voltage protection devices, switchgear, transformers, and integrated power distribution solutions",
    image: "/img/markets/img_benefit_01.webp",
  },
  {
    id: "2",
    href: "",
    title: "Energy Efficiency <br> Optimization",
    description:
      "Optimizes energy consumption, reducing operating costs while improving overall energy efficiency.",
    capabilities: "BEMS, power monitoring systems, and data-driven energy analytics",
    image: "/img/markets/img_benefit_02.webp",
    reverse: true,
  },
  {
    id: "3",
    href: "",
    title: "Smart Building <br> Operation",
    description:
      "Enables real-time monitoring and data-driven operations, improving facility management and maintenance efficiency.",
    capabilities:
      "Smart electrical room solutions, digital monitoring, and integrated power management platforms",
    image: "/img/markets/img_benefit_03.webp",
  },
  {
    id: "4",
    href: "",
    title: "Sustainable & <br> Future-Ready Buildings",
    description:
      "Supports carbon reduction and ESG goals while enabling sustainable and future-ready building environments.",
    capabilities: "Renewable energy integration (PV), ESS, and smart energy solutions",
    image: "/img/markets/img_benefit_04.webp",
    reverse: true,
  },
];

export const whyItems: WhyItem[] = [
  {
    id: "why-1",
    href: "",
    title: "Technological Innovation",
    description:
      "Low-voltage protection devices, power distribution systems, smart electrical rooms, BEMS, and renewable energy solutions",
    icon: "/img/markets/img_why_01.webp",
  },
  {
    id: "why-2",
    href: "",
    title: "Operational Optimization",
    description:
      "Optimized power consumption, reduced operating costs, and improved energy efficiency across building facilities",
    icon: "/img/markets/img_why_02.webp",
  },
  {
    id: "why-3",
    href: "",
    title: "Proven Reliability",
    description:
      "Highly reliable and safe power infrastructure tailored to the demanding requirements of commercial buildings",
    icon: "/img/markets/img_why_03.webp",
  },
];

export const references: ReferenceItem[] = [
  {
    id: "ref-1",
    href: "",
    image: "/img/markets/markets_ref_01.webp",
    title: "Global Commercial Tower",
    description:
      "LS ELECTRIC ultimately succeeded in winning the contract to supply EHV switchgears, LV switchgears",
     location: "Ho Chi Minh",
     country: "Vietnam",
    modal: {
      images: [
        "/img/markets/markets_ref_01.webp",
        "/img/markets/markets_ref_02.webp",
        "/img/markets/img_benefit_01.webp",
      ],
      overview: [
        "LS ELECTRIC ultimately succeeded in winning the contract to supply EHV switchgears and LV switchgears for a landmark commercial tower in Ho Chi Minh City.",
        "The project demonstrates our capability to deliver reliable power distribution infrastructure for large-scale commercial developments in emerging markets.",
      ],
      keyInfo: [
        { label: "City", value: "Ho Chi Minh" },
        { label: "Country", value: "Vietnam" },
        { label: "Customer", value: "Global Commercial Tower JV" },
        { label: "Year of Completion", value: "2020" },
        {
          label: "Scope of Work",
          lines: [
            "EHV switchgears and LV switchgears",
            "Power distribution panels and busway systems",
            "Building energy monitoring interface",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ref-2",
    href: "",
    image: "/img/markets/markets_ref_02.webp",
    title: "LG USA New Headquarters",
    description:
      "As such, we supplied various equipment such as 38kV MV switchgears, MV transformers, UL 891 switchgears",
     location: "New Jersey",
     country: "United States",
    modal: {
      modalTitle: "LG Electronics USA New Headquarters",
      images: [
        "/img/markets/markets_ref_02.webp",
        "/img/markets/markets_ref_03.webp",
        "/img/markets/markets_ref_01.webp",
        "/img/markets/img_benefit_02.webp",
      ],
      overview: [
        "South Korea's LG Electronics is a leading global electronics company standing toe-to-toe with Samsung Electronics. Also, it has a strong partnership with Apple Inc., and has built its new headquarters at 111 Sylvan Ave. in Englewood Cliffs, New Jersey, while investing a total of USD 300 million into constructing the buildings for a new business campus.",
        "It is evaluated that this place will span 110,000 square meters and the number of employees onsite will tally more than 1,000 people. LG Electronics USA, Inc., based in Englewood Cliffs, N.J., is the North American subsidiary of LG Electronics, Inc., a leading global technological company worth USD 48 billion in the field of home appliances, consumer electronics, and mobile communications.",
        "With LG Electronics' goal for setting up an eco-friendly factory, it plans to install PV(Photovoltaics) panels and high-efficiency electric equipment, while planting 1,500 trees. LS ELECTRIC has been designated as a partner to provide power electric systems based on our proven safety and reliability. As such, we supplied various equipment such as 38kV MV switchgears, MV transformers, UL 891 switchgears, power factor correction units, LV transformers, and UL 67 panel boards. The success of this project heralds our company as global solution provider in manufacturing factory applications.",
      ],
      keyInfo: [
        { label: "City", value: "New Jersey" },
        { label: "Country", value: "New Jersey" },
        { label: "Customer", value: "LG Electronics USA" },
        { label: "Year of Completion", value: "2021" },
        {
          label: "Scope of Work",
          lines: [
            "38kV MV switchgears MV transformers UL 891",
            "switchgears Power factor correction units LV transformers",
            "UL 67 Panel boards",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
  {
    id: "ref-3",
    href: "",
    image: "/img/markets/markets_ref_03.webp",
    title: "KPX Energy Management System",
    description:
      "Owing to the next-generation EMS constructed at the operators can now optimally manage power generation, analyze systems",
     location: "Naju",
     country: "South Korea",
    modal: {
      images: [
        "/img/markets/markets_ref_03.webp",
        "/img/markets/markets_ref_01.webp",
        "/img/markets/img_benefit_03.webp",
      ],
      overview: [
        "Owing to the next-generation EMS constructed at the site, operators can now optimally manage power generation and analyze systems in real time.",
        "LS ELECTRIC delivered an integrated energy management solution that strengthens grid visibility and operational efficiency for Korea Power Exchange.",
      ],
      keyInfo: [
        { label: "City", value: "Naju" },
        { label: "Country", value: "South Korea" },
        { label: "Customer", value: "Korea Power Exchange (KPX)" },
        { label: "Year of Completion", value: "2019" },
        {
          label: "Scope of Work",
          lines: [
            "Next-generation energy management system (EMS)",
            "Real-time power generation monitoring and analytics",
            "Grid operations control room integration",
          ],
        },
      ],
      ctaLabel: "Discuss your Project",
      ctaHref: "/support/contact-us",
    },
  },
];

export const products: ProductItem[] = [
  {
    id: "mp-1",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Metasol MS",
    category: "Contactor",
  },
  {
    id: "mp-2",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Susol ACB",
    category: "Breaker",
  },
  {
    id: "mp-3",
    href: "",
    image: "/img/main/product_01.webp",
    title: "XGT PLC",
    category: "Automation",
    badges: 1,
  },
  {
    id: "mp-4",
    href: "",
    image: "/img/main/product_01.webp",
    title: "iG5A Drive",
    category: "Drive",
    badges: 2,
  },
  {
    id: "mp-5",
    href: "",
    image: "/img/main/product_01.webp",
    title: "BEMS Panel",
    category: "BEMS",
  },
  {
    id: "mp-6",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Smart Meter",
    category: "Metering",
  },
  {
    id: "mp-7",
    href: "",
    image: "/img/main/product_01.webp",
    title: "ESS PCS",
    category: "Energy Storage",
  },
  {
    id: "mp-8",
    href: "",
    image: "/img/main/product_01.webp",
    title: "Solar Inverter",
    category: "Renewables",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "What building types does LS ELECTRIC support?",
    answer:
      "We provide solutions for commercial offices, retail, hospitality, residential complexes, and mixed-use developments with integrated power and automation systems.",
  },
  {
    question: "How does BEMS integration work with existing systems?",
    answer:
      "Our BEMS platforms connect to existing meters, HVAC, and electrical panels through standard protocols, enabling centralized monitoring without full system replacement.",
  },
  {
    question: "Can renewable energy be integrated into existing buildings?",
    answer:
      "Yes. We offer PV, ESS, and smart inverter solutions designed to integrate with current distribution infrastructure while supporting ESG and sustainability goals.",
  },
];
