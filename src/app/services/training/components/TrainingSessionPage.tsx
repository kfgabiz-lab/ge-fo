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
  TRAINING_DETAIL_SORT,
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
    // 코스와 동일한 다건 조회(unpaged). 세션 2뎁스는 이 결과에서 행 PK(id===sessionId) 1건 선택.
    fetchData<PageDataItem>({
      slug: TRAINING_DETAIL_SLUG,
      where: trainingDetailWhere(courseId),
      sort: TRAINING_DETAIL_SORT,
      unpaged: true,
      리턴함수: (rows) => rows,
    }),
    fetchTrainingCategories(),
    fetchTrainingTypeCodes(),
  ]);

  const rows = result.content;
  if (rows.length === 0) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  // 공개/과거제외 게이트 + variant 오배치 방어 + 행 PK 매칭(미매칭 시 null → 404)
  const session = toTrainingSessionDetail(
    rows,
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
    // 1:N 모델: 회차 상세는 currDtlMgmt-data 단건(해당 교육회차 행 PK로 취득).
    // 아래 data-slugkey 는 이 행의 필드(curriculum_detail1/2.*, 부모 _fetchedRel8.curriculum.*)와
    // 그 행 내부 training_schedule 배열(Agenda 중첩 반복)로 구성됨.
    <main
      className={`support-page support-page--${variant}-training-session`}
      id="P-FO-SERV-030101P"
      data-slug="currDtlMgmt-data"
    >
      <TrainingSessionDetail session={session} />
    </main>
  );
}
