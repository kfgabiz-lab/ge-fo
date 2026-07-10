export type SolutionProduct = {
  id: string;
  image: string;
  title: string;
  description: string;
  href: string;
};

export type SolutionZone = {
  id: string;
  label: string;
  /** Position on 1920×978 map (Figma) */
  mapX: number;
  mapY: number;
  description: string;
  products?: SolutionProduct[];
};

const productImg = {
  mcsg: "/img/markets/solutions/product_mcsg.png",
  ulLv: "/img/markets/solutions/product_ul_lv_swgr.png",
  fallback: "/img/main/product_01.jpg",
} as const;

export const marketsSolutionZones: SolutionZone[] = [
  {
    id: "A",
    label: "Control room",
    mapX: 54,
    mapY: 41,
    description:
      "Centralized monitoring and SCADA integration for real-time visibility across power, cooling, and facility systems.",
    products: [
      {
        id: "a-bems",
        image: productImg.fallback,
        title: "Beyond Cube DCIM",
        description:
          "AI-ready platform processing one million data points per second with predictive diagnostics.",
        href: "",
      },
    ],
  },
  {
    id: "B",
    label: "Generator room",
    mapX: 35,
    mapY: 73,
    description:
      "Synchronized generator transfer and emergency power paths that maintain uptime during utility outages.",
    products: [
      {
        id: "b-gen",
        image: productImg.fallback,
        title: "CTTS Generator Transfer",
        description:
          "Synchronized transfer system for seamless switching to backup generation.",
        href: "",
      },
    ],
  },
  {
    id: "C",
    label: "Electrical room",
    mapX: 23,
    mapY: 57,
    description:
      "Ensuring 24/7 uninterrupted power supply and seamless emergency switching to protect critical data from grid failures.",
    products: [
      {
        id: "mcsg",
        image: productImg.mcsg,
        title: "MCSG (Metal Clad Switchgear)",
        description: "Susol Vacuum Circuit Breaker for ANSI type",
        href: "",
      },
      {
        id: "ul-lv-swgr",
        image: productImg.ulLv,
        title: "UL LV SWGR",
        description:
          "Susol UL low voltage arc-resistant switchgear ensures superior power distribution and protection.",
        href: "",
      },
    ],
  },
  {
    id: "D",
    label: "Modular station",
    mapX: 59,
    mapY: 67,
    description:
      "Prefabricated modular power skids that reduce on-site construction time and accelerate deployment schedules.",
    products: [
      {
        id: "d-powerone",
        image: productImg.fallback,
        title: "Beyond PowerONE",
        description:
          "Modular power solution streamlining engineering and installation up to 30% faster.",
        href: "",
      },
    ],
  },
  {
    id: "E",
    label: "Chiller",
    mapX: 35,
    mapY: 25,
    description:
      "High-efficiency cooling with optimal free cooling strategies to lower PUE and operating costs.",
    products: [
      {
        id: "e-hvac",
        image: productImg.fallback,
        title: "HVAC Optimal Free Cooling",
        description:
          "Up to 40% reduction in energy consumption for data center cooling systems.",
        href: "",
      },
    ],
  },
  {
    id: "F",
    label: "Server room",
    mapX: 35,
    mapY: 43,
    description:
      "Reliable rack-level power distribution and monitoring for high-density AI and cloud workloads.",
    products: [
      {
        id: "f-pdu",
        image: productImg.fallback,
        title: "Smart PDU & Busway",
        description:
          "Intelligent power distribution with real-time load monitoring at the rack.",
        href: "",
      },
    ],
  },
  {
    id: "G",
    label: "Substation",
    mapX: 16,
    mapY: 30,
    description:
      "Ultra-high-voltage substation equipment and GIS for stable utility interconnection up to 154 kV.",
    products: [
      {
        id: "g-gis",
        image: productImg.fallback,
        title: "Gas Insulated Switchgear (GIS)",
        description:
          "Compact GIS solutions for reliable grid connection and selective fault isolation.",
        href: "",
      },
    ],
  },
  {
    id: "H",
    label: "UPS & Battery room",
    mapX: 43,
    mapY: 64,
    description:
      "Integrated UPS, STS, and battery systems delivering mission-critical reliability up to 500 kVA.",
    products: [
      {
        id: "h-ups",
        image: productImg.fallback,
        title: "High-Performance UPS",
        description: "Up to 500 kVA FAT capacity with rapid response capability.",
        href: "",
      },
      {
        id: "h-sts",
        image: productImg.fallback,
        title: "Static Transfer Switch (STS)",
        description:
          "Seamless source transfer for zero-interruption power to critical loads.",
        href: "",
      },
    ],
  },
  {
    id: "I",
    label: "BESS",
    mapX: 9.5,
    mapY: 65,
    description:
      "Battery energy storage for peak shaving, backup extension, and renewable integration at the facility edge.",
    products: [
      {
        id: "i-ess",
        image: productImg.fallback,
        title: "ESS PCS & Battery System",
        description:
          "Scalable storage integration with PV and grid services for sustainable operations.",
        href: "",
      },
    ],
  },
  {
    id: "J",
    label: "Mechanical room",
    mapX: 51,
    mapY: 57,
    description:
      "Mechanical plant coordination for chilled water, airflow, and redundancy across the data hall.",
    products: [
      {
        id: "j-mechanical",
        image: productImg.fallback,
        title: "Integrated Mechanical Control",
        description:
          "Unified control of pumps, valves, and CRAH units linked to DCIM dashboards.",
        href: "",
      },
    ],
  },
];

export const marketsSolutionPanelIds = marketsSolutionZones.map(
  (zone) => zone.id,
) as readonly string[];
