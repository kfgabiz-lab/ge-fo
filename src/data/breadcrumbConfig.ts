export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

export type BreadcrumbConfig = {
  crumbs: BreadcrumbCrumb[];
  current: string;
};

const configs: Record<string, BreadcrumbConfig> = {
  "/markets/commercial-residential": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Commercial & Residential",
  },
  "/markets/data-center": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Data Center",
  },
  "/devices-systems/motor-control": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
    ],
    current: "Motor Control",
  },
  "/devices-systems/lv-automation": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
    ],
    current: "LV Automation",
  },
  "/devices-systems/variable-frequency-drive": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
      { label: "LV Automation", href: "/devices-systems/lv-automation" },
    ],
    current: "Variable Frequency Drive",
  },
  "/devices-systems/motor-control/metasol-ms": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
      { label: "Motor Control", href: "/devices-systems/motor-control" },
    ],
    current: "Metasol MS",
  },
  "/devices-systems/hv-system": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
    ],
    current: "HV System",
  },
  "/devices-systems/hv-system/hvdc": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
      { label: "HV System", href: "/devices-systems/hv-system" },
    ],
    current: "HVDC",
  },
};

export function getBreadcrumbConfig(pathname: string): BreadcrumbConfig {
  return (
    configs[pathname] ?? {
      crumbs: [],
      current: "",
    }
  );
}
