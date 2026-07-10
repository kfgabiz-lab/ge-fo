/** Figma 5633:85749 — Oil & Gas Mining Solutions */
import type { MarketsSolutionBlock } from "./marketsSolutionsPanelTypes";

export const oilGasMiningSolutionsIntro = {
  title: "Powering Reliable Oil & Gas Operations",
  description:
    "Ensuring continuous production and operational excellence in demanding environments.",
};

export const oilGasMiningSolutionsBlocks: MarketsSolutionBlock[] = [
  {
    id: "power-infrastructure",
    title: "1. Power Infrastructure Solutions",
    paragraphs: [
      "LS ELECTRIC delivers reliable power infrastructure solutions for oil & gas facilities, including transformers, switchgear, and power distribution systems.",
      "Backed by project experience across the Middle East, Southeast Asia, and Latin America, we help ensure stable and continuous operations in demanding environments.",
    ],
    capabilities: [
      "Oil-Immersed Power Transformers",
      "Medium & Low Voltage Switchgear",
      "Reliable Operation for Critical Facilities",
      "Power Distribution & Protection Systems",
    ],
  },
  {
    id: "esp-motor-control",
    title: "2. Intelligent Motor Control for ESP Applications",
    paragraphs: [
      "LS ELECTRIC's VFD (Variable Frequency Drive) technology enables precise motor control for ESP systems, improving production efficiency, equipment reliability,",
      "and operational performance.",
    ],
    capabilities: [
      "ESP-Optimised Drive Technology",
      "Real-Time Motor Performance Control",
      "Advanced Protection & Monitoring Functions",
      "High-Power Capacity up to 500 kW",
    ],
  },
];

export const oilGasMiningSolutionsDiagram = {
  src: "/img/markets/oil-gas-mining/solutions/diagram_esp.png",
  alt: "Oil and gas ESP system diagram showing wellhead, VFD and pump-control, power supply, and downhole components from production tubing to sensor",
  width: 2640,
  height: 1604,
};
