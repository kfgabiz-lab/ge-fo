import type { MarketsSolutionsPanelProps } from "./marketsSolutionsPanelTypes";
import {
  oilGasMiningSolutionsBlocks,
  oilGasMiningSolutionsDiagram,
  oilGasMiningSolutionsIntro,
} from "./marketsOilGasMiningSolutionsContent";

export const oilGasMiningSolutionsPanel: MarketsSolutionsPanelProps = {
  sectionId: "markets-oil-gas-mining-solutions",
  title: oilGasMiningSolutionsIntro.title,
  description: oilGasMiningSolutionsIntro.description,
  layout: "stacked",
  groups: [{ id: "main", blocks: oilGasMiningSolutionsBlocks }],
  trailingDiagram: oilGasMiningSolutionsDiagram,
};
