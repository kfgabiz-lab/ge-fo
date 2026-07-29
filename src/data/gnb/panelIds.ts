export const GNB_MEGA_PANEL_ID = {
  devices: "gnb-mega-panel-devices",
  markets: "gnb-mega-panel-markets",
  services: "gnb-mega-panel-services",
  support: "gnb-mega-panel-support",
  careers: "gnb-mega-panel-careers",
  company: "gnb-mega-panel-company",
} as const;

export type GnbMegaPanelNavId = keyof typeof GNB_MEGA_PANEL_ID;

export function getGnbMegaPanelId(navId: string): string {
  return (
    GNB_MEGA_PANEL_ID[navId as GnbMegaPanelNavId] ?? `gnb-mega-panel-${navId}`
  );
}
