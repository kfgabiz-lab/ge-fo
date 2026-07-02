import type { ComponentType } from "react";
import type { GnbMegaPanelNavId } from "@/data/gnb/panelIds";
import type {
  GnbMegaDevicesPanelProps,
  GnbMegaSimplePanelStateProps,
} from "@/components/common/gnb/mega/types";
import GnbCareersMegaPanel from "@/components/common/gnb/mega/GnbCareersMegaPanel";
import GnbCompanyMegaPanel from "@/components/common/gnb/mega/GnbCompanyMegaPanel";
import GnbDevicesMegaPanel from "@/components/common/gnb/mega/GnbDevicesMegaPanel";
import GnbMarketsMegaPanel from "@/components/common/gnb/mega/GnbMarketsMegaPanel";
import GnbServicesMegaPanel from "@/components/common/gnb/mega/GnbServicesMegaPanel";
import GnbSupportMegaPanel from "@/components/common/gnb/mega/GnbSupportMegaPanel";

export { getMegaPanelClassName } from "@/components/common/gnb/mega/getMegaPanelClassName";
export type {
  GnbMegaDevicesPanelProps,
  GnbMegaSimplePanelStateProps,
} from "@/components/common/gnb/mega/types";

type GnbMegaPanelComponentProps =
  | GnbMegaDevicesPanelProps
  | GnbMegaSimplePanelStateProps;

export const gnbMegaPanelComponents: Record<
  GnbMegaPanelNavId,
  ComponentType<GnbMegaPanelComponentProps>
> = {
  devices: GnbDevicesMegaPanel as ComponentType<GnbMegaPanelComponentProps>,
  markets: GnbMarketsMegaPanel as ComponentType<GnbMegaPanelComponentProps>,
  services: GnbServicesMegaPanel as ComponentType<GnbMegaPanelComponentProps>,
  support: GnbSupportMegaPanel as ComponentType<GnbMegaPanelComponentProps>,
  careers: GnbCareersMegaPanel as ComponentType<GnbMegaPanelComponentProps>,
  company: GnbCompanyMegaPanel as ComponentType<GnbMegaPanelComponentProps>,
};

export function isGnbMegaPanelNavId(navId: string): navId is GnbMegaPanelNavId {
  return navId in gnbMegaPanelComponents;
}

