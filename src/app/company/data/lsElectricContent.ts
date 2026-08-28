const IMG = "/img/company/ls-electric";

export type LsElectricHighlightStat = {
  id: string;
  heading: string;
  headingLines?: string[];
  label: string;
  prefix?: string;
  value: string;
  suffix?: string;
  suffixSize?: "large" | "medium";
};

export type LsElectricBusinessCard = {
  id: string;
  title: string;
  image: string;
  items: string[];
  gradient?: "bottom" | "top";
};

export type LsElectricGlobalStat = {
  id: string;
  label: string;
  value: string;
  unit: string;
};

export type LsElectricPttCard = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
};

export type LsElectricRndItem = {
  id: string;
  number: number;
  title: string;
  description: string;
};

export type LsElectricHistoryEvent = {
  date: string;
  text: string;
};

export type LsElectricHistoryEra = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  period: string;
  align: "left" | "right";
  events: LsElectricHistoryEvent[];
};

export const lsElectricPageTitle = {
  title: "LS ELECTRIC",
  description:
    "Advancing electrification, automation, and energy systems across the world",
};

export const lsElectricIntro = {
  heroImage: `${IMG}/intro-hero.webp?v=1`,
  heroImageMobile: `${IMG}/intro-hero-mo.webp?v=1`,
  headlineLines: ["Smart Power & Automation,", "Built for Performance"],
  paragraphs: [
    "LS ELECTRIC delivers integrated power, automation, and digital solutions. We help industrial and infrastructure operators improve efficiency, reliability, and resilience. From system design to optimization, LS ELECTRIC supports the full power-system lifecycle.",
    "Our 4,400+ employees and nine affiliates are committed to advancing electrification and digital transformation",
  ],
};

export const lsElectricHighlights = {
  title: "2025 Highlights",
  ctaLabel: "View IR infomation",
  ctaHref: "https://www.ls-electric.com/about-us/investor-relations/ir-materials",
  bgImage: `${IMG}/highlights-bg.webp?1`,
  bgImageMo: `${IMG}/highlights-bg-mo.webp?1`,
  footnote: "*Financial figures in 2025",
  stats: [
    {
      id: "growth",
      heading: "Sustained global growth",
      headingLines: ["Sustained", "global growth"],
      label: "Revenues",
      prefix: "$",
      value: "3.5",
      suffix: "B",
      suffixSize: "large",
    },
    {
      id: "performance",
      heading: "Strong financial performance",
      label: "Operation Income",
      prefix: "$",
      value: "300",
      suffix: "M",
      suffixSize: "large",
    },
    {
      id: "innovation",
      heading: "Continuous innovation",
      label: "R&D investment",
      prefix: "$",
      value: "104",
      suffix: "M",
      suffixSize: "large",
    },
    {
      id: "efficiency",
      heading: "Industry-leading efficiency",
      headingLines: ["Industry-", "leading efficiency"],
      label: "1Q Operating Margin",
      value: "45",
      suffix: "%",
      suffixSize: "medium",
    },
  ] satisfies LsElectricHighlightStat[],
};

export const lsElectricBusiness = {
  title: "Our Business",
  description:
    "End-to-end power infrastructure, smart energy, and automation solutions.",
  cards: [
    {
      id: "power",
      title: "Power Solution",
      image: `${IMG}/business-power.webp`,
      items: ["Power Transmission", "Power Distribution"],
      gradient: "bottom",
    },
    {
      id: "energy",
      title: "Smart Energy Solution",
      image: `${IMG}/business-energy.webp`,
      items: ["Photovoltaic (PV)", "Energy Storage System (ESS)", "Microgrid"],
      gradient: "bottom",
    },
    {
      id: "automation",
      title: "Automation Solution",
      image: `${IMG}/business-automation.webp`,
      items: ["PLC", "Servo", "Drive", "HMI"],
      gradient: "top",
    },
    {
      id: "railway",
      title: "Railway Solution",
      image: `${IMG}/business-railway.webp`,
      items: ["Railway Signaling", "Railway Power Supply"],
      gradient: "bottom",
    },
  ] satisfies LsElectricBusinessCard[],
};

export const lsElectricGlobal = {
  title: "Global Network",
  description:
    "LS ELECTRIC builds market-specific plans to expand its global presence. We strengthen local operations and tailor power, automation, and energy solutions to each market.",
  bgTexture: `${IMG}/global-bg.webp`,
  mapImage: `${IMG}/global-map.webp`,
  stats: [
    { id: "network", label: "Global Network", value: "14", unit: "Countries" },
    { id: "production", label: "Production Corp", value: "7", unit: "cities" },
    { id: "sales", label: "Sales Corp", value: "7", unit: "cities" },
    {
      id: "branch",
      label: "Branch & Holding",
      value: "19",
      unit: "cities",
    },
  ] satisfies LsElectricGlobalStat[],
};

