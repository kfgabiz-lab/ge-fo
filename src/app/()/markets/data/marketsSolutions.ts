export type SolutionProduct = {
  id: string;
  image?: string;
  title: string;
  description: string;
  href: string;
};

export type SolutionZone = {
  id: string;
  label: string;
  /** MO accordion / Figma label when different from PC */
  mobileLabel?: string;
  /** Position on 1920×978 map (Figma PC) */
  mapX: number;
  mapY: number;
  /** Position on 375×280 map (Figma MO) — percent */
  mobileMapX?: number;
  mobileMapY?: number;
  description: string;
  products?: SolutionProduct[];
};

/** Figma 5966:63794 — mobile accordion order */
export const marketsSolutionMobileOrder = [
  "A",
  "B",
  "C",
  "D",
  "J",
  "F",
  "G",
  "H",
  "I",
] as const;

const productImg = {
  mcsg: "/img/markets/solutions/product_mcsg.png",
  scada: "/img/markets/solutions/product_scada.png",
  ulLv: "/img/markets/solutions/product_ul_lv_swgr.png",
  metalEnclosed: "/img/markets/solutions/product_metal_enclosed_swgr.png",
  ul1558: "/img/markets/solutions/product_ul1558_swgr.png",
  fallback: "/img/main/product_01.jpg",
} as const;

const productSamples = [
  productImg.mcsg,
  productImg.metalEnclosed,
  productImg.ul1558,
  productImg.ulLv,
  productImg.fallback,
] as const;

function sampleImageForId(id: string): string {
  const index = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return productSamples[index % productSamples.length];
}

function solutionProduct(
  id: string,
  title: string,
  image?: string | null,
  href = "#",
): SolutionProduct {
  return {
    id,
    title,
    description: "",
    href,
    ...(image !== null ? { image: image ?? sampleImageForId(id) } : {}),
  };
}

export const marketsSolutionZones: SolutionZone[] = [
  {
    id: "A",
    label: "Control room",
    mapX: 46,
    mapY: 37.8,
    mobileMapX: 13.3,
    mobileMapY: 21.4,
    description:
      "The operational brain of the facility. Advanced SCADA software monitors and optimizes the entire power infrastructure.",
    products: [
      solutionProduct("a-scada", "SCADA", productImg.scada),
      // solutionProduct("a-hmi", "HMI Workstation"),
    ],
  },
  {
    id: "B",
    label: "Generator room",
    mapX: 31.7,
    mapY: 73.2,
    mobileMapX: 8,
    mobileMapY: 60.7,
    description:
      "Houses emergency diesel generators to ensure continuous data center operation during unexpected utility power outages.",
    // products: [
    //   solutionProduct("b-diesel-gen", "Diesel Generator Set"),
    //   solutionProduct("b-ats", "Automatic Transfer Switch"),
    //   solutionProduct("b-paralleling", "Paralleling Switchgear", productImg.mcsg),
    // ],
  },
  {
    id: "C",
    label: "Electrical room",
    mapX: 19.8,
    mapY: 58.3,
    mobileMapX: 22.1,
    mobileMapY: 50,
    description:
      "The core power hub. Features our UL-certified switchgear, transformers, breakers, panelboards, and DC components.",
    products: [
      solutionProduct(
        "c-mcsg",
        "Metal Clad Swtichgear",
        productImg.mcsg,
        "/products-systems/motor-control/metasol-ms",
      ),
      solutionProduct(
        "c-metal-enclosed",
        "Metal Enclosed Load Interrupter Switchgear",
        productImg.metalEnclosed,
      ),
      solutionProduct("c-ul1558", "UL1558 Switchgear", productImg.ul1558),
      solutionProduct("c-ul67", "UL67 Panelboard",null),
      solutionProduct("c-padmount", "Padmount Transformer",null),
      solutionProduct("c-cast-resin", "Cast Resin Transformer",null),
      solutionProduct("c-lis", "Load Interrupter Switch",null),
      solutionProduct("c-vcb", "Susol UL VCB",null),
      solutionProduct("c-acb", "Susol UL ACB",null),
      solutionProduct("c-mccb", "Susol UL MCCB",null),
      solutionProduct("c-dc", "DC Products",null),
    ],
  },
  {
    id: "D",
    label: "Modular station",
    mapX: 57.1,
    mapY: 76.6,
    mobileMapX: 38.4,
    mobileMapY: 62.9,
    description:
      "A scalable, pre-fabricated power solution. Our integrated E-House delivers fast deployment and space efficiency.",
    products: [
      solutionProduct("d-ehouse", "E-House",null),
      // solutionProduct("d-skid", "Modular Power Skid"),
    ],
  },
  {
    id: "F",
    label: "Server room",
    mapX: 32.3,
    mapY: 44.3,
    mobileMapX: 68.5,
    mobileMapY: 32.1,
    description:
      "The mission-critical white space. Our highly reliable UL67 Panelboards ensure uninterrupted power to server racks.",
    products: [
      solutionProduct("f-ul67", "UL67 Panelboard",null),
      // solutionProduct("f-busway", "Busway Distribution"),
    ],
  },
  {
    id: "G",
    label: "Substation",
    mobileLabel: "Outdoor substation",
    mapX: 14.5,
    mapY: 21.6,
    mobileMapX: 80,
    mobileMapY: 66.4,
    description:
      "Steps down high-voltage grid power for the site. Equipped with our robust Power Transformer for grid reliability.",
    products: [solutionProduct("g-power-transformer", "Power Transformer", null)],
  },
  {
    id: "H",
    label: "UPS & Battery room",
    mapX: 45.3,
    mapY: 68.9,
    mobileMapX: 52,
    mobileMapY: 57.1,
    description:
      "Provides seamless, instantaneous backup power to prevent data loss and bridge the gap until generators activate.",
    // products: [
    //   solutionProduct("h-ups", "UPS Module"),
    //   solutionProduct("h-battery", "Battery Cabinet"),
    //   solutionProduct("h-static-switch", "Static Transfer Switch"),
    //   solutionProduct("h-pdu", "PDU", productImg.ulLv),
    // ],
  },
  {
    id: "I",
    label: "BESS",
    mapX: 14.5,
    mapY: 73.2,
    mobileMapX: 63.2,
    mobileMapY: 48.6,
    description:
      "Stores renewable energy to reduce peak loads and provide backup power, maximizing data center energy flexibility.",
    // products: [
    //   solutionProduct("i-battery-rack", "Battery Rack"),
    //   solutionProduct("i-pcs", "Power Conversion System"),
    //   solutionProduct("i-ems", "Energy Management System", productImg.ul1558),
    // ],
  },
  {
    id: "J",
    label: "Mechanical room",
    mobileLabel: "Chiller",
    mapX: 47.9,
    mapY: 54.3,
    mobileMapX: 40.8,
    mobileMapY: 41.4,
    description:
      "Contains advanced cooling systems and chillers essential for maintaining optimal temperatures for critical servers.",
    // products: [
    //   solutionProduct("j-chiller", "Chiller Unit"),
    //   solutionProduct("j-crah", "CRAH"),
    //   solutionProduct("j-cooling-tower", "Cooling Tower"),
    //   solutionProduct("j-pump", "Pump Skid"),
    //   solutionProduct("j-controls", "HVAC Controls", productImg.ul1558),
    // ],
  },
];

export const marketsSolutionPanelIds = marketsSolutionZones.map(
  (zone) => zone.id,
) as readonly string[];
