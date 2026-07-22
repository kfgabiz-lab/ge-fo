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
  toTrainingCourseDetail,
  trainingDetailWhere,
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
  const [result, categoryCodes, trainingTypeCodes] = await Promise.all([
    // 옵션A: courseId(부모 currMgmt-data.id) 역방향 + 공개(is_visible=001) where, 최신순 결과[0]
    fetchData<PageDataItem>({
      slug: TRAINING_DETAIL_SLUG,
      where: trainingDetailWhere(courseId),
      sort: "updatedAt,desc",
      리턴함수: (rows) => rows,
    }),
    fetchTrainingCategories(),
    fetchTrainingTypeCodes(),
  ]);

  // 서버 1차 게이트 결과가 비면(미존재/비공개) 404
  const row = result.content[0];
  if (!row) {
    notFound();
  }

  const categoryMap = toCategoryMap(categoryCodes);
  const trainingTypeMap = toCategoryMap(trainingTypeCodes);

  // FE 재판정(이중 공개 게이트) + variant 오배치 방어는 빌더 내부에서 처리(불일치 시 null)
  const detail = toTrainingCourseDetail(
    row,
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
    // data-slug: 코스 상세는 currDtlMgmt-data 단건(옵션A 역방향 필터조회 결과[0]).
    // 하위 Hero/Schedule 의 data-slugkey 는 모두 이 단건 레코드에 속함.
    // (스케줄 섹션 내부의 training_schedule 서브리스트만 별도 data-slug-repeat 로 중첩)
    <main
      className={`support-page support-page--${variant}-training-detail`}
      id="P-FO-SERV-030100P"
      data-slug="currDtlMgmt-data"
    >
      <TrainingDetailHero detail={detail} />
      <TrainingDetailSchedule detail={detail} hrefPrefix={hrefPrefix} />
    </main>
  );
}
