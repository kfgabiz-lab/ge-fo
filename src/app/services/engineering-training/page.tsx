import type { Metadata, ResolvingMetadata } from "next";
import TrainingCurriculumPage from "@/app/services/training/components/TrainingCurriculumPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/services/engineering-training", parent);
}

export default function EngineeringTrainingPage() {
  return <TrainingCurriculumPage variant="engineering" />;
}
