import type { HighlightNewsItem } from "@/types/highlightNews";

export const motorControlHero = {
  title: "LV Products and Systems",
  description:
    "LS ELECTRIC has been the leader for electric equipment in Korea. Now we are offering these advanced technological products to the world with Susol and Metasol Series ACB, MCCB, and Magnetic Contactor & Overload Relay.",
};

export type DevicesProductItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  /** type1 (lg) — `badges` 미사용 시 호환 */
  badge?: boolean;
  /** 1: type1 (lg) · 2: type2 (sm) */
  badges?: 1 | 2;
};

export type DevicesMarketItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  tagline: string;
  description: string;
};

export type DevicesHelpCard = {
  id: string;
  href: string;
  title: string;
  description: string;
  cta: string;
  ctaIcon?: "link" | "arrow";
  image?: string;
};

const productImg = (file: string) =>
  `/img/devices-systems/products/${file}`;

const LV_AUTOMATION_HREF = "/products-systems/lv-automation";

/** Figma 4288:42677 — LV Products and Systems product grid (14 items) */
export const motorControlProducts: DevicesProductItem[] = [
  {
    id: "mc-1",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_acb_pcb.png"),
    title: "Air Circuit Breaker /\nPower Circuit Breaker",
  },
  {
    id: "mc-2",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_mccb.png"),
    title: "Molded Case Circuit Breaker",
  },
  {
    id: "mc-3",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_mcb.png"),
    title: "Miniature Circuit Breaker",
  },
  {
    id: "mc-4",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_spd.png"),
    title: "Surge Protective Device",
  },
  {
    id: "mc-5",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_ul67_panelboard.png"),
    title: "UL67 Panelboard",
  },
  {
    id: "mc-6",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_remote_power_panel.png"),
    title: "Remote Power Panel",
  },
  {
    id: "mc-7",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_ul891_switchboard.png"),
    title: "UL891 Switchboard",
  },
  {
    id: "mc-8",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_ul1558_switchgear.png"),
    title: "UL1558 Switchgear",
  },
  {
    id: "mc-9",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_e_house.png"),
    title: "E House",
  },
  {
    id: "mc-10",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_magnetic_contactor.png"),
    title: "Magnetic Contactor",
  },
  {
    id: "mc-11",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_overload_relay.png"),
    title: "Overload Relay",
  },
  {
    id: "mc-12",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_motor_protection_relay.png"),
    title: "Electronic Motor Protection Relay",
  },
  {
    id: "mc-13",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_manual_starter.png"),
    title: "Manual Motor Starter",
  },
  {
    id: "mc-14",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_vfd.png"),
    title: "Variable Frequency Drive",
  },
];

export const motorControlMarkets: DevicesMarketItem[] = [
  {
    id: "mkt-1",
    href: "/markets/data-center",
    image: "/img/main/card_01.jpg",
    title: "Data Center",
    tagline: "Scalable & Uninterrupted Power",
    description:
      "Ensure 24/7 uptime with high-reliability power distribution and smart monitoring. Engineered for the precision, efficiency, and scalability required by mission-critical hyperscale environments.",
  },
  {
    id: "mkt-4",
    href: "/markets/power-grid",
    image: "/img/main/card_04.png",
    title: "Power Grid",
    tagline: "Intelligent Grid & Energy Orchestration",
    description:
      "Optimize energy flow from generation to distribution. We empower utilities and enterprise microgrids with advanced grid intelligence, seamless BESS integration, and renewable energy management.",
  },
  {
    id: "mkt-3",
    href: "/markets/oil-gas-mining",
    image: "/img/main/card_03.png",
    title: "Oil & Gas, Mining Industries",
    tagline: "Rugged Reliability for Harsh Environments",
    description:
      "Maximize operational safety and efficiency under extreme conditions. Deliver robust power solutions and intelligent automation tailored for petrochemicals & refining, heavy metals & mining",
  },
  {
    id: "mkt-2",
    href: "/markets/public-infrastructure",
    image: "/img/main/card_02.png",
    title: "Public Infrastructure",
    tagline: "Resilient Power for Mission-Critical Facilities",
    description:
      "Safeguard essential public services with robust electrical architectures. We deliver highly reliable power control and automation for government facilities, aviation hubs, water treatment plants",
  },
  {
    id: "mkt-5",
    href: "/markets/industrial",
    image: "/img/main/card_05.png",
    title: "Industrial",
    tagline: "Smart Automation & Motor Control",
    description:
      "Drive manufacturing excellence and minimize production downtime. Our precision automation and power systems are optimized for automotive lines, semiconductor fabrication, heavy machinery",
  },
  {
    id: "mkt-6",
    href: "/markets/commercial-residential",
    image: "/img/main/card_06.png",
    title: "Commercial & Residential",
    tagline: "Optimized Energy for Smart Buildings",
    description:
      "Protect critical building systems and enhance overall energy efficiency. Delivering safe, compliant, and scalable power solutions for high-rise commercial spaces, logistics hubs, retail complexes",
  },
];

export const motorControlHelpCards: DevicesHelpCard[] = [
  {
    id: "help-1",
    href: "",
    title: "Request Quote & Order",
    description:
      "Get detailed specifications, request custom pricing, and manage your orders seamlessly through our dedicated sales platform.",
    cta: "Go to Connect Portal",
    ctaIcon: "link",
    image: "/img/devices-systems/devices_help_01.jpg",
  },
  {
    id: "help-2",
    href: "",
    title: "Find a Local Distributor",
    description:
      "Search our global network to locate authorized LS ELECTRIC distributors and sales representatives in your area.",
    cta: "Where to Buy",
    ctaIcon: "arrow",
    image: "/img/devices-systems/devices_help_02.jpg",
  },
  {
    id: "help-3",
    href: "",
    title: "Technical Support & Service",
    description:
      "Need installation, commissioning, or maintenance? Submit a service ticket to our expert engineering team for rapid technical assistance.",
    cta: "Go to G-ICS",
    ctaIcon: "link",
    image: "/img/devices-systems/devices_help_03.jpg",
  },
];

export const motorControlHighlights: HighlightNewsItem[] = [
  {
    id: "ds-hl-1",
    href: "",
    image: "/img/devices-systems/highlights/highlight_01.jpg",
    tag: "Press",
    title:
      "LS ELECTRIC Takes Aim at Next-Generation Data Center 'DC Power' Market",
    date: "Apr 20, 2026",
  },
  {
    id: "ds-hl-2",
    href: "",
    image: "/img/devices-systems/highlights/highlight_02.jpg",
    tag: "Blog",
    title:
      "LS ELECTRIC Continues Winning Orders for U.S. Data Center Power Infrastructure",
    date: "Apr 14, 2026",
  },
  {
    id: "ds-hl-3",
    href: "",
    image: "/img/devices-systems/highlights/highlight_03.jpg",
    tag: "Press",
    title: "LS ELECTRIC Surpasses 60 Billion KRW in Japanese ESS Market Orders",
    date: "Apr 08, 2026",
  },
];
