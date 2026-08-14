import type { DevicesProductFeatureListItem } from "@/components/content/DevicesProductFeaturesSection";
import type { HvdcApplication } from "./hvdcContent";

const microGridImg = (file: string) => `/img/devices-systems/micro-grid/${file}`;

export const microGridHero = {
  tagline: null,
  title: "Micro Grid",
  description:
    "LS ELECTRIC delivers Microgrid solution for various region, customers and local situation.\nIt is a smart grid system that enables a small local area to be self-sufficient in electricity.\nUsually utilizing renewable energies and Energy storage system, LS ELECTRIC\u2019s Microgrid can provide several types of benefit for each users.",
};

export const microGridOverview = {
  image: microGridImg("overview_hero.webp"),
  imageAlt: "Microgrid control room with energy monitoring dashboards",
  title: "Intelligent Microgrid Management:\nDelivering Reliable Energy Operations",
  description:
    "Microgrid provides integrated monitoring and control of distributed energy resources through a unified platform. It enables seamless grid transition, uninterrupted power supply, and efficient energy management for critical operations.",
};

export const microGridBenefitsSection = {
  title: "Key Features",
  items: [
    {
      id: "benefit-1",
      title: "Integrated Distributed Energy Resource Management",
      bullets: [
        "Integrates and manages multiple distributed energy resources within the existing power grid.",
      ],
    },
    {
      id: "benefit-2",
      title: "Active DER Control and Power Quality Support",
      bullets: [
        "Supports renewable energy output control, voltage control, and frequency control to help improve power quality.",
      ],
    },
    {
      id: "benefit-3",
      title: "Stable and Cost-Efficient Microgrid Operation",
      bullets: [
        "Helps provide stable power supply while minimizing the total operating cost of distributed energy resources and energy storage systems.",
      ],
    },
    {
      id: "benefit-4",
      title: "System Integration & Interoperability",
      bullets: [
        "Integrates MG-EMS, controllers, ESS, EV chargers, and distributed energy resources through a unified platform for coordinated operation and visibility.",
      ],
    },
  ] satisfies DevicesProductFeatureListItem[],
};

export const microGridApplicationsSection = {
  title: "System Configration",
  description: "",
  items: [
    {
      id: "app-1",
      title: "Urban & Commercial Microgrid",
      subtitle: "(Uiwang Microgrid Project)",
      description:
        "Integrates PV, BESS, EV chargers, and utility grid infrastructure into a unified microgrid platform. Supports distributed energy optimisation and seamless grid-to-island operation.",
      image: microGridImg("application_urban.webp"),
    },
    {
      id: "app-2",
      title: "Campus & Critical Infrastructure Microgrid",
      subtitle: "(Seoul National University Campus)",
      description:
        "Provides resilient power supply through seamless transfer and islanding operation. Ensures uninterrupted operation of critical facilities during grid disturbances.",
      image: microGridImg("application_campus.webp"),
    },
    {
      id: "app-3",
      title: "Remote & Island Microgrid",
      subtitle: "(LVDC Island Microgrid)",
      description:
        "Delivers reliable power through renewable energy, ESS, and diesel generator integration. Enables efficient and self-sufficient energy operation in remote areas.",
      image: microGridImg("application_remote.webp"),
    },
  ] satisfies HvdcApplication[],
};

export type MicroGridHighlightItem = {
  id: string;
  title: string;
  description: string;
};

export const microGridWhySection = {
  title: "Highlights & Capabilities",
  items: [
    {
      id: "why-1",
      title: "Seamless Grid-to-Island Operation",
      description:
        "Automatically transitions between grid-connected and island modes without interrupting critical loads. Supports planned and unplanned islanding operation for enhanced resilience.",
    },
    {
      id: "why-2",
      title: "Microgrid Controller (MGC)",
      description:
        "Provides the core hardware platform for microgrid operation, enabling integrated monitoring, control, and optimisation of distributed energy resources and energy storage systems.",
    },
    {
      id: "why-3",
      title: "Proven Application Scenarios",
      description:
        "Tailored microgrid solutions for energy savings, resilience, and sustainable operation across campuses, commercial facilities, remote communities, and EV charging infrastructure.",
    },
  ] satisfies MicroGridHighlightItem[],
  diagramImage: microGridImg("why_diagram.svg"),
  diagramImageMobile: microGridImg("why_diagram_mobile.svg"),
  diagramAlt: "Microgrid system diagram with distributed energy resources, storage, and controls",
};

export const microGridFaqItems = [
  {
    question: "What is a microgrid and how does LS ELECTRIC Micro Grid support it?",
    answer:
      "A microgrid is a localized energy system that can operate connected to or independent from the main utility grid. LS ELECTRIC Micro Grid integrates distributed energy resources, storage, and controls for reliable, efficient operation.",
  },
  {
    question: "How does seamless grid-to-island operation work?",
    answer:
      "The system automatically transitions between grid-connected and island modes without interrupting critical loads, supporting both planned and unplanned islanding for enhanced resilience.",
  },
  {
    question: "Which distributed energy resources can be integrated?",
    answer:
      "The platform supports solar, wind, generators, BESS, ultracapacitor systems, EV chargers, and critical loads through MG-EMS and microgrid controllers for coordinated monitoring and control.",
  },
];
