import type { GnbMegaDepth2, GnbSimpleMegaMenu } from "@/data/gnb/types";

export type GnbMegaSimplePanelStateProps = {
  /** 패널 상단에 표시할 제목 — GnbNavItem.label(=API node.name, 즉 DB 값) 그대로 전달 */
  title: string;
  /** 서버에서 API로 조회해 변환한 메가 메뉴 데이터 (정적 import 대신 prop으로 주입) */
  menu: GnbSimpleMegaMenu;
  onItemClick?: () => void;
};

export type GnbMegaDevicesPanelProps = {
  /** 서버에서 category-data로 조회해 조립한 devices 메가메뉴 데이터 (정적 import 대신 prop으로 주입) */
  categories: GnbMegaDepth2[];
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  onLinkClick?: () => void;
};
