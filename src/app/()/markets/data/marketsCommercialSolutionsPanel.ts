import type { MarketsSolutionsPanelProps } from "./marketsSolutionsPanelTypes";
import {
  commercialSolutionsDiagrams,
  commercialSolutionsHvacBlock,
  commercialSolutionsIntro,
  commercialSolutionsPowerBlocks,
} from "./marketsCommercialSolutionsContent";

export const commercialSolutionsPanel: MarketsSolutionsPanelProps = {
  sectionId: "markets-commercial-solutions",
  title: commercialSolutionsIntro.title,
  description: commercialSolutionsIntro.description,
  layout: "grouped",
  groups: [
    {
      id: "power",
      blocks: commercialSolutionsPowerBlocks,
      diagram: commercialSolutionsDiagrams.power,
    },
    {
      id: "hvac",
      blocks: [commercialSolutionsHvacBlock],
      diagram: commercialSolutionsDiagrams.hvac,
    },
  ],
};
