import type { Metadata } from "next";
import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";
import { buildSessionMetadata } from "@/app/services/training/data/trainingDetailData";

type PageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId, sessionId } = await params;
  return buildSessionMetadata(courseId, sessionId);
}

export default async function EngineeringTrainingSessionRoute({
  params,
}: PageProps) {
  const { courseId, sessionId } = await params;
  return (
    <TrainingSessionPage
      variant="engineering"
      courseId={courseId}
      sessionId={sessionId}
    />
  );
}
