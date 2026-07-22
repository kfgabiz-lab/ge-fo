import { notFound } from "next/navigation";
import type { PageDataItem } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";
import type { TrainingVariant } from "../data/trainingContent";
import {
  TRAINING_COURSE_CODE,
  fetchTrainingCategories,
  toCategoryMap,
} from "../data/trainingData";
import {
  TRAINING_DETAIL_SLUG,
  fetchTrainingTypeCodes,
  toTrainingSessionDetail,
  trainingDetailWhere,
} from "../data/trainingDetailData";
import TrainingSessionDetail from "./TrainingSessionDetail";
import "@/assets/css/training.css";

// Training 세션 상세(2뎁스) 공통 조립 래퍼.
// STEP6 데이터바인딩: 코스와 동일한 currDtlMgmt-data 단건을 조회한 뒤,
// training_schedule 배열에서 sessionId(=아이템 id) 매칭 1건을 골라 표시(별도 세션 API 없음).
export default async function TrainingSessionPage({
  variant,
  courseId,
  sessionId,
}: {
  variant: TrainingVariant;
  courseId: string;
  sessionId: string;
}) {
  const [result, categoryCodes, trainingTypeCodes] = await Promise.all([
    fetchData<PageDataItem>({
      slug: TRAINING_DETAIL_SLUG,
      where: trainingDetailWhere(courseId),
      sort: "updatedAt,desc",
      리턴함수: (rows) => rows,
    }),
    fetchTrainingCategories(),
    fetchTrainingTypeCodes(),
  ]);

  const row = result.content[0];
  if (!row) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  // 이중 공개 게이트 + variant 오배치 방어 + sessionId 매칭(미매칭 시 null → 404)
  const session = toTrainingSessionDetail(
    row,
    courseId,
    sessionId,
    categoryMap,
    trainingTypeMap,
    TRAINING_COURSE_CODE[variant],
  );
  if (!session) {
    notFound();
  }

  return (
    // data-slug: 세션 상세도 코스와 동일한 currDtlMgmt-data 단건.
    // 아래 data-slugkey 는 코스레벨 필드(curriculum_detail*/부모 curriculum)와
    // 매칭된 training_schedule 아이템 필드(date/title)가 섞여 있음.
    <main
      className={`support-page support-page--${variant}-training-session`}
      id="P-FO-SERV-030101P"
      data-slug="currDtlMgmt-data"
    >
      <TrainingSessionDetail session={session} />
    </main>
  );
}
