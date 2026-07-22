import {
  isDevicesMegaMenu,
  isSimpleMegaMenu,
  type GnbMegaMenu,
} from "@/data/gnb";

export function getMegaPanelClassName(
  megaMenu: GnbMegaMenu,
  isPanelOpen: boolean,
): string {
  return [
    "gnb_mega",
    "is-mounted",
    isDevicesMegaMenu(megaMenu)
      ? "gnb_mega--devices"
      : isSimpleMegaMenu(megaMenu) && megaMenu.layout === "sections"
        ? "gnb_mega--simple gnb_mega--sections"
        : "gnb_mega--simple gnb_mega--grid",
    isPanelOpen ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
