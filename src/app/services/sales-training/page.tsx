import type { Metadata, ResolvingMetadata } from "next";
import TrainingCurriculumPage from "@/app/services/training/components/TrainingCurriculumPage";
import { buildMenuSeoMetadata } from "@/lib/menuSeo";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata("/services/sales-training", parent);
}

export default function SalesTrainingPage() {
  return <TrainingCurriculumPage variant="sales" />;
}
