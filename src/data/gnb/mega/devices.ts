import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { acbDescription } from "@/data/gnb/shared";
import type { GnbDevicesMegaMenu, GnbMegaDepth3 } from "@/data/gnb/types";

const productImg = {
  acb: "/img/devices-systems/product/product_metasol_ms.png",
  mccb: "/img/devices-systems/products/product_mccb.png",
  mcb: "/img/devices-systems/products/product_mcb.png",
  spd: "/img/devices-systems/products/product_spd.png",
  magneticContactor: "/img/devices-systems/products/product_magnetic_contactor.png",
  overloadRelay: "/img/devices-systems/products/product_overload_relay.png",
  motorProtection: "/img/devices-systems/products/product_motor_protection_relay.png",
  manualStarter: "/img/devices-systems/products/product_manual_starter.png",
  gfci: "/img/devices-systems/products/product_gfci.png",
  vfd: "/img/devices-systems/products/product_vfd.png",
  lvMcc: "/img/devices-systems/products/product_lv_mcc.png",
  hvdc: "/img/devices-systems/hvdc/overview_hero.jpg",
} as const;

/** Figma 2769:34864 — LV Devices and Systems depth 3 */
const lvDepth3: GnbMegaDepth3[] = [
  {
    id: "acb-pcb",
    label: "Air Circuit Breaker /\nPower Circuit Breaker",
    panelTitle: "ACB / PCB",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "acb-product",
      title: "Susol UL ACB",
      subtitle: "Air Circuit Breaker",
      image: productImg.acb,
      href: "/devices-systems/motor-control/metasol-ms",
    },
  },
  {
    id: "mccb",
    label: "Molded Case Circuit Breaker",
    panelTitle: "MCCB",
    description: acbDescription,
    href: "/devices-systems/motor-control/metasol-ms",
    product: {
      id: "mccb-product",
      title: "Metasol MS",
      subtitle: "Molded Case Circuit Breaker",
      image: productImg.mccb,
      href: "/devices-systems/motor-control/metasol-ms",
    },
  },
  {
    id: "mcb",
    label: "Miniature Circuit Breaker",
    panelTitle: "MCB",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "mcb-product",
      title: "Miniature Circuit Breaker",
      subtitle: "Miniature Circuit Breaker",
      image: productImg.mcb,
      href: "/devices-systems/motor-control",
    },
  },
  {
    id: "spd",
    label: "Surge Protective Device",
    panelTitle: "SPD",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "spd-product",
      title: "Surge Protective Device",
      subtitle: "Surge Protective Device",
      image: productImg.spd,
      href: "/devices-systems/motor-control",
    },
  },
  {
    id: "ul67-panelboard",
    label: "UL67 Panelboard",
    panelTitle: "UL67 Panelboard",
    description: acbDescription,
    href: "",
  },
  {
    id: "remote-power-panel",
    label: "Remote Power Panel",
    panelTitle: "Remote Power Panel",
    description: acbDescription,
    href: "",
  },
  {
    id: "ul891-switchboard",
    label: "UL891 Switchboard",
    panelTitle: "UL891 Switchboard",
    description: acbDescription,
    href: "",
  },
  {
    id: "ul1558-switchgear",
    label: "UL1558 Switchgear",
    panelTitle: "UL1558 Switchgear",
    description: acbDescription,
    href: "",
  },
  {
    id: "e-house",
    label: "E House",
    panelTitle: "E House",
    description: acbDescription,
    href: "",
  },
  {
    id: "magnetic-contactor",
    label: "Magnetic Contactor",
    panelTitle: "Magnetic Contactor",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "magnetic-contactor-product",
      title: "Magnetic Contactor",
      subtitle: "Magnetic Contactor",
      image: productImg.magneticContactor,
      href: "/devices-systems/motor-control",
    },
  },
  {
    id: "overload-relay",
    label: "Overload Relay",
    panelTitle: "Overload Relay",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "overload-relay-product",
      title: "Overload Relay",
      subtitle: "Overload Relay",
      image: productImg.overloadRelay,
      href: "/devices-systems/motor-control",
    },
  },
  {
    id: "empr",
    label: "Electronic Motor Protection Relay",
    panelTitle: "EMPR",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    products: [
      {
        id: "gmp",
        title: "GMP",
        subtitle: "Electronic Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/devices-systems/motor-control/metasol-ms",
      },
      {
        id: "dmpi",
        title: "DMPi",
        subtitle: "Intelligent Digital Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/devices-systems/motor-control/metasol-ms",
      },
      {
        id: "imp",
        title: "IMP",
        subtitle: "Intelligent Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/devices-systems/motor-control/metasol-ms",
      },
      {
        id: "mmp",
        title: "MMP",
        subtitle: "Smart Electronic Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/devices-systems/motor-control/metasol-ms",
      },
    ],
  },
  {
    id: "manual-motor-starter",
    label: "Manual Motor Starter",
    panelTitle: "Manual Motor Starter",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "manual-motor-starter-product",
      title: "Manual Motor Starter",
      subtitle: "Manual Motor Starter",
      image: productImg.manualStarter,
      href: "/devices-systems/motor-control",
    },
  },
  {
    id: "gfci",
    label: "Ground Fault Circuit Interrupter",
    panelTitle: "GFCI",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "gfci-product",
      title: "Ground Fault Circuit Interrupter",
      subtitle: "Ground Fault Circuit Interrupter",
      image: productImg.gfci,
      href: "/devices-systems/motor-control",
    },
  },
  {
    id: "vfd",
    label: "Variable Fequency Drive",
    panelTitle: "VFD",
    description: acbDescription,
    href: "/devices-systems/variable-frequency-drive",
    product: {
      id: "vfd-product",
      title: "Variable Frequency Drive",
      subtitle: "Variable Frequency Drive",
      image: productImg.vfd,
      href: "/devices-systems/variable-frequency-drive",
    },
  },
  {
    id: "lv-mcc",
    label: "LV Motor Control Center",
    panelTitle: "LV MCC",
    description: acbDescription,
    href: "/devices-systems/motor-control",
    product: {
      id: "lv-mcc-product",
      title: "LV Motor Control Center",
      subtitle: "LV Motor Control Center",
      image: productImg.lvMcc,
      href: "/devices-systems/motor-control",
    },
  },
];

