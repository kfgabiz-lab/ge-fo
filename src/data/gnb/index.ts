export * from "@/data/gnb/types";
export {
  GNB_MEGA_PANEL_ID,
  getGnbMegaPanelId,
  type GnbMegaPanelNavId,
} from "@/data/gnb/panelIds";
export {
  fetchGnbMenuData,
  resolveGnbNavItems,
  type FoGnbMenuApiNode,
} from "@/data/gnb/fromApi";
export { fetchDevicesMegaMenu } from "@/data/gnb/fromCategoryData";
export { marketsMegaMenu } from "@/data/gnb/mega/markets";
