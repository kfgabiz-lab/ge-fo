import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingProductNameMap,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
  toTrainingSessionDetail,
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
  const [rows, curriculum, categoryCodes, trainingTypeCodes, productNameMap] =
    await Promise.all([
      // 코스와 동일한 다건 조회(unpaged). 세션 2뎁스는 이 결과에서 행 PK(id===sessionId) 1건 선택.
      // generateMetadata 와 동일 인자로 fetchTrainingDetailRows 공용 호출 → fetch memoization 으로 실제 요청 1회.
      fetchTrainingDetailRows(courseId),
      // 카테고리/제목 등 코스 레벨 값은 부모 커리큘럼 라이브 조회 결과 사용(스냅샷 사용 금지).
      fetchTrainingCurriculum(courseId),
      fetchTrainingCategories(),
      fetchTrainingTypeCodes(),
      fetchTrainingProductNameMap(),
    ]);

  // 커리큘럼 미존재/비공개면 404 (회차 상세는 부모가 공개 상태여야 접근 가능)
  if (!curriculum || !isCurriculumVisible(curriculum)) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  // 과거제외 게이트 + 행 PK 매칭(미매칭 시 null → 404).
  // variant 무관 동일 커리큘럼 노출 정책 → training_course 게이트 없음.
  const session = toTrainingSessionDetail(
    rows,
    courseId,
    sessionId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
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
      <TrainingSessionDetail session={session} variant={variant} />
    </main>
  );
}
