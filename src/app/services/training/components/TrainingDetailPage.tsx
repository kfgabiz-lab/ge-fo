import { notFound } from "next/navigation";
import type { TrainingVariant } from "../data/trainingContent";
import { fetchTrainingCategories, toCategoryMap } from "../data/trainingData";
import {
  fetchTrainingCurriculum,
  fetchTrainingDetailRows,
  fetchTrainingProductNameMap,
  fetchTrainingTypeCodes,
  isCurriculumVisible,
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
  const [rows, curriculum, categoryCodes, trainingTypeCodes, productNameMap] =
    await Promise.all([
      // 옵션A: courseId(부모 currMgmt-data.id) 역방향 + 공개(is_visible=001) + 과거회차 제외 where.
      // 1:N 모델: 다건 교육회차 전체를 unpaged 로 받아(정렬=교육 시작일 asc) 각 행을 카드로 렌더.
      // generateMetadata 와 동일 인자로 fetchTrainingDetailRows 공용 호출 → fetch memoization 으로 실제 요청 1회.
      fetchTrainingDetailRows(courseId),
      // 히어로/공개게이트 원천 = 부모 커리큘럼 라이브 조회(자식 행 스냅샷 사용 금지).
      fetchTrainingCurriculum(courseId),
      fetchTrainingCategories(),
      fetchTrainingTypeCodes(),
      // 연결제품(PRODUCTS COVERED) 해석용 "연결행 PK → 제품명" 맵
      fetchTrainingProductNameMap(),
    ]);

  // 404 기준은 "커리큘럼 자체"만 — 미존재 또는 비공개(is_visible≠001).
  // 예정 회차가 0건인 경우는 404 가 아니다(히어로는 노출하고 스케줄 목록만 비어 보이게 처리).
  if (!curriculum || !isCurriculumVisible(curriculum)) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  // FE 2차 재판정(과거회차 제외)은 빌더 내부에서 처리. 통과 0건이면 스케줄 목록만 빈 배열.
  // variant 무관 동일 커리큘럼 노출 정책 → training_course 게이트 없음.
  const detail = toTrainingCourseDetail(
    rows,
    courseId,
    curriculum,
    categoryMap,
    trainingTypeMap,
    productNameMap,
  );

  // 세션 상세 링크 접두어를 variant별로 파생 (/services/{variant}-training)
  const hrefPrefix = `/services/${variant}-training`;

  return (
    // 1:N 모델: currMgmt-data(커리큘럼) 1 → currDtlMgmt-data(교육회차) N행.
    // data-slug(currDtlMgmt-data, 다건)는 스케줄 리스트 <ul>(TrainingDetailSchedule)로 이동해
    //   각 회차 행 = 스케줄 카드 1건으로 반복(data-slug-repeat/item).
    // Hero 는 반복 밖 단건 표시라 부모 curriculum 필드 경로 표기(slugKey)만 유지한다.
    //   값은 currMgmt-data 를 PK 로 라이브 재조회한 결과(fetchTrainingCurriculum)로 채운다
    //   — 회차 행이 0건이어도 히어로가 정상 노출되어야 하고, BO 수정이 즉시 반영되어야 하기 때문.
    <main
      className={`support-page support-page--${variant}-training-detail`}
      id="P-FO-SERV-030100P"
    >
      {/* 헤더 브레드크럼 마지막 항목(current)은 services 레이아웃이 SSR 시점에 실 코스 제목으로 렌더한다
          (middleware x-pathname → 레이아웃 서버 조회 → HeaderBreadcrumb serverOverride). 페이지 측 주입 없음. */}
      <TrainingDetailHero detail={detail} />
      <TrainingDetailSchedule detail={detail} hrefPrefix={hrefPrefix} />
    </main>
  );
}
