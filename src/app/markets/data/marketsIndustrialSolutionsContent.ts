import type { MarketsSolutionCategory } from "./marketsSolutionsPanelTypes";

/** Figma 4670:41524 · mobile 7465:147605 — Industrial automation solutions */
export const industrialSolutionsIntro = {
  title: "Industrial Automation & Smart Manufacturing Solutions",
  description:
    "LS ELECTRIC delivers advanced industrial automation solutions that maximize productivity, reliability, and energy efficiency. Through high-performance PLCs, AC drives, servo systems, and smart factory platforms, we help manufacturers optimize production, minimize downtime, reduce operating costs, and build scalable, data-driven manufacturing environments for the future.",
};

/** Figma 7603:189143 — chart only (category cards are HTML) */
export const industrialSolutionsDiagram = {
  src: "/img/markets/industrial/solutions/diagram.png",
  mobileSrc: "/img/markets/industrial/solutions/diagram_mo.png",
  alt: "Industrial automation architecture diagram showing field, control, and management levels",
  width: 1440,
  height: 752,
  mobileWidth: 287,
  mobileHeight: 166,
};

/** Mobile category cards under diagram (Figma 7465:147605) */
export const industrialSolutionsCategories: MarketsSolutionCategory[] = [
  {
    id: "fa-control",
    title: "FA Control Systems",
    items: [
      "PLC, Smart IO, HMI, Software based motion control",
      "AC Drive, Servo, Linear Motor, Moving magnet, Gearbox Delta Robot, Vision",
    ],
  },
  {
    id: "connectivity",
    title: "Connectivity",
    items: [
      "Industrial Ethernet Network RAPIEnet+ (RAPIEnet + Modbus TCP + Ethernet/IP)",
      "EtherCAT Motion Control",
    ],
  },
  {
    id: "iot-digital-twin",
    title: "IoT & Digital Twin",
    items: [
      "Edge Computing (Edge Hub)",
      "Back-up Solutions (DEXA), Blackbox",
      "3D Viewer",
    ],
  },
  {
    id: "safety-security",
    title: "Safety & Security",
    items: [
      "Developing Hybrid Safety PLC",
      "IEC 62443-4-1 ML 2",
      "NOZOMI NETWORKS, NNSP (OT security company) Partnership",
    ],
  },
];
