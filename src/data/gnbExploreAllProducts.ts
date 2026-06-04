export type GnbExploreProduct = {
  id: string;
  label: string;
  href: string;
};

export type GnbExploreColumn = {
  id: string;
  label: string;
  items: GnbExploreProduct[];
};

const productHrefMap: Record<string, string> = {
  DMPi: "/devices-systems/motor-control/metasol-ms",
  GMP: "/devices-systems/motor-control/metasol-ms",
  HVDC: "/devices-systems/hv-system/hvdc",
  IMP: "/devices-systems/motor-control/metasol-ms",
  "Metasol MS": "/devices-systems/motor-control/metasol-ms",
  MMP: "/devices-systems/motor-control/metasol-ms",
  SCADA: "/devices-systems/hv-system/hvdc",
  "Susol UL ACB": "/devices-systems/motor-control/metasol-ms",
};

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function product(label: string, href?: string): GnbExploreProduct {
  return {
    id: slugify(label),
    label,
    href: href ?? productHrefMap[label] ?? "/devices-systems/motor-control",
  };
}

/** Figma 2769:35038 — Explore All Products A–Z index */
export const gnbExploreAllColumns: GnbExploreColumn[] = [
  {
    id: "a-g",
    label: "A-G",
    items: [
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
    ].map((label) => product(label)),
  },
  {
    id: "h-l",
    label: "H-L",
    items: [
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
    ].map((label) => product(label)),
  },
  {
    id: "m-r",
    label: "M-R",
    items: [
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
    ].map((label) => product(label)),
  },
  {
    id: "s-z",
    label: "S-Z",
    items: [
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
    ].map((label) => product(label)),
  },
];
