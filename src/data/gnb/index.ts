export * from "@/data/gnb/types";
export {
  GNB_MEGA_PANEL_ID,
  getGnbMegaPanelId,
  type GnbMegaPanelNavId,
} from "@/data/gnb/panelIds";
export { gnbNavItems } from "@/data/gnb/navItems";
export {
  fetchGnbMenuData,
  resolveGnbNavItems,
  type FoGnbMenuApiNode,
} from "@/data/gnb/fromApi";
export { fetchDevicesMegaMenu } from "@/data/gnb/fromCategoryData";
export { marketsMegaMenu } from "@/data/gnb/mega/markets";
export { servicesMegaMenu } from "@/data/gnb/mega/services";
export { supportMegaMenu } from "@/data/gnb/mega/support";
export { careersMegaMenu } from "@/data/gnb/mega/careers";
export { companyMegaMenu } from "@/data/gnb/mega/company";
