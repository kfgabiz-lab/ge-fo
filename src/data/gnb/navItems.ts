import { companyMegaMenu } from "@/data/gnb/mega/company";
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { marketsMegaMenu } from "@/data/gnb/mega/markets";
import { servicesMegaMenu } from "@/data/gnb/mega/services";
import { supportMegaMenu } from "@/data/gnb/mega/support";
import type { GnbNavItem } from "@/data/gnb/types";

export const gnbNavItems: GnbNavItem[] = [
  {
    id: "devices",
    label: "Products & Systems",
    href: "",
    megaMenu: { type: "devices", panelId: GNB_MEGA_PANEL_ID.devices, categories: [] },
  },
  {
    id: "markets",
    label: "Markets",
    href: "/markets/commercial-residential",
    megaMenu: marketsMegaMenu,
  },
  {
    id: "services",
    label: "Services",
    href: "",
    megaMenu: servicesMegaMenu,
  },
  {
    id: "support",
    label: "Support",
    href: "",
    megaMenu: supportMegaMenu,
  },
  {
    id: "company",
    label: "Company",
    href: "",
    megaMenu: companyMegaMenu,
  },
];
