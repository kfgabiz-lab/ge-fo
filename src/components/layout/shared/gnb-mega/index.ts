import type { ComponentType } from "react";
import { isDevicesMegaMenu, isSimpleMegaMenu, type GnbMegaMenu } from "@/data/gnb/types";
import type {
  GnbMegaDevicesPanelProps,
  GnbMegaSimplePanelStateProps,
} from "@/components/layout/shared/gnb-mega/types";
import GnbDevicesMegaPanel from "@/components/layout/shared/gnb-mega/GnbDevicesMegaPanel";
import GnbMarketsMegaPanel from "@/components/layout/shared/gnb-mega/GnbMarketsMegaPanel";
import GnbSectionsMegaPanel from "@/components/layout/shared/gnb-mega/GnbSectionsMegaPanel";

export { getMegaPanelClassName } from "@/components/layout/shared/gnb-mega/getMegaPanelClassName";
export type {
  GnbMegaDevicesPanelProps,
  GnbMegaSimplePanelStateProps,
} from "@/components/layout/shared/gnb-mega/types";

type GnbMegaPanelComponentProps =
  | GnbMegaDevicesPanelProps
  | GnbMegaSimplePanelStateProps;

export function getGnbMegaPanelComponent(
  menu: GnbMegaMenu,
): ComponentType<GnbMegaPanelComponentProps> {
  if (isDevicesMegaMenu(menu)) {
    return GnbDevicesMegaPanel as ComponentType<GnbMegaPanelComponentProps>;
  }
  if (isSimpleMegaMenu(menu) && menu.layout === "grid") {
    return GnbMarketsMegaPanel as ComponentType<GnbMegaPanelComponentProps>;
  }
  return GnbSectionsMegaPanel as ComponentType<GnbMegaPanelComponentProps>;
}
