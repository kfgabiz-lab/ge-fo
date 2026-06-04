import type { ComponentType } from "react";
import type { GnbMegaPanelNavId } from "@/data/gnb/panelIds";
import type {
  GnbMegaDevicesPanelProps,
  GnbMegaSimplePanelStateProps,
} from "@/components/layout/shared/gnb-mega/types";
import GnbCareersMegaPanel from "@/components/layout/shared/gnb-mega/GnbCareersMegaPanel";
import GnbCompanyMegaPanel from "@/components/layout/shared/gnb-mega/GnbCompanyMegaPanel";
import GnbDevicesMegaPanel from "@/components/layout/shared/gnb-mega/GnbDevicesMegaPanel";
import GnbMarketsMegaPanel from "@/components/layout/shared/gnb-mega/GnbMarketsMegaPanel";
import GnbServicesMegaPanel from "@/components/layout/shared/gnb-mega/GnbServicesMegaPanel";
import GnbSupportMegaPanel from "@/components/layout/shared/gnb-mega/GnbSupportMegaPanel";

export { getMegaPanelClassName } from "@/components/layout/shared/gnb-mega/getMegaPanelClassName";
export type {
  GnbMegaDevicesPanelProps,
  GnbMegaSimplePanelStateProps,
} from "@/components/layout/shared/gnb-mega/types";

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
