import { companyMegaMenu } from "@/data/gnb/mega/company";
import { devicesMegaMenu } from "@/data/gnb/mega/devices";
import { marketsMegaMenu } from "@/data/gnb/mega/markets";
import { servicesMegaMenu } from "@/data/gnb/mega/services";
import { supportMegaMenu } from "@/data/gnb/mega/support";
import type { GnbNavItem } from "@/data/gnb/types";

export const gnbNavItems: GnbNavItem[] = [
  {
    id: "devices",
    label: "Products & Systems",
    href: "/products-systems/motor-control",
    megaMenu: devicesMegaMenu,
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
