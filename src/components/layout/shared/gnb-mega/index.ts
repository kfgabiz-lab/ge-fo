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

/**
 * 메가메뉴 데이터 형태(devices/grid/sections)로 렌더 컴포넌트를 고른다.
 * 고정 navId 목록에 의존하지 않음 — sections형은 루트 메뉴 개수와 무관하게 이 컴포넌트 하나를 공유한다.
 */
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
