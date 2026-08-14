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
  mobileLabel?: string;
  mapX: number;
  mapY: number;
  mobileMapX?: number;
  mobileMapY?: number;
  description: string;
  products?: SolutionProduct[];
};

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
  powerTransformer:
    "/img/devices-systems/products/power-transformer.webp",
  ul67Panelboard: "/img/devices-systems/products/ul67-panelboard.webp",
  metalClad: "/img/devices-systems/products/metal-clad-switchgear.webp",
  metalEnclosed:
    "/img/devices-systems/products/metal-enclosed-load-interrupter-switchgear.webp",
  ul1558: "/img/devices-systems/products/ul1558-switchgear.webp",
  padmount: "/img/devices-systems/products/padmount-transformer.webp",
  castResin: "/img/devices-systems/products/cast-resin-transformer.webp",
  loadInterrupter:
    "/img/devices-systems/products/load-interrupter-switch.webp",
  susolVcb: "/img/devices-systems/products/susol-ul-vcb.webp",
  susolMccb: "/img/devices-systems/products/susol-ul-mccb.webp",
  dcProducts:
    "/img/devices-systems/products/iec-dc-acb-and-switch-disconnector.webp",
  eHouse: "/img/devices-systems/products/e-house.webp",
  scada: "/img/markets/solutions/product_scada.webp",
  fallback: "/img/main/product_01.webp",
} as const;

const productSamples = [
  productImg.metalClad,
  productImg.metalEnclosed,
  productImg.ul1558,
  productImg.ul67Panelboard,
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
      solutionProduct("a-scada", "SCADA", productImg.scada, "/product/scada"),
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
        "Metal Clad Switchgear",
        productImg.metalClad,
        "/product/metal-clad-switchgear",
      ),
      solutionProduct(
        "c-metal-enclosed",
        "Metal Enclosed Load Interrupter Switchgear",
        productImg.metalEnclosed,
        "/product/metal-enclosed-load-interrupter-switchgear",
      ),
      solutionProduct(
        "c-ul1558",
        "UL1558 Switchgear",
        productImg.ul1558,
        "/product/ul1558-switchgear",
      ),
      solutionProduct(
        "c-ul67",
        "UL67 Panelboard",
        productImg.ul67Panelboard,
        "/product/ul67-panelboard",
      ),
      solutionProduct(
        "c-padmount",
        "Padmount Transformer",
        productImg.padmount,
        "/product/padmount-transformer",
      ),
      solutionProduct(
        "c-cast-resin",
        "Cast Resin Transformer",
        productImg.castResin,
        "/product/cast-resin-transformer",
      ),
      solutionProduct(
        "c-lis",
        "Load Interrupter Switch",
        productImg.loadInterrupter,
        "/product/load-interrupter-switch",
      ),
      solutionProduct(
        "c-vcb",
        "Susol UL VCB",
        productImg.susolVcb,
        "/product/susol-ul-vcb",
      ),
      solutionProduct(
        "c-mccb",
        "Susol UL MCCB",
        productImg.susolMccb,
        "/product/susol-ul-mccb",
      ),
      solutionProduct(
        "c-dc",
        "DC Products",
        productImg.dcProducts,
        "/products-category/dc-devices",
      ),
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
      solutionProduct("d-ehouse", "E-House", productImg.eHouse, "/product/e-house"),
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
      solutionProduct(
        "f-ul67",
        "UL67 Panelboard",
        productImg.ul67Panelboard,
        "/product/ul67-panelboard",
      ),
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
    products: [
      solutionProduct(
        "g-power-transformer",
        "Power Transformer",
        productImg.powerTransformer,
        "/product/power-transformer",
      ),
    ],
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
  },
];

export const marketsSolutionPanelIds = marketsSolutionZones.map(
  (zone) => zone.id,
) as readonly string[];
