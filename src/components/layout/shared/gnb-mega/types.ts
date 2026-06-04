import type { GnbSimpleMegaItem } from '@/data/gnb/types';

export type GnbMegaSimplePanelStateProps = {
  activeItemId: string;
  onItemEnter: (itemId: string) => void;
  onItemClick?: () => void;
  /** API에서 가져온 items — 있으면 하드코딩 데이터 대신 사용 */
  items?: GnbSimpleMegaItem[];
};

export type GnbMegaDevicesPanelProps = {
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  megaView: "category" | "explore-all";
  onExploreAllClick: () => void;
  onExploreAllBack: () => void;
  onLinkClick?: () => void;
};
