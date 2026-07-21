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
    href: "/products-category/lv-products-and-systems",
    // 실데이터는 fetchDevicesMegaMenu()(category-data 기반, 서버에서 조회)로 override됨.
    // 조회 실패/0건일 때만 쓰이는 최소 폴백 — categories 비어있으면 메가패널 자체가 안 열림.
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
