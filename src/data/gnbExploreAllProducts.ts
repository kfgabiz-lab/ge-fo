import {
  devicesMegaMenu,
  softwareProductHrefs,
} from "@/data/gnb/mega/devices";

export const EXPLORE_ALL_PRODUCTS_PATH = "/products-systems/explore-all";

export type GnbExploreProduct = {
  id: string;
  label: string;
  href: string;
  discontinued?: boolean;
  lv1Id?: string;
};

export type GnbExploreLetterGroup = {
  letter: string;
  items: GnbExploreProduct[];
};

const productHrefMap: Record<string, string> = {
  DMPi: "/products-systems/motor-control/metasol-ms",
  GMP: "/products-systems/motor-control/metasol-ms",
  HVDC: softwareProductHrefs.scada,
  "H100 Plus": "/products-systems/motor-control/h100_plus",
  IMP: "/products-systems/motor-control/metasol-ms",
  "Metasol MS": "/products-systems/motor-control/metasol-ms",
  MMP: "/products-systems/motor-control/metasol-ms",
  SCADA: softwareProductHrefs.scada,
  "Diagnosis System": softwareProductHrefs.smartFactory,
  "Micro Grid": softwareProductHrefs.microGrid,
  "Smart Factory": softwareProductHrefs.smartFactory,
  xEMS: softwareProductHrefs.xems,
  "Susol UL ACB": "/products-systems/motor-control/metasol-ms",
  "Susol UL MCCB": "/products-systems/motor-control/susol-ul-smart-mccb",
};

const lv1IdMap: Record<string, string> = {
  "Cast Resin Transformer": "mv",
  "Dead Tank Circuit Breaker": "hv",
  "Diagnosis System": "software",
  FACTS: "hv",
  GIS: "hv",
  "HVDC": "hv",
  "Metal Clad Switchgear": "mv",
  "Metal Enclosed Load Interrupter\nSwitchgear": "mv",
  "Micro Grid": "software",
  "Motion Controllers": "automation",
  "MV Fuse": "mv",
  "MV MCC": "mv",
  "Padmount Switchgear": "mv",
  "Padmount Transformer": "mv",
  "PHOX Servo Drives": "automation",
  "Power Transformer": "hv",
  "Servo Motors": "automation",
  "SMART I/O": "automation",
  "Smart Factory": "software",
  xEMS: "software",
  XGB: "automation",
  XGT: "automation",
};

const discontinuedLabels = new Set(["BK-Series_DIN SPD(UL)"]);

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function product(label: string, href?: string): GnbExploreProduct {
  const normalized = label.replace(/\n/g, " ");
  const lv1Id =
    lv1IdMap[label] ??
    (normalized.startsWith("DC ") ? "dc" : undefined) ??
    "lv";

  return {
    id: slugify(label),
    label,
    href: href ?? productHrefMap[normalized] ?? productHrefMap[label] ?? "/products-systems/motor-control",
    discontinued: discontinuedLabels.has(label),
    lv1Id,
  };
}

/** Figma 4701:82590 — Explore All Products A–Z index */
export const gnbExploreAllProducts: GnbExploreProduct[] = [
  "BK-Series_DIN SPD(UL)",
  "BK-Series_UL Type",
  "Cast Resin Transformer",
  "DC Magnetic Contactor",
  "DC MCB(Miniature Circuit Breaker)",
  "DC MCCB/Disconnect(Up to 600A)",
  "DC Relay",
  "DC Surge Protective Device(UL1449)",
  "Dead Tank Circuit Breaker",
  "Diagnosis System",
  "DMPi",
  "E House",
  "eXP2",
  "FACTS",
  "G100",
  "GFCI",
  "GIS",
  "GMP",
  "H100 Plus",
  "HVDC",
  "IEC DC ACB & Switch-Disconnector",
  "IMP",
  "iS7",
  "iX7M Servo Drives",
  "iX7NH Servo Drives",
  "iXP3",
  "L7NH Servo Drives",
  "L7P Servo Drives",
  "Load Interrupter Switch",
  "L-Series_UL Type",
  "LV MCC",
  "LXP",
  "M100",
  "Metal Clad Switchgear",
  "Metal Enclosed Load Interrupter\nSwitchgear",
  "Metasol MS",
  "Micro Grid",
  "Mini MS",
  "MMP",
  "MMS",
  "Motion Controllers",
  "MV Fuse",
  "MV MCC",
  "Padmount Switchgear",
  "Padmount Transformer",
  "PHOX Servo Drives",
  "Power Transformer",
  "Remote Power Panel",
  "S100",
  "SAFETY",
  "SCADA",
  "Secondary Unit Substation",
  "Servo Motors",
  "SMART I/O",
  "SP100",
  "Susol UL ACB",
  "Susol UL MCCB",
  "Susol UL VCB",
  "Thermal Overload Relay",
  "UL DC Compact Switch-Disconnector",
  "UL DC Switch-Disconnector",
  "UL SPD",
  "UL1558 Switchgear",
  "UL67 Panelboard",
  "UL891 Switchboard",
  "xEMS",
  "XGB",
  "XGT",
].map((label) => product(label));

export const exploreAllLv1Categories = devicesMegaMenu.categories.map(
  (category) => ({
    id: category.id,
    label: category.label,
  }),
);

function getFirstLetter(label: string): string {
  const match = label.replace(/^\s+/, "").match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

export function groupExploreProductsByLetter(
  products: GnbExploreProduct[],
): GnbExploreLetterGroup[] {
  const groups = new Map<string, GnbExploreProduct[]>();

  for (const item of products) {
    const letter = getFirstLetter(item.label);
    const bucket = groups.get(letter) ?? [];
    bucket.push(item);
    groups.set(letter, bucket);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    }));
}

export function chunkLetterGroups<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

const EXPLORE_ALL_COLUMN_COUNT = 4;

/** letter groups distributed round-robin into columns for the GNB mega "explore all" panel */
export const gnbExploreAllColumns: GnbExploreLetterGroup[][] = (() => {
  const groups = groupExploreProductsByLetter(gnbExploreAllProducts);
  const columns: GnbExploreLetterGroup[][] = Array.from(
    { length: EXPLORE_ALL_COLUMN_COUNT },
    () => [],
  );
  groups.forEach((group, index) => {
    columns[index % EXPLORE_ALL_COLUMN_COUNT].push(group);
  });
  return columns;
})();
