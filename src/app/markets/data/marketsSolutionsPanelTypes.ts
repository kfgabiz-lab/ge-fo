export type MarketsSolutionDiagram = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type MarketsSolutionBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Figma — Key Solutions : … (commercial) */
  keySolutions?: string;
  /** Figma — Key Capabilities bullet list (industrial) */
  capabilities?: string[];
};

export type MarketsSolutionGroup = {
  id: string;
  blocks: MarketsSolutionBlock[];
  diagram?: MarketsSolutionDiagram;
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
};
