import type { MarketsSolutionsPanelProps } from "./marketsSolutionsPanelTypes";
import {
  publicInfrastructureAutomationBlock,
  publicInfrastructurePowerBlock,
  publicInfrastructureSolutionsDiagrams,
  publicInfrastructureSolutionsIntro,
} from "./marketsPublicInfrastructureSolutionsContent";

export const publicInfrastructureSolutionsPanel: MarketsSolutionsPanelProps = {
  sectionId: "markets-public-infrastructure-solutions",
  title: publicInfrastructureSolutionsIntro.title,
  description: publicInfrastructureSolutionsIntro.description,
  layout: "grouped",
  groups: [
    {
      id: "power",
      blocks: [publicInfrastructurePowerBlock],
      diagram: publicInfrastructureSolutionsDiagrams.power,
    },
    {
      id: "automation",
      blocks: [publicInfrastructureAutomationBlock],
      diagram: publicInfrastructureSolutionsDiagrams.automation,
    },
  ],
};
