import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { acbDescription } from "@/data/gnb/shared";
import type { GnbDevicesMegaMenu, GnbMegaDepth3 } from "@/data/gnb/types";

/** GNB mega depth3-btn destination */
const LV_AUTOMATION_HREF = "/products-systems/lv-automation";

/** GNB mega depth2-btn destination — Figma / motor-control L2 */
const MOTOR_CONTROL_HREF = "/products-systems/motor-control";

/** GNB mega depth2 · breadcrumb L2 — Software */
export const SOFTWARE_HREF = "/products-systems/software";

/** Software product detail routes — breadcrumb L3 */
export const softwareProductHrefs = {
  scada: "/products-systems/software/scada",
  xems: "/products-systems/software/xems",
  microGrid: "/products-systems/software/micro-grid",
  smartFactory: "/products-systems/software/smart-factory",
} as const;

/** GNB mega open defaults when pathname is under Software */
export function resolveDevicesMegaStateFromPath(pathname: string) {
  if (!pathname.startsWith(SOFTWARE_HREF)) {
    return null;
  }

  if (pathname.startsWith(softwareProductHrefs.xems)) {
    return { categoryId: "software", depth3Id: "xems-sw" };
  }

  if (pathname.startsWith(softwareProductHrefs.microGrid)) {
    return { categoryId: "software", depth3Id: "micro-grid-sw" };
  }

  if (pathname.startsWith(softwareProductHrefs.smartFactory)) {
    return { categoryId: "software", depth3Id: "diganosis-system-sw" };
  }

  return { categoryId: "software", depth3Id: "scada-sw" };
}

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

