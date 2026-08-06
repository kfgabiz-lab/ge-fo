import type { Metadata, ResolvingMetadata } from "next";
import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";
import { buildCourseMetadata } from "@/app/services/training/data/trainingDetailData";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { courseId } = await params;
  return buildCourseMetadata(courseId, parent);
}

export default async function SalesTrainingDetailRoute({ params }: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage variant="sales" courseId={courseId} />;
}
