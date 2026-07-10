import type { MarketsSolutionBlock } from "./marketsSolutionsPanelTypes";

/** Figma 5841:92618 — Public Infrastructure Solutions */
export const publicInfrastructureSolutionsIntro = {
  title: "Public Infrastructure Solutions",
  description:
    "LS ELECTRIC provides integrated power and automation solutions for public infrastructure, including water and wastewater facilities, airports, railways, ports, and public buildings. Our solutions support reliable power distribution, intelligent facility operation, and efficient energy management, helping improve operational efficiency, system reliability, and sustainability.",
};

export const publicInfrastructurePowerBlock: MarketsSolutionBlock = {
  id: "intelligent-power-management",
  title: "Intelligent Power Management Solutions",
  paragraphs: [
    "LS ELECTRIC's intelligent power management solutions combine advanced software with power infrastructure to enable intelligent monitoring, centralized control, and optimized operation of critical public infrastructure. Supporting applications such as airports, water and wastewater facilities, transportation systems, government buildings, and healthcare facilities, these solutions enhance operational reliability, improve energy efficiency, and help build smarter and more resilient public infrastructure.",
  ],
  keySolutions: "EMS, SCADA, DMS, xEMS, DCS, Microgrid",
};

export const publicInfrastructureAutomationBlock: MarketsSolutionBlock = {
  id: "high-availability-automation",
  title: "High-Availability Automation Solutions",
  paragraphs: [
    "LS ELECTRIC delivers high-availability automation solutions for mission-critical public infrastructure through advanced Redundant PLC technology. Designed to ensure uninterrupted system operation and maximize reliability, the solution provides seamless redundancy across controllers, power supplies, and communication networks to minimize downtime and maintain continuous operation. It supports the stable and efficient operation of critical facilities including government buildings, airports, water and wastewater treatment plants, healthcare facilities, and other essential infrastructure.",
  ],
  keySolutions: "Redundant PLC, HMI, Micro PLC, VFD, Smart I/O",
};

export const publicInfrastructureSolutionsDiagrams = {
  power: {
    src: "/img/markets/public-infrastructure/solutions/diagram_power.png",
    alt: "Isometric diagram of public infrastructure power management network with EMS, SCADA, DMS, xEMS, DCS, and Microgrid across dams, cities, and renewable energy sites",
    width: 2640,
    height: 1440,
  },
  automation: {
    src: "/img/markets/public-infrastructure/solutions/diagram_automation.png",
    alt: "High-availability automation architecture showing Edge Computing Solution, HMI, Redundant PLC, Integrated Control and Motion PLC, All-in-one Micro PLC, Multi-Port RAPIEnet Switch, VFD, and Expandable Smart I/O",
    width: 2640,
    height: 1464,
  },
} as const;
