import type { Metadata } from "next";
import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";
import { buildCourseMetadata } from "@/app/services/training/data/trainingDetailData";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  return buildCourseMetadata(courseId);
}

export default async function EngineeringTrainingDetailRoute({
  params,
}: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage variant="engineering" courseId={courseId} />;
}
