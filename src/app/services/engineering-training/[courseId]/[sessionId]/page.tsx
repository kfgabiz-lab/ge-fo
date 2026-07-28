import type { Metadata } from "next";
import TrainingSessionPage from "@/app/services/training/components/TrainingSessionPage";
import { buildSessionMetadata } from "@/app/services/training/data/trainingDetailData";

/** P-FO-SERV-030101P — Engineering Training 세션 상세 (2뎁스) */
type PageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

// OG 메타(세션): 회차 행 + 부모 커리큘럼(라이브) 조회 결과 사용.
// page 컴포넌트와 동일 인자로 조회하므로 fetch memoization 으로 실제 요청 1회.
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
