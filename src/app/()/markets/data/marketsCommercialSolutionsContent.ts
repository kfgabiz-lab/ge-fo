/** Figma 5535:94070 — Commercial & Residential Solutions */
export const commercialSolutionsIntro = {
  title: "Smart Energy & Facility Management Solutions",
  description:
    "LS ELECTRIC delivers integrated building solutions that support reliable power distribution, efficient HVAC operation, and smarter energy management across commercial and residential facilities. By combining power, automation, and digital technologies, we help improve operational efficiency, enhance visibility, and simplify facility management.",
};

import type { MarketsSolutionBlock } from "./marketsSolutionsPanelTypes";

export type { MarketsSolutionBlock };

export const commercialSolutionsPowerBlocks: MarketsSolutionBlock[] = [
  {
    id: "power-distribution",
    title: "Reliable Power Distribution",
    paragraphs: [
      "Ensure stable and uninterrupted power delivery with integrated power distribution solutions, from incoming power to low-voltage distribution.",
      "Designed to support the reliable operation of commercial buildings and other mission-critical facilities.",
    ],
    keySolutions:
      "Power Transformers, Medium & Low Voltage Switchgears, ACBs, MCCBs, Protection & Monitoring Systems",
  },
  {
    id: "facility-management",
    title: "Smart Energy & Facility Management",
    paragraphs: [
      "Enhance operational visibility and energy efficiency with integrated monitoring and management solutions.",
      "Centralized control and real-time data help simplify facility management and support more efficient building operations.",
    ],
    keySolutions:
      "SCADA, EMS, Power Monitoring Systems (PMS), Building Energy Management & Integrated Monitoring Solutions",
  },
];

export const commercialSolutionsHvacBlock: MarketsSolutionBlock = {
  id: "hvac-control",
  title: "Intelligent Cooling & HVAC Control",
  paragraphs: [
    "Optimize building energy use and maintain comfortable operating environments through intelligent HVAC and cooling control solutions.",
    "Advanced drives and automation technologies help improve energy efficiency and support stable system operation.",
  ],
  keySolutions: "LV Drives (VFDs), Motor Control Solutions, Building HVAC Automation",
};

export const commercialSolutionsDiagrams = {
  power: {
    src: "/img/markets/commercial-residential/solutions/diagram_power.png",
    alt: "Infrastructure monitoring and power transmission diagram showing DCIM, BMS, EMS, EPMS, AMS and transmission through renewable energy distribution",
    width: 2640,
    height: 1176,
  },
  hvac: {
    src: "/img/markets/commercial-residential/solutions/diagram_hvac.png",
    alt: "HVAC system schematic showing HMI, redundant controller, fan and pump VFD, dampers, coils, and sensors",
    width: 2640,
    height: 1518,
  },
};
