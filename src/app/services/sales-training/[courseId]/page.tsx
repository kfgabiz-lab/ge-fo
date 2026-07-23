import type { Metadata } from "next";
import TrainingDetailPage from "@/app/services/training/components/TrainingDetailPage";
import { TRAINING_COURSE_CODE } from "@/app/services/training/data/trainingData";
import {
  buildCourseMetadata,
  fetchTrainingDetailRows,
} from "@/app/services/training/data/trainingDetailData";

/** P-FO-SERV-030100P_2 — Sales Training 코스 상세 (1뎁스) */
type PageProps = {
  params: Promise<{ courseId: string }>;
};

// OG 메타(코스): page 컴포넌트와 동일 인자(fetchTrainingDetailRows)로 조회 → fetch memoization 으로 실제 요청 1회.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const rows = await fetchTrainingDetailRows(courseId);
  return buildCourseMetadata(rows, TRAINING_COURSE_CODE.sales);
}

export default async function SalesTrainingDetailRoute({ params }: PageProps) {
  const { courseId } = await params;
  return <TrainingDetailPage variant="sales" courseId={courseId} />;
}