export const lsElectricPtt = {
  title: "Power Testing & Technology Institute (PT&T)",
  description:
    "PT&T advances reliable energy systems for future generations. Rigorous testing validates product and system performance, quality, and certification readiness.",
  cards: [
    {
      id: "infrastructure",
      image: `${IMG}/ptt-01.webp`,
      title: "Test Infrastructure",
      subtitle: "One of the World's Top Six Power Testing Laboratories",
      description:
        "PT&T is recognized among the world's top six testing laboratories. Its infrastructure includes 4,000 MVA-class capacity and advanced DC testing.",
    },
    {
      id: "talent",
      image: `${IMG}/ptt-02.webp`,
      title: "Talent & Expertise",
      subtitle: "IEC Standards & Compliance Expertise",
      description:
        "PT&T advances research on evolving IEC standards and testing regulations through specialized engineering expertise.",
    },
    {
      id: "excellence",
      image: `${IMG}/ptt-03.webp`,
      title: "Operational Excellence",
      subtitle: "Trusted Global Testing & Certification",
      description:
        "As an accredited institution, PT&T operates under ISO/IEC 17025 to provide trusted testing and certification services.",
    },
  ] satisfies LsElectricPttCard[],
};

export const lsElectricRnd = {
  title: "R&D Center",
  description:
    "Guided by our 'Futuring Smart Energy' mission, LS ELECTRIC operates dedicated research institutes for energy and automation. These institutes strengthen quality and technology development in both fields. Led by the ESG/Vision Management CVO, the AX Sector applies artificial intelligence, machine learning, and big data to advance business capabilities. This work supports LS ELECTRIC's global market position and long-term competitiveness.",
  heroImage: `${IMG}/rnd-hero.webp`,
  items: [
    {
      id: "tech-map",
      number: 1,
      title: "Strengthen Technology Expertise Through the Technology Map",
      description:
        "The Technology Map assesses technology and talent levels. It guides development and management against LS ELECTRIC business goals.",
    },
    {
      id: "development",
      number: 2,
      title: "Advanced Development System",
      description:
        "Driving smarter innovation through advanced and reliable R&D systems.",
    },
    {
      id: "scouting",
      number: 3,
      title: "Technology Scouting",
      description:
        "Dedicated technology organizations strengthen LS ELECTRIC expertise. The R&D STAR Partners™ program identifies qualified technology partners.",
    },
    {
      id: "awards",
      number: 4,
      title: "Recognizing R&D Professionals",
      description:
        "The annual Best R&D Award recognizes outstanding projects. The first-prize project is submitted to the LS Group Tech Fair for enterprise-wide knowledge sharing.",
    },
  ] satisfies LsElectricRndItem[],
};

export const lsElectricHistory = {
  title: "LS ELECTRIC History",
  description:
    "Since 1974, LS ELECTRIC has advanced power and automation solutions globally.",
  eras: [
    {
      id: "beginning",
      title: "Era of Foundation",
      subtitle: "We Pioneer the Power and Automation industries",
      image: `${IMG}/history-beginning.webp`,
      period: "1974 ~ 1995",
      align: "left",
      events: [
        {
          date: "1974.06",
          text: "Established Goldstar Instrument & Electric Co., Ltd.",
        },
        { date: "1987.03", text: "Renamed to Goldstar Industrial Systems Co., Ltd." },
        { date: "1995.02", text: "Renamed to LG Industrial Systems Co., Ltd." },
      ],
    },
    {
      id: "challenge",
      title: "Era of Challenge",
      subtitle: "We Become the Leader in Power and Automation Sectors",
      image: `${IMG}/history-challenge.webp`,
      period: "1996 ~ 2007",
      align: "right",
      events: [
        {
          date: "1997.06",
          text: "Established a Overseas Subsidiary in Hanoi, Vietnam",
        },
        {
          date: "2000.09",
          text: "Completed construction of Power Testing & Technology Institute (PT&T)",
        },
        { date: "2007.11", text: "Awarded the Korean Quality Grand Award" },
      ],
    },
    {
      id: "growth",
      title: "Era of Growth and Innovation",
      subtitle: "We Takeoff as a Global Leader",
      image: `${IMG}/history-growth.webp`,
      period: "2008 ~ 2014",
      align: "left",
      events: [
        {
          date: "2009.10",
          text: "Established an Overseas Subsidiary in Amsterdam, Netherlands",
        },
        {
          date: "2011.11",
          text: "Awarded the Top 100 Global Innovators by Thompson Reuters",
        },
        {
          date: "2013.11",
          text: "Awarded the Grand Prize at the 39th National Quality Management convention",
        },
      ],
    },
    {
      id: "value",
      title: "Era of Value Management",
      subtitle: "We Open Up the Future of Smart Energy",
      image: `${IMG}/history-value.webp`,
      period: "2015 ~",
      align: "right",
      events: [
        { date: "2020.03", text: "Renamed to LS ELECTRIC Co., Ltd." },
        {
          date: "2024.12",
          text: "LS ELECTRIC awarded the '900 Million Dollar Export Tower' on the 61st Trade Day",
        },
        { date: "2025.04", text: "Completion of Bastrop Campus in Texas" },
      ],
    },
  ] satisfies LsElectricHistoryEra[],
};
