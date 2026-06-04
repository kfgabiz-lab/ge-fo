export type GnbMegaProduct = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

export type GnbMegaDepth3 = {
  id: string;
  label: string;
  panelTitle: string;
  description: string[];
  href: string;
  products?: GnbMegaProduct[];
  product?: GnbMegaProduct;
};

export type GnbMegaDepth2 = {
  id: string;
  label: string;
  children: GnbMegaDepth3[];
};

export type GnbSimpleMegaItem = {
  id: string;
  title: string;
  description?: string;
  descriptionLines?: string[];
  href: string;
  external?: boolean;
};

export type GnbSimpleMegaSection = {
  id: string;
  label: string;
  items: GnbSimpleMegaItem[];
};

export type GnbMegaPanelMeta = {
  panelId: string;
};

export type GnbSimpleMegaMenu = GnbMegaPanelMeta &
  (
    | {
        type: "simple";
        layout: "grid";
        items: GnbSimpleMegaItem[];
      }
    | {
        type: "simple";
        layout: "sections";
        sections: GnbSimpleMegaSection[];
      }
  );

export type GnbDevicesMegaMenu = GnbMegaPanelMeta & {
  type: "devices";
  categories: GnbMegaDepth2[];
};

export type GnbMegaMenu = GnbSimpleMegaMenu | GnbDevicesMegaMenu;

export type GnbNavItem = {
  id: string;
  label: string;
  href: string;
  megaMenu?: GnbMegaMenu;
};

export function isDevicesMegaMenu(menu: GnbMegaMenu): menu is GnbDevicesMegaMenu {
  return menu.type === "devices";
}

export function isSimpleMegaMenu(menu: GnbMegaMenu): menu is GnbSimpleMegaMenu {
  return menu.type === "simple";
}

export function getFirstSimpleMegaItemId(menu: GnbSimpleMegaMenu): string {
  if (menu.layout === "grid") {
    return menu.items[0]?.id ?? "";
  }

  return menu.sections[0]?.items[0]?.id ?? "";
}
