import type { GnbMegaDepth2, GnbSimpleMegaMenu } from "@/data/gnb/types";

export type GnbMegaSimplePanelStateProps = {
  title: string;
  menu: GnbSimpleMegaMenu;
  onItemClick?: () => void;
  onClose?: () => void;
};

export type GnbMegaDevicesPanelProps = {
  categories: GnbMegaDepth2[];
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  onLinkClick?: () => void;
  onClose?: () => void;
};
