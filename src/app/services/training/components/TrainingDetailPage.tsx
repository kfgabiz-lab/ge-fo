import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import {
  TRAINING_COURSE_CODE,
  fetchTrainingCategories,
  toCategoryMap,
} from "../data/trainingData";
import {
  fetchTrainingDetailRows,
  fetchTrainingTypeCodes,
  toTrainingCourseDetail,
} from "../data/trainingDetailData";
import TrainingDetailHero from "./TrainingDetailHero";
import TrainingDetailSchedule from "./TrainingDetailSchedule";
import "@/assets/css/training.css";

// Training 코스 상세(1뎁스) 공통 조립 래퍼.
// STEP6 데이터바인딩: 정적 콘텐츠 → currDtlMgmt-data 단건(옵션A 역방향 필터조회)으로 대체.
// - 조회는 공통 fetchData(목록 브랜치, 리턴함수=(rows)=>rows)로 raw PageDataItem[] 취득 → content[0] 채택
// - 코드그룹(PRODUCTCATEGORY/TRAININGTYPE)은 라벨 변환용으로 병렬 조회(리스트 패턴 동일)
// - 정적 유지 요소(필터 셀렉트 등)는 뷰모델 빌더 내부에서 정적 콘텐츠 재사용
export default async function TrainingDetailPage({
  variant,
  courseId,
}: {
  variant: TrainingVariant;
  courseId: string;
}) {
  const [rows, categoryCodes, trainingTypeCodes] = await Promise.all([
    // 옵션A: courseId(부모 currMgmt-data.id) 역방향 + 공개(is_visible=001) + 과거회차 제외 where.
    // 1:N 모델: 다건 교육회차 전체를 unpaged 로 받아(정렬=교육 시작일 asc) 각 행을 카드로 렌더.
    // generateMetadata 와 동일 인자로 fetchTrainingDetailRows 공용 호출 → fetch memoization 으로 실제 요청 1회.
    fetchTrainingDetailRows(courseId),
    fetchTrainingCategories(),
    fetchTrainingTypeCodes(),
  ]);

  // 서버 1차 게이트 결과가 비면(미존재/전부 비공개/전부 과거) 404
  if (rows.length === 0) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  // FE 2차 재판정(공개/과거제외) + variant 오배치 방어는 빌더 내부에서 처리(통과 0건이면 null)
  const detail = toTrainingCourseDetail(
    rows,
    courseId,
    categoryMap,
    trainingTypeMap,
    TRAINING_COURSE_CODE[variant],
  );
  if (!detail) {
    notFound();
  }

  // 세션 상세 링크 접두어를 variant별로 파생 (/services/{variant}-training)
  const hrefPrefix = `/services/${variant}-training`;

  return (
    // 1:N 모델: currMgmt-data(커리큘럼) 1 → currDtlMgmt-data(교육회차) N행.
    // data-slug(currDtlMgmt-data, 다건)는 스케줄 리스트 <ul>(TrainingDetailSchedule)로 이동해
    //   각 회차 행 = 스케줄 카드 1건으로 반복(data-slug-repeat/item).
    // Hero 는 반복 밖 단건 표시라 부모 curriculum(_fetchedRel8.curriculum.*) slugKey만 유지
    //   (대표 1건 값 — data-slug 컨텍스트 자체는 반복 밖이라 없음. STEP6에서 목록 결과[0]의
    //    _fetchedRel8 로 히어로를 채움).
    <main
      className={`support-page support-page--${variant}-training-detail`}
      id="P-FO-SERV-030100P"
    >
      <TrainingDetailHero detail={detail} />
      <TrainingDetailSchedule detail={detail} hrefPrefix={hrefPrefix} />
    </main>
  );
}
