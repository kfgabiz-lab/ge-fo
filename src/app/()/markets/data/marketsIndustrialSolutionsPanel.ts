import type { MarketsSolutionsPanelProps } from "./marketsSolutionsPanelTypes";
import {
  industrialSolutionsDiagram,
  industrialSolutionsIntro,
} from "./marketsIndustrialSolutionsContent";

export const industrialSolutionsPanel: MarketsSolutionsPanelProps = {
  sectionId: "markets-industrial-solutions",
  title: industrialSolutionsIntro.title,
  description: industrialSolutionsIntro.description,
  layout: "stacked",
  groups: [],
  trailingDiagram: industrialSolutionsDiagram,
};