/** Figma 2769:34864 — Devices mega menu (4depth) */
export const devicesMegaMenu: GnbDevicesMegaMenu = {
  type: "devices",
  panelId: GNB_MEGA_PANEL_ID.devices,
  categories: [
    {
      id: "lv",
      label: "LV Devices and Systems",
      children: lvDepth3,
    },
    {
      id: "mv",
      label: "MV Devices and Systems",
      children: [
        {
          id: "mv-gis",
          label: "Gas Insulated Switchgear",
          panelTitle: "GIS",
          description: acbDescription,
          href: "/devices-systems/hv-system",
        },
      ],
    },
    {
      id: "hv",
      label: "HV Systems",
      children: [
        {
          id: "hvdc",
          label: "HVDC",
          panelTitle: "HVDC",
          description: acbDescription,
          href: "/devices-systems/hv-system/hvdc",
          product: {
            id: "hvdc-product",
            title: "HVDC",
            subtitle: "High Voltage Direct Current Transmission System",
            image: productImg.hvdc,
            href: "/devices-systems/hv-system/hvdc",
          },
        },
      ],
    },
    {
      id: "dc",
      label: "DC Devices",
      children: [
        {
          id: "dc-drive",
          label: "DC Drive",
          panelTitle: "DC Drive",
          description: acbDescription,
          href: "/devices-systems/variable-frequency-drive",
        },
      ],
    },
    {
      id: "automation",
      label: "Industrial Automation and Control",
      children: [
        {
          id: "lv-auto",
          label: "LV Automation",
          panelTitle: "LV Automation",
          description: acbDescription,
          href: "/devices-systems/lv-automation",
        },
      ],
    },
    {
      id: "software",
      label: "Software",
      children: [
        {
          id: "scada-sw",
          label: "SCADA Software",
          panelTitle: "SCADA",
          description: acbDescription,
          href: "/devices-systems/hv-system/hvdc",
        },
      ],
    },
  ],
};

export const devicesMegaDefaultCategoryId = "lv";
export const devicesMegaDefaultDepth3Id = "empr";
