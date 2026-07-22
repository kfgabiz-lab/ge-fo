export type MarketsSolutionDiagram = {
  src: string;
  /** 모바일 전용 다이어그램 (미지정 시 src 사용) */
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;
  mobileWidth?: number;
  mobileHeight?: number;
};

export type MarketsSolutionBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Figma — Key Solutions: … (commercial / public-infrastructure) */
  keySolutions?: string;
  /** Figma — Key Capabilities bullet list (industrial) */
  capabilities?: string[];
};

export type MarketsSolutionGroup = {
  id: string;
  blocks: MarketsSolutionBlock[];
  diagram?: MarketsSolutionDiagram;
};

/** Industrial mobile — navy header + bullet cards (Figma 7465:147605) */
export type MarketsSolutionCategory = {
  id: string;
  title: string;
  items: string[];
};

export type MarketsSolutionsPanelLayout = "grouped" | "stacked";

export type MarketsSolutionsPanelProps = {
  sectionId: string;
  title: string;
  description: string;
  layout: MarketsSolutionsPanelLayout;
  groups: MarketsSolutionGroup[];
  /** stacked 레이아웃 — 그룹 하단 공통 다이어그램 */
  trailingDiagram?: MarketsSolutionDiagram;
  /** industrial mobile — 다이어그램 하단 카테고리 카드 */
  categories?: MarketsSolutionCategory[];
};
