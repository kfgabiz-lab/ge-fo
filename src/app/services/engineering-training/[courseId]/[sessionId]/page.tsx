import type { Metadata } from "next";
import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";
import { TRAINING_COURSE_CODE } from "@/app/services/training/data/trainingData";
import {
  buildSessionMetadata,
  fetchTrainingDetailRows,
} from "@/app/services/training/data/trainingDetailData";

/** P-FO-SERV-030101P — Engineering Training 세션 상세 (2뎁스) */
type PageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

// OG 메타(세션): page 컴포넌트와 동일 인자(fetchTrainingDetailRows)로 조회 → fetch memoization 으로 실제 요청 1회.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId, sessionId } = await params;
  const rows = await fetchTrainingDetailRows(courseId);
  return buildSessionMetadata(rows, sessionId, TRAINING_COURSE_CODE.engineering);
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