const lvDepth3: GnbMegaDepth3[] = [
  {
    id: "acb-pcb",
    label: "Air Circuit Breaker / Power Circuit Breaker",
    panelTitle: "Air Circuit Breaker / Power Circuit Breaker",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "acb-product",
      title: "Susol UL ACB",
      subtitle: "Air Circuit Breaker",
      image: productImg.acb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "mccb",
    label: "Molded Case Circuit Breaker",
    panelTitle: "Molded Case Circuit Breaker",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: [
      {
        id: "susol-ul-mccb-product",
        title: "Metasol MS",
        subtitle: "",
        image: productImg.mccb,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "susol-ul-smart-mccb-product",
        title: "Susol UL Smart MCCB",
        subtitle: "",
        image: productImg.mccb,
        href: "/products-systems/motor-control/susol-ul-smart-mccb",
      },
      {
        id: "mccb-product",
        title: "Susol UL MCCB(up to 1000V)",
        subtitle: "",
        image: productImg.mccb,
        href: "/products-systems/motor-control/h100_plus",
      },
    ],
  },
  {
    id: "mcb",
    label: "Miniature Circuit Breaker",
    panelTitle: "Miniature Circuit Breaker",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "bk-series-ul-type-product",
      title: "BK-Series_UL Type",
      subtitle: "",
      image: productImg.mcb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "spd",
    label: "Surge Protective Device",
    panelTitle: "Surge Protective Device",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: [
      {
        id: "bk-series-din-spd-ul-product",
        title: "BK-Series_DIN SPD(UL)",
        subtitle: "",
        image: productImg.spd,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "ul-spd-product",
        title: "UL SPD",
        subtitle: "",
        image: productImg.spd,
        href: "/products-systems/motor-control/h100_plus",
      },
    ],
  },
  {
    id: "ul67-panelboard",
    label: "UL67 Panelboard",
    panelTitle: "UL67 Panelboard",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "ul67-panelboard-product",
      title: "UL67 Panelboard",
      subtitle: "",
      image: productImg.mcb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "remote-power-panel",
    label: "Remote Power Panel",
    panelTitle: "Remote Power Panel",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "rpp-product",
      title: "Remote Power Panel",
      subtitle: "",
      image: productImg.mcb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "ul891-switchboard",
    label: "UL891 Switchboard",
    panelTitle: "UL891 Switchboard",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "ul891-switchboard-product",
      title: "UL891 Switchboard",
      subtitle: "",
      image: productImg.mcb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "ul1558-switchgear",
    label: "UL1558 Switchgear",
    panelTitle: "UL1558 Switchgear",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "ul1558-switchgear-product",
      title: "UL1558 Switchgear",
      subtitle: "",
      image: productImg.mcb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "e-house",
    label: "E House",
    panelTitle: "E House",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "e-house-product",
      title: "E House",
      subtitle: "",
      image: productImg.mcb,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "magnetic-contactor",
    label: "Magnetic Contactor",
    panelTitle: "Magnetic Contactor",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: [
      {
        id: "metasol-ms-product",
        title: "Metasol MS",
        subtitle: "",
        image: productImg.magneticContactor,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "mini-ms-product",
        title: "Mini MS",
        subtitle: "",
        image: productImg.magneticContactor,
        href: "/products-systems/motor-control/h100_plus",
      },
    ],
  },
  {
    id: "overload-relay",
    label: "Overload Relay",
    panelTitle: "Overload Relay",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "thermal-overload-relay-product",
      title: "Thermal Overload Relay",
      subtitle: "",
      image: productImg.overloadRelay,
      href: "/products-systems/motor-control/h100_plus",
    },
  },
  {
    id: "empr",
    label: "Electronic Motor Protection Relay",
    panelTitle: "EMPR",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    products: [
      {
        id: "gmp",
        title: "GMP",
        subtitle: "Electronic Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "dmpi",
        title: "DMPi",
        subtitle: "Intelligent Digital Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "imp",
        title: "IMP",
        subtitle: "Intelligent Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "mmp",
        title: "MMP",
        subtitle: "Smart Electronic Motor Protection Relay",
        image: productImg.motorProtection,
        href: "/products-systems/motor-control/h100_plus",
      },
    ],
  },
  {
    id: "manual-motor-starter",
    label: "Manual Motor Starter",
    panelTitle: "Manual Motor Starter",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: {
      id: "manual-motor-starter-product",
      title: "Manual Motor Starter",
      subtitle: "Manual Motor Starter",
      image: productImg.manualStarter,
      href: MOTOR_CONTROL_HREF,
    },
  },
  {
    id: "vfd",
    label: "Variable Frequency Drive",
    panelTitle: "Variable Frequency Drive",
    description: acbDescription,
    href: LV_AUTOMATION_HREF,
    product: [
      {
        id: "h100-plus-product",
        title: "H100 Plus",
        subtitle: "Fan and Pump Drive",
        image: productImg.vfd,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "sp100-product",
        title: "SP100",
        subtitle: "H100 Add-on optimizer",
        image: productImg.vfd,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "g100-product",
        title: "G100",
        subtitle: "General Drive",
        image: productImg.vfd,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "m100-product",
        title: "M100",
        subtitle: "Micro Drive",
        image: productImg.vfd,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "s100-product",
        title: "S100",
        subtitle: "Standard Drive",
        image: productImg.vfd,
        href: "/products-systems/motor-control/h100_plus",
      },
      {
        id: "is7-product",
        title: "iS7",
        subtitle: "Premium Drive",
        image: productImg.vfd,
        href: "/products-systems/motor-control/h100_plus",
      },
    ],
  },
];

