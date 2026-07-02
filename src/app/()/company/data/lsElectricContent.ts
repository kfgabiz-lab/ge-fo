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
    "Driving global innovation in electrification, automation, and energy systems.",
};

export const lsElectricIntro = {
  heroImage: `${IMG}/intro-hero.jpg`,
  headlineLines: ["Smart Power & Automation,", "Built for Performance"],
  paragraphs: [
    "LS ELECTRIC is a global energy and automation company delivering integrated power and digital solutions. By combining advanced electrical engineering with digital technologies, we enable industries and infrastructure to operate with greater efficiency, reliability, and sustainability.",
    "Our solutions span the full lifecycle—from system design and implementation to operation and optimization—helping customers enhance performance, reduce energy consumption, and ensure long-term resilience. With over 4,400 employees and a network of nine affiliates, LS ELECTRIC continues to expand its global presence while advancing the future of electrification and digital transformation.",
  ],
};

export const lsElectricHighlights = {
  title: "2025 Highlights",
  ctaLabel: "View IR infomation",
  ctaHref: "https://www.ls-electric.com/en/company/investor-relations/overview.do",
  /** Figma 4717:55986 (PC) · 5876:31376 (MO) */
  bgImage: `${IMG}/highlights-bg.jpg`,
  bgImageMo: `${IMG}/highlights-bg-mo.jpg`,
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
    "From power infrastructure to smart automation, we deliver end-to-end solutions.",
  cards: [
    {
      id: "power",
      title: "Power Solution",
      image: `${IMG}/business-power.jpg`,
      items: ["Power Transmission", "Power Distribution"],
      gradient: "bottom",
    },
    {
      id: "energy",
      title: "Smart Energy Solution",
      image: `${IMG}/business-energy.jpg`,
      items: ["Photovoltaic (PV)", "Energy Storage System (ESS)", "Microgrid"],
      gradient: "bottom",
    },
    {
      id: "automation",
      title: "Automation Solution",
      image: `${IMG}/business-automation.jpg`,
      items: ["PLC", "Servo", "Drive", "HMI"],
      gradient: "top",
    },
    {
      id: "railway",
      title: "Railway Solution",
      image: `${IMG}/business-railway.jpg`,
      items: ["Railway Signaling", "Railway Power Supply"],
      gradient: "bottom",
    },
  ] satisfies LsElectricBusinessCard[],
};

export const lsElectricGlobal = {
  title: "Global Network",
  description:
    "LS ELECTRIC set a mid-to long-term vision for each overseas market to broaden its global business presence. In addition to pursuing the evolution of our existing businesses, we are discovering new business opportunities and strengthening the basis of business operations to take a tailor-made approach to each local market.",
  bgTexture: `${IMG}/global-bg.png`,
  mapImage: `${IMG}/global-map.png`,
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
    "The principle of PT&T is to create a better energy for future generations. Thanks to the most rigorous and strict testing in the world, we not only vouch for the reliable performance and quality of the products and systems that consumers use, but also motivate manufacturers to develop better products. Accordingly, we have been recognized by numerous agencies and experts.",
  cards: [
    {
      id: "infrastructure",
      image: `${IMG}/ptt-01.jpg`,
      title: "Test Infrastructure",
      subtitle: "World 6th largest testing capacity lab",
      description:
        "Recognized as one of the world's top six testing laboratories with a 4,000MVA-class testing infrastructure and advanced DC testing capabilities.",
    },
    {
      id: "talent",
      image: `${IMG}/ptt-02.jpg`,
      title: "Talent & Expertise",
      subtitle: "IEC Standards & Compliance Expertise",
      description:
        "Continuously advancing research on evolving IEC international standards and testing regulations through world-class engineering expertise.",
    },
    {
      id: "excellence",
      image: `${IMG}/ptt-03.jpg`,
      title: "Operational Excellence",
      subtitle: "Trusted Global Testing & Certification",
      description:
        "As an accredited testing institution, PT&T operates under ISO/IEC 17025 standards to deliver globally trusted testing and certification services.",
    },
  ] satisfies LsElectricPttCard[],
};

export const lsElectricRnd = {
  title: "R&D Center",
  description:
    "Guided by our mission of 'Futuring Smart Energy', we maintain dedicated research institutes for energy and automation, respectively, to ensure a relentless pursuit of quality and technology in these areas. In addition, the AX Sector, led by the ESG/Vision Management CVO, leverages artificial intelligence, machine learning, and big data technologies to advance our businesses, thereby steering global market trends and solidifying our future competitiveness.",
  heroImage: `${IMG}/rnd-hero.jpg`,
  items: [
    {
      id: "tech-map",
      number: 1,
      title: "Enhance technological expertise through the Technology Map",
      description:
        "Tech Map is applied as a tool to check the relevant levels of technology and human resources and to develop and manage them to meet our business goals.",
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
      title: "Tech. Scouting",
      description:
        "We continuously strengthen our expertise through dedicated technology development organizations. In addition, we operate the LS ELECTRIC R&D STAR Partners™ program to discover outstanding technology partners.",
    },
    {
      id: "awards",
      number: 4,
      title: "Awarding R&D Professionals",
      description:
        "Every year, the Best R&D Award is presented to outstanding R&D projects. The project that wins the first prize is submitted to the Tech Fair organized by LS Group so that its performance can be shared and celebrated across the entire business group.",
    },
  ] satisfies LsElectricRndItem[],
};

export const lsElectricHistory = {
  title: "History",
  description:
    "since 1974, As a leader in power solutions and automation solutions, LS ELECTRIC has become a global leader.",
  eras: [
    {
      id: "beginning",
      title: "Era of Beginning",
      subtitle: "We Pioneer the Power and Automation industries",
      image: `${IMG}/history-beginning.jpg`,
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
      image: `${IMG}/history-challenge.jpg`,
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
      image: `${IMG}/history-growth.jpg`,
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
      image: `${IMG}/history-value.jpg`,
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
