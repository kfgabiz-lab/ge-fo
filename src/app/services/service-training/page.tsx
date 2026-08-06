import type { Metadata, ResolvingMetadata } from "next";
import TrainingCurriculumPage from "@/app/services/training/components/TrainingCurriculumPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/services/service-training", parent);
}

export default function ServiceTrainingPage() {
  return <TrainingCurriculumPage variant="service" />;
}
