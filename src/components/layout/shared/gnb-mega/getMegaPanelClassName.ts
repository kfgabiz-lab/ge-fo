import {
  GNB_MEGA_PANEL_ID,
  isDevicesMegaMenu,
  isSimpleMegaMenu,
  type GnbMegaMenu,
} from "@/data/gnb";

export function getMegaPanelClassName(
  megaMenu: GnbMegaMenu,
  megaView: "category" | "explore-all",
  isPanelOpen: boolean,
): string {
  const isServicesSections =
    isSimpleMegaMenu(megaMenu) &&
    megaMenu.layout === "sections" &&
    megaMenu.panelId === GNB_MEGA_PANEL_ID.services;

  const isCareersSections =
    isSimpleMegaMenu(megaMenu) &&
    megaMenu.layout === "sections" &&
    megaMenu.panelId === GNB_MEGA_PANEL_ID.careers;

  const isCompanySections =
    isSimpleMegaMenu(megaMenu) &&
    megaMenu.layout === "sections" &&
    megaMenu.panelId === GNB_MEGA_PANEL_ID.company;

  const isMarketsGrid =
    isSimpleMegaMenu(megaMenu) &&
    megaMenu.layout === "grid" &&
    megaMenu.panelId === GNB_MEGA_PANEL_ID.markets;

  return [
    "gnb_mega",
    "is-mounted",
    isDevicesMegaMenu(megaMenu)
      ? "gnb_mega--devices"
      : isSimpleMegaMenu(megaMenu) && megaMenu.layout === "sections"
        ? isServicesSections
          ? "gnb_mega--simple gnb_mega--sections gnb_mega--services"
          : isCareersSections
            ? "gnb_mega--simple gnb_mega--sections gnb_mega--careers"
            : isCompanySections
              ? "gnb_mega--simple gnb_mega--sections gnb_mega--company"
              : "gnb_mega--simple gnb_mega--sections"
        : isMarketsGrid
          ? "gnb_mega--simple gnb_mega--grid gnb_mega--markets"
          : "gnb_mega--simple gnb_mega--grid",
    megaView === "explore-all" ? "gnb_mega--explore-all" : "",
    isPanelOpen ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
