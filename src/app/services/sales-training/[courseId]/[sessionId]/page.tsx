import type { Metadata, ResolvingMetadata } from "next";
import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";
import { buildSessionMetadata } from "@/app/services/training/data/trainingDetailData";

type PageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { courseId, sessionId } = await params;
  return buildSessionMetadata(courseId, sessionId, parent);
}

export default async function SalesTrainingSessionRoute({ params }: PageProps) {
  const { courseId, sessionId } = await params;
  return (
    <TrainingSessionPage
      variant="sales"
      courseId={courseId}
      sessionId={sessionId}
    />
  );
}
