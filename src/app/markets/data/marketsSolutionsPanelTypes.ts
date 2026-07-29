export type MarketsSolutionDiagram = {
  src: string;
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
  keySolutions?: string;
  capabilities?: string[];
};

export type MarketsSolutionGroup = {
  id: string;
  blocks: MarketsSolutionBlock[];
  diagram?: MarketsSolutionDiagram;
};

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
  trailingDiagram?: MarketsSolutionDiagram;
  categories?: MarketsSolutionCategory[];
};
