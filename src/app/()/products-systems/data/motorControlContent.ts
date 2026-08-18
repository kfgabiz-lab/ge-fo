import type { HighlightNewsItem } from "@/types/highlightNews";
import { GICS_INDEX_URL } from "@/lib/externalLinks";

export const motorControlHero = {
  title: "LV Products and Systems",
  description:
    "LS ELECTRIC has been the leader for electric equipment in Korea. Now we are offering these advanced technological products to the world with Susol and Metasol Series ACB, MCCB, and Magnetic Contactor & Overload Relay.",
};

export type DevicesProductItem = {
  id: string;
  href: string;
  image: string | null;
  title: string;
  badge?: boolean;
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

const LV_AUTOMATION_HREF = "/product-range/variable-frequency-drive";

export const motorControlProducts: DevicesProductItem[] = [
  {
    id: "mc-1",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_acb_pcb.webp"),
    title: "Air Circuit Breaker /\nPower Circuit Breaker",
  },
  {
    id: "mc-2",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_mccb.webp"),
    title: "Molded Case Circuit Breaker",
  },
  {
    id: "mc-3",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_mcb.webp"),
    title: "Miniature Circuit Breaker",
  },
  {
    id: "mc-4",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_spd.webp"),
    title: "Surge Protective Device",
  },
  {
    id: "mc-5",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_ul67_panelboard.webp"),
    title: "UL67 Panelboard",
  },
  {
    id: "mc-6",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_remote_power_panel.webp"),
    title: "Remote Power Panel",
  },
  {
    id: "mc-7",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_ul891_switchboard.webp"),
    title: "UL891 Switchboard",
  },
  {
    id: "mc-8",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_ul1558_switchgear.webp"),
    title: "UL1558 Switchgear",
  },
  {
    id: "mc-9",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_e_house.webp"),
    title: "E House",
  },
  {
    id: "mc-10",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_magnetic_contactor.webp"),
    title: "Magnetic Contactor",
  },
  {
    id: "mc-11",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_overload_relay.webp"),
    title: "Overload Relay",
  },
  {
    id: "mc-12",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_motor_protection_relay.webp"),
    title: "Electronic Motor Protection Relay",
  },
  {
    id: "mc-13",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_manual_starter.webp"),
    title: "Manual Motor Starter",
  },
  {
    id: "mc-14",
    href: LV_AUTOMATION_HREF,
    image: productImg("product_vfd.webp"),
    title: "Variable Frequency Drive",
  },
];

export const motorControlMarkets: DevicesMarketItem[] = [
  {
    id: "mkt-1",
    href: "/markets/data-center",
    image: "/img/main/card_01.webp",
    title: "Data Center",
    tagline: "Scalable & Uninterrupted Power",
    description:
      "Ensure 24/7 uptime with high-reliability power distribution and smart monitoring. Engineered for the precision, efficiency, and scalability required by mission-critical hyperscale environments.",
  },
  {
    id: "mkt-4",
    href: "/markets/power-grid",
    image: "/img/main/card_04.webp",
    title: "Power Grid",
    tagline: "Intelligent Grid & Energy Orchestration",
    description:
      "Optimize energy flow from generation to distribution. We empower utilities and enterprise microgrids with advanced grid intelligence, seamless BESS integration, and renewable energy management.",
  },
  {
    id: "mkt-3",
    href: "/markets/oil-gas-mining",
    image: "/img/main/card_03.webp",
    title: "Oil & Gas, Mining Industries",
    tagline: "Rugged Reliability for Harsh Environments",
    description:
      "Maximize operational safety and efficiency under extreme conditions. Deliver robust power solutions and intelligent automation tailored for petrochemicals & refining, heavy metals & mining",
  },
  {
    id: "mkt-2",
    href: "/markets/public-infrastructure",
    image: "/img/main/card_02.webp",
    title: "Public Infrastructure",
    tagline: "Resilient Power for Mission-Critical Facilities",
    description:
      "Safeguard essential public services with robust electrical architectures. We deliver highly reliable power control and automation for government facilities, aviation hubs, water treatment plants",
  },
  {
    id: "mkt-5",
    href: "/markets/industrial",
    image: "/img/main/card_05.webp",
    title: "Industrial",
    tagline: "Smart Automation & Motor Control",
    description:
      "Drive manufacturing excellence and minimize production downtime. Our precision automation and power systems are optimized for automotive lines, semiconductor fabrication, heavy machinery",
  },
  {
    id: "mkt-6",
    href: "/markets/commercial-residential",
    image: "/img/main/card_06.webp",
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
    title: "Request a Quote or Place an Order",
    description:
      "Get pricing, review technical specifications, using our sales portal for the right LS ELECTRIC solution.",
    cta: "Go to Connect Portal",
    ctaIcon: "link",
    image: "/img/devices-systems/devices_help_01.webp",
  },
  {
    id: "help-2",
    href: "/support/where-to-buy",
    title: "Find an Authorized Distributor",
    description:
      "Connect with an authorized LS ELECTRIC distributor or sales representative serving your area.",
    cta: "Where to Buy",
    ctaIcon: "arrow",
    image: "/img/devices-systems/devices_help_02.webp",
  },
  {
    id: "help-3",
    href: GICS_INDEX_URL,
    title: "Get Technical Support & Service",
    description:
      "Keep your equipment operating safely and reliably with expert support for installation, maintenance, and repairs.",
    cta: "Go to G-ICS",
    ctaIcon: "link",
    image: "/img/devices-systems/devices_help_03.webp",
  },
];

export const motorControlHighlights: HighlightNewsItem[] = [
  {
    id: "ds-hl-1",
    href: "",
    image: "/img/devices-systems/highlights/highlight_01.webp",
    tag: "Press",
    title:
      "LS ELECTRIC Takes Aim at Next-Generation Data Center 'DC Power' Market",
    date: "Apr 20, 2026",
  },
  {
    id: "ds-hl-2",
    href: "",
    image: "/img/devices-systems/highlights/highlight_02.webp",
    tag: "Blog",
    title:
      "LS ELECTRIC Continues Winning Orders for U.S. Data Center Power Infrastructure",
    date: "Apr 14, 2026",
  },
  {
    id: "ds-hl-3",
    href: "",
    image: "/img/devices-systems/highlights/highlight_03.webp",
    tag: "Press",
    title: "LS ELECTRIC Surpasses 60 Billion KRW in Japanese ESS Market Orders",
    date: "Apr 08, 2026",
  },
];
