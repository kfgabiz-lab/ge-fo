export type GnbMegaSimplePanelStateProps = {
  onItemClick?: () => void;
};

export type GnbMegaDevicesPanelProps = {
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  onLinkClick?: () => void;
};
