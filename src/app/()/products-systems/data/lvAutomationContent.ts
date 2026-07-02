import type { DevicesCategoryProduct } from "./vfdContent";

/** Figma 4288:42524 — LV Automation (Variable Frequency Drive) hero */
export const lvAutomationIntro = {
  parentLabel: "LV Products and Systems",
  parentHref: "/products-systems/motor-control",
  title: "Variable Frequency Drive",
  description:
    "LS ELECTRIC is the first company in Korea to introduce variable frequency drives, widely used in a variety of applications such as cranes, elevators, steel manufacturing, automobiles, air conditioning, and water treatment plants. LS ELECTRIC VFDs meets hard and strict quality, marine, environment, and many other international regulations, and thrives to expand its market share beyond Korea by continuously adopting new technologies and hidden needs of our potential customers.",
};

const productImg = (file: string) =>
  `/img/devices-systems/lv-automation/${file}`;

/** Figma 4288:42530 — stacked product grid */
export const lvAutomationProducts: DevicesCategoryProduct[] = [
  {
    id: "lv-1",
    href: "/products-systems/motor-control/metasol-ms",
    image: productImg("product_h100_plus.png"),
    title: "H100 Plus",
    description:
      "H100+ is an HVAC drive designed for fan and pump applications. It provides dedicated protection functions and control technology to support energy-efficient operation in HVAC systems. With intuitive operation and support for various building automation communication protocols, H100+ enables smart and efficient HVAC control.",
  },
  {
    id: "lv-2",
    href: "",
    image: productImg("product_sp100.png"),
    title: "SP100",
    description:
      "SP100 is a VFD package solution designed to support reliable HVAC system operation. With smooth transfer between line power and inverter control, along with automatic transfer in the event of a fault, SP100 helps minimize equipment downtime. It provides a practical energy-saving solution for HVAC applications requiring stable and continuous operation.",
  },
  {
    id: "lv-3",
    href: "",
    image: productImg("product_g100.png"),
    title: "G100",
    description:
      "G100 is a powerful and flexible drive designed for a wide range of industrial applications. With sensorless vector control and dual rating support, it delivers optimized performance across various load conditions. Its compact, space-efficient design makes it a practical general-purpose inverter solution for control panel applications.",
  },
  {
    id: "lv-4",
    href: "",
    image: productImg("product_m100.png"),
    title: "M100",
    description:
      "M100 is a compact micro drive designed for small motor control applications. Its ultra-compact design supports close installation in limited spaces, while an intuitive dial interface simplifies operation. With essential functions for small motor control, M100 provides an economical and easy-to-use solution for simple installation and operation.",
  },
  {
    id: "lv-5",
    href: "",
    image: productImg("product_s100.png"),
    title: "S100",
    description:
      "S100 is a global standard drive that combines advanced control technology with user-focused operation. Designed to meet demanding global safety standards and harsh environmental requirements, S100 provides reliable performance for a wide range of industrial applications. Its optimized usability supports efficient setup, operation, and maintenance.",
  },
  {
    id: "lv-6",
    href: "",
    image: productImg("product_is7.png"),
    title: "iS7",
    description:
      "iS7 is a premium drive designed for demanding industrial applications. With high-performance vector control and flexible expansion options, it supports precise motor control across a wide range of operating requirements. Its user-friendly interface helps simplify setup and operation, making iS7 a practical drive solution for advanced industrial systems.",
  },
];
