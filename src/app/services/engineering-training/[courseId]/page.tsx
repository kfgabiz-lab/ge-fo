import type { Metadata } from "next";
import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";
import { buildCourseMetadata } from "@/app/services/training/data/trainingDetailData";

/** P-FO-SERV-030100P — Engineering Training 코스 상세 (1뎁스) */
type PageProps = {
  params: Promise<{ courseId: string }>;
};

// OG 메타(코스): 부모 커리큘럼(currMgmt-data) 라이브 조회 결과 사용.
// page 컴포넌트와 동일 인자로 조회하므로 fetch memoization 으로 실제 요청 1회.
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