export const devicesMegaMenu: GnbDevicesMegaMenu = {
  type: "devices",
  panelId: GNB_MEGA_PANEL_ID.devices,
  categories: [
    {
      id: "lv",
      label: "LV Products and Systems",
      href: MOTOR_CONTROL_HREF,
      children: lvDepth3,
    },
    {
      id: "mv",
      label: "MV Products and Systems",
      href: MOTOR_CONTROL_HREF,
      children: [
        {
          id: "mv-vcb",
          label: "Vacuum Circuit Breaker",
          panelTitle: "Vacuum Circuit Breaker",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "susol-ul-vcb-product",
            title: "Susol UL VCB",
            subtitle: "",
            image: productImg.vfd,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "mv-lis",
          label: "Load Interrupter Switch",
          panelTitle: "Load Interrupter Switch",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "load-interrupter-switch-product",
            title: "Load Interrupter Switch",
            subtitle: "",
            image: productImg.vfd,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "mv-mcsg",
          label: "Metal Clad Switchgear",
          panelTitle: "Metal Clad Switchgear",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "metal-clad-switchgear-product",
            title: "Metal Clad Switchgear",
            subtitle: "",
            image: productImg.vfd,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "mv-mesg",
          label: "Metal Enclosed Switchgear",
          panelTitle: "Metal Enclosed Switchgear",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "metal-enclosed-load-interrupter-switchgear-product",
            title: "Metal Enclosed Load Interrupter Switchgear",
            subtitle: "",
            image: productImg.vfd,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "mv-padmount-transformer",
          label: "Padmount Transformer",
          panelTitle: "Padmount Transformer",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "padmount-transformer-product",
            title: "Padmount Transformer",
            subtitle: "",
            image: productImg.vfd,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "mv-cast-resin-transformer",
          label: "Cast Resin Transformer",
          panelTitle: "Cast Resin Transformer",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "cast-resin-transformer-product",
            title: "Cast Resin Transformer",
            subtitle: "",
            image: productImg.vfd,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
      ],
    },
    {
      id: "hv",
      label: "HV Systems",
      href: MOTOR_CONTROL_HREF,
      children: [
        {
          id: "hv-power-transformer",
          label: "Power Transformer",
          panelTitle: "Power Transformer",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "power-transformer-product",
            title: "Power Transformer",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "hv-gis",
          label: "Gas Insulated Switchgear",
          panelTitle: "Gas Insulated Switchgear",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: [
            {
              id: "gis-product",
              title: "Gas Insulated Switchgear",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "dead-tank-product",
              title: "Dead Tank Circuit Breaker",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
          ],
        },
      ],
    },
    {
      id: "dc",
      label: "DC Products",
      href: MOTOR_CONTROL_HREF,
      children: [
        {
          id: "dc-acb",
          label: "DC Air Circuit Breaker & Switch-Disconnector",
          panelTitle: "DC Air Circuit Breaker & Switch-Disconnector",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "iec-dc-acb-product",
            title: "IEC DC ACB & Switch-Disconnector",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-csd",
          label: "DC Compact Switch-Disconnector",
          panelTitle: "DC Compact Switch-Disconnector",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "ul-dc-compact-switch-disconnector-product",
            title: "UL DC Compact Switch-Disconnector",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-switch-disconnector",
          label: "DC Switch-Disconnector",
          panelTitle: "DC Switch-Disconnector",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "ul-dc-switch-disconnector-product",
            title: "UL DC Switch-Disconnector",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-mccb",
          label: "DC Molded Case Circuit Breaker/Disconnect(Up to 600A)",
          panelTitle: "DC Molded Case Circuit Breaker/Disconnect(Up to 600A)",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "dc-mccb-product",
            title: "DC MCCB/Disconnect(DC1500V, Up to 600A)",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-msb",
          label: "DC Miniature Circuit Breaker",
          panelTitle: "DC Miniature Circuit Breaker",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "dc-mcb-product",
            title: "DC MCB(Miniature Circuit Breaker)",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-spd",
          label: "DC Surge Protective Device(UL1449)",
          panelTitle: "DC Surge Protective Device(UL1449)",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "dc-spd-product",
            title: "DC Surge Protective Device(UL1449)",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-relay",
          label: "DC Relay",
          panelTitle: "DC Relay",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "dc-relay-product",
            title: "DC Relay",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
        {
          id: "dc-ms",
          label: "DC Magnetic Contactor",
          panelTitle: "DC Magnetic Contactor",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: {
            id: "dc-ms-product",
            title: "DC Magnetic Contactor",
            subtitle: "",
            image: productImg.hvdc,
            href: "/products-systems/motor-control/h100_plus",
          },
        },
      ],
    },
    {
      id: "automation",
      label: "Industrial Automation and Control",
      href: MOTOR_CONTROL_HREF,
      children: [
        {
          id: "lv-hmi",
          label: "Human Machine Interface",
          panelTitle: "Human Machine Interface",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: [
            {
              id: "exp2-product",
              title: "eXP2",
              subtitle: "Standard Touch Panel",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "ixp3-product",
              title: "iXP3",
              subtitle: "3rd Generation Touch Panel",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "lxp-product",
              title: "LXP",
              subtitle: "Modular HMI",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
          ],
        },
        {
          id: "lv-plc",
          label: "Programable Logic Controller",
          panelTitle: "Programable Logic Controller",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: [
            {
              id: "xgt-product",
              title: "XGT",
              subtitle: "Large-Scale System",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "xgb-product",
              title: "XGB",
              subtitle: "Compact PLC",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "safety-product",
              title: "Safety PLC",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "smart-io-product",
              title: "SMART I/O",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
          ],
        },
        {
          id: "lv-motion-servo",
          label: "Motion & Servo",
          panelTitle: "Motion & Servo",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: [
            {
              id: "motion-controller-product",
              title: "Motion Controllers",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "ix7nh-servo-drives-product",
              title: "iX7NH Servo Drives",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "ix7m-servo-drives-product",
              title: "iX7M Servo Drives",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "l7nh-servo-drives-product",
              title: "L7NH Servo Drives",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "l7p-servo-drives-product",
              title: "L7P Servo Drives",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "phox-servo-drives-product",
              title: "PHOX Servo Drives",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "servo-motors-product",
              title: "Servo Motors",
              subtitle: "",
              image: productImg.hvdc,
              href: "/products-systems/motor-control/h100_plus",
            },
          ],
        },
        {
          id: "lv-vfd",
          label: "Variable Fequency Drive",
          panelTitle: "Variable Fequency Drive",
          description: acbDescription,
          href: LV_AUTOMATION_HREF,
          product: [
            {
              id: "h100-plus-product",
              title: "H100 Plus",
              subtitle: "Fan and Pump Drive",
              image: productImg.vfd,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "sp100-product",
              title: "SP100",
              subtitle: "H100 Add-on optimizer",
              image: productImg.vfd,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "g100-product",
              title: "G100",
              subtitle: "General Drive",
              image: productImg.vfd,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "m100-product",
              title: "M100",
              subtitle: "Micro Drive",
              image: productImg.vfd,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "s100-product",
              title: "S100",
              subtitle: "Standard Drive",
              image: productImg.vfd,
              href: "/products-systems/motor-control/h100_plus",
            },
            {
              id: "is7-product",
              title: "iS7",
              subtitle: "Premium Drive",
              image: productImg.vfd,
              href: "/products-systems/motor-control/h100_plus",
            },
          ],
        },
      ],
    },
    {
      id: "software",
      label: "Software",
      href: SOFTWARE_HREF,
      children: [
        {
          id: "scada-sw",
          label: "SCADA",
          // panelTitle: "SCADA",
          // description: acbDescription,
          href: softwareProductHrefs.scada,
          // product: [
          //   {
          //     id: "h100-plus-product",
          //     title: "H100 Plus",
          //     subtitle: "Fan and Pump Drive",
          //     image: productImg.vfd,
          //     href: "/products-systems/motor-control/h100_plus",
          //   },
          //   {
          //     id: "sp100-product",
          //     title: "SP100",
          //     subtitle: "H100 Add-on optimizer",
          //     image: productImg.vfd,
          //     href: "/products-systems/motor-control/h100_plus",
          //   },
          //   {
          //     id: "g100-product",
          //     title: "G100",
          //     subtitle: "General Drive",
          //     image: productImg.vfd,
          //     href: "/products-systems/motor-control/h100_plus",
          //   },
          //   {
          //     id: "m100-product",
          //     title: "M100",
          //     subtitle: "Micro Drive",
          //     image: productImg.vfd,
          //     href: "/products-systems/motor-control/h100_plus",
          //   },
          //   {
          //     id: "s100-product",
          //     title: "S100",
          //     subtitle: "Standard Drive",
          //     image: productImg.vfd,
          //     href: "/products-systems/motor-control/h100_plus",
          //   },
          //   {
          //     id: "is7-product",
          //     title: "iS7",
          //     subtitle: "Premium Drive",
          //     image: productImg.vfd,
          //     href: "/products-systems/motor-control/h100_plus",
          //   },
          // ],
        },
        {
          id: "xems-sw",
          label: "xEMS",
          href: softwareProductHrefs.xems,
        },
        {
          id: "micro-grid-sw",
          label: "Micro Grid",
          href: softwareProductHrefs.microGrid,
        },
        {
          id: "diganosis-system-sw",
          label: "Smart Factory",
          href: softwareProductHrefs.smartFactory,
        },
      ],
    },
  ],
};

export const devicesMegaDefaultCategoryId = "lv";
export const devicesMegaDefaultDepth3Id = "acb-pcb";
