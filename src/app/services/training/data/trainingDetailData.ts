// Training 상세(코스 1뎁스 + 세션 2뎁스, slug: currDtlMgmt-data) 값가공/매핑 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/services/currDtlMgmt-data.md
// - 규칙 근거: fo/docs/FO-RULE.md 원칙9 (네트워크 조회는 공통 fetchData/fetchApi 재사용,
//   화면전용 fetch 래퍼 신설 금지. 이 파일은 "값가공/마크업 헬퍼"만 담당한다.)
// - 조회 자체는 서버 컴포넌트(TrainingDetailPage/TrainingSessionPage)에서 공통 fetchData(목록 브랜치)로 수행.
//
// 옵션A 역방향 필터조회:
//   fetchData({ slug, where:{eq_curriculum_detail1.curriculum_id, eq_curriculum_detail3.is_visible=001},
//               sort:"updatedAt,desc", 리턴함수:(rows)=>rows }) → content[0] 단건 채택
// 이중 공개 게이트: 서버 where(is_visible=001) + FE 재판정(_fetchedRel8.curriculum.is_visible==="001")
import { fetchApi } from "@/lib/api";
import { formatDisplayDate } from "@/lib/formatDate";
import type { PageDataItem } from "@/lib/pageData";
import {
  engineeringTrainingDetails,
  type EngineeringTrainingDetail,
  type EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";
import {
  engineeringTrainingSessionDetails,
  type EngineeringTrainingSessionDetail,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import { type CodeItem, trainingImageSrc } from "./trainingData";

// 상세 slug (bo slug_registry id=155, type=PAGE_DATA)
export const TRAINING_DETAIL_SLUG = "currDtlMgmt-data";

// 옵션A where 빌더 — courseId(부모 currMgmt-data.id)로 역방향 필터, 공개(is_visible=001)만
export function trainingDetailWhere(courseId: string): Record<string, string> {
  return {
    "eq_curriculum_detail1.curriculum_id": courseId,
    "eq_curriculum_detail3.is_visible": "001",
  };
}

// TRAININGTYPE 코드그룹 조회(코드→라벨) — 리스트가 쓰는 codes API 패턴 그대로
export async function fetchTrainingTypeCodes(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/TRAININGTYPE");
}

// ---------------- 응답 dataJson 원본 구조 타입(직접 접근) ----------------

// curriculum_detail1: 커리큘럼 연결/유형
interface CurriculumDetail1 {
  curriculum_id?: number | string;
  training_type?: string; // TRAININGTYPE 코드
  training_course?: string; // 01/02/03
}

// curriculum_detail2: 운영 정보(기간/정원/장소/연락처/접수마감)
interface CurriculumDetail2 {
  title?: string;
  duration?: string | number;
  capacity?: string | number;
  address?: string;
  addressDetail?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  register_period_to?: string; // 접수마감 산출용
  training_date_from?: string;
  training_date_to?: string;
}

// curriculum_detail3: 공개/수강료
interface CurriculumDetail3 {
  is_visible?: string;
  training_fee_type?: string;
  training_fee?: string | number;
}

// training_schedule 정본 아이템(dateRange time은 저장 시 time_from/time_to로 분리)
interface TrainingScheduleItemRaw {
  id?: string;
  date?: string;
  time_from?: string;
  time_to?: string;
  title?: string;
  description?: string;
  trainer?: string;
}

// 부모 curriculum(_fetchedRel8, slug_relation id=8, join_type=FETCH)
interface ParentCurriculum {
  id?: number;
  title?: string;
  description?: string;
  image?: number[]; // 파일id 배열
  product_category?: string; // PRODUCTCATEGORY 코드 P/A
  is_visible?: string;
  training_course?: string; // 01/02/03
}

// 연결제품 관계 원소(_fetchedRel22=Power / _fetchedRel23=Automation)
interface RelProductItem {
  product?: { product_name?: string } | null;
}

// currDtlMgmt-data 1건의 dataJson 구조
interface CurrDtlDataJson {
  curriculum_detail1?: CurriculumDetail1;
  curriculum_detail2?: CurriculumDetail2;
  curriculum_detail3?: CurriculumDetail3;
  training_schedule?: TrainingScheduleItemRaw[];
  _fetchedRel8?: { curriculum?: ParentCurriculum } | null;
  _fetchedRel22?: RelProductItem[] | null; // Power 연결제품
  _fetchedRel23?: RelProductItem[] | null; // Automation 연결제품
}

// ---------------- 정적 유지(대응 필드 없는 요소) 베이스 ----------------
// - Agenda/Who should attend/Meals/카운트다운/공유/등록폼/캘린더/필터 셀렉트는 실데이터 바인딩 대상이 아님.
//   (설계 문서 6절-7 "정적 유지"). 기존 정적 콘텐츠를 템플릿으로 재사용해 해당 필드만 채운다.
const STATIC_COURSE_BASE = engineeringTrainingDetails["breaker-training"];
const STATIC_SESSION_BASE =
  engineeringTrainingSessionDetails["breaker-training/jan-10-2026"];

// ---------------- 순수 가공 헬퍼 ----------------

// 연결제품 제품명 목록: Power(_fetchedRel22) + Automation(_fetchedRel23) 합산.
// 빈 배열/null/키 부재 모두 방어(빈 목록 반환). 각 원소 경로 = _fetchedRelN[].product.product_name
function extractProductNames(json: CurrDtlDataJson): string[] {
  const rels: RelProductItem[] = [
    ...(json._fetchedRel22 ?? []),
    ...(json._fetchedRel23 ?? []),
  ];
  return rels
    .map((r) => r?.product?.product_name ?? "")
    .filter((name) => name.length > 0);
}

// 접수마감 라벨(FE 산출): register_period_to vs today.
// - 값 없으면 라벨 미표시("" 반환). 마감 경과 시 "Closed", 당일 "Closes today", 그 외 "Closes in N day(s)".
function computeClosesLabel(registerPeriodTo?: string): string {
  if (!registerPeriodTo) return "";
  const datePart = String(registerPeriodTo).trim().slice(0, 10);
  const parts = datePart.split("-");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts.map(Number);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
    return "";
  }
  const now = new Date();
  // 타임존 영향 제거를 위해 날짜(연/월/일)만으로 UTC 기준 일수 차 계산
  const endUtc = Date.UTC(y, m - 1, d);
  const todayUtc = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const days = Math.ceil((endUtc - todayUtc) / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `Closes in ${days} ${days === 1 ? "day" : "days"}`;
}

// duration/capacity 등 숫자/문자 혼재 필드 → 표시 문자열
function toDisplayString(value: unknown): string {
  return value != null ? String(value) : "";
}

// 코드 → 라벨(맵 미스 시 코드값 유지: 빈 값보다 정보 손실 적음)
function codeLabel(map: Map<string, string>, code: string | undefined): string {
  const key = code ?? "";
  return map.get(key) ?? key;
}

// ---------------- 코스 1뎁스 뷰모델 빌더 ----------------

// 코스 상세(EngineeringTrainingDetail) 뷰모델 생성.
// - 이중 공개 게이트 재판정(_fetchedRel8.curriculum.is_visible!=="001" → null)
// - expectedCourseCode(선택): variant 코드와 부모 training_course 불일치 시 null(오배치 방어)
// - 실데이터 필드는 API로, 필터 셀렉트/브레드크럼 등 정적 유지 필드는 STATIC_COURSE_BASE에서 채움
export function toTrainingCourseDetail(
  item: PageDataItem,
  courseId: string,
  categoryMap: Map<string, string>,
  trainingTypeMap: Map<string, string>,
  expectedCourseCode?: string,
): EngineeringTrainingDetail | null {
  const json = (item.dataJson ?? {}) as CurrDtlDataJson;
  const curriculum = json._fetchedRel8?.curriculum;
  // 이중 공개 게이트: 부모 커리큘럼이 비공개로 전환된 경우 방어
  if (!curriculum || curriculum.is_visible !== "001") return null;
  // variant 오배치 방어(선택 게이트)
  if (expectedCourseCode && curriculum.training_course !== expectedCourseCode) {
    return null;
  }

  const d1 = json.curriculum_detail1 ?? {};
  const d2 = json.curriculum_detail2 ?? {};

  const categoryLabel = codeLabel(categoryMap, curriculum.product_category);
  const trainingTypeLabel = codeLabel(trainingTypeMap, d1.training_type);
  const productsCovered = extractProductNames(json).join(", ");
  const duration = toDisplayString(d2.duration);
  const location = d2.address ?? "";
  const closesLabel = computeClosesLabel(d2.register_period_to);

  // 히어로 이미지: 부모 curriculum.image[0] → page-files, 미등록 시 정적 폴백
  const imageArr = curriculum.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0
      ? Number(imageArr[0])
      : null;
  const heroImage =
    mediaId != null ? trainingImageSrc(mediaId) : STATIC_COURSE_BASE.heroImage;

  // training_schedule 다건 → 세션 카드 배열(코스레벨 값은 모든 카드에 동일 주입)
  const scheduleRaw = Array.isArray(json.training_schedule)
    ? json.training_schedule
    : [];
  const sessions: EngineeringTrainingSession[] = scheduleRaw
    .filter((s): s is TrainingScheduleItemRaw => Boolean(s && s.id))
    .map((s) => ({
      id: String(s.id),
      date: formatDisplayDate(s.date ?? ""),
      // 세션 카드 제목: training_schedule 아이템 title(정본). 비면 코스 제목으로 폴백
      title: s.title || (curriculum.title ?? ""),
      closesLabel,
      trainingType: trainingTypeLabel,
      duration,
      // address 있으면 in-person 스타일/맵 아이콘 노출
      location: location || undefined,
      productsCovered,
    }));

  return {
    courseId,
    breadcrumbCurrent: STATIC_COURSE_BASE.breadcrumbCurrent, // 정적 유지
    category: categoryLabel,
    title: curriculum.title ?? "",
    descriptionLines: [curriculum.description ?? ""],
    heroImage,
    schedule: {
      // 필터 셀렉트(Training Type/Month)는 정적 유지(설계 6절-7)
      trainingTypeFilter: STATIC_COURSE_BASE.schedule.trainingTypeFilter,
      monthFilter: STATIC_COURSE_BASE.schedule.monthFilter,
      sessions,
    },
  };
}

// ---------------- 세션 2뎁스 뷰모델 빌더 ----------------

// 세션 상세(EngineeringTrainingSessionDetail) 뷰모델 생성.
// - 별도 세션 API 없음: 코스 단건의 training_schedule 배열에서 id===sessionId 매칭 1건 선택(없으면 null)
// - 이중 공개 게이트 + variant 오배치 방어(코스와 동일)
// - Agenda/Who should attend/Meals/등록폼 옵션/캘린더 등은 STATIC_SESSION_BASE에서 정적 유지
export function toTrainingSessionDetail(
  item: PageDataItem,
  courseId: string,
  sessionId: string,
  categoryMap: Map<string, string>,
  trainingTypeMap: Map<string, string>,
  expectedCourseCode?: string,
): EngineeringTrainingSessionDetail | null {
  const json = (item.dataJson ?? {}) as CurrDtlDataJson;
  const curriculum = json._fetchedRel8?.curriculum;
  if (!curriculum || curriculum.is_visible !== "001") return null;
  if (expectedCourseCode && curriculum.training_course !== expectedCourseCode) {
    return null;
  }

  const scheduleRaw = Array.isArray(json.training_schedule)
    ? json.training_schedule
    : [];
  const matched = scheduleRaw.find((s) => s && String(s.id) === sessionId);
  if (!matched) return null;

  const d1 = json.curriculum_detail1 ?? {};
  const d2 = json.curriculum_detail2 ?? {};

  const categoryLabel = codeLabel(categoryMap, curriculum.product_category);
  const trainingTypeLabel = codeLabel(trainingTypeMap, d1.training_type);
  const productsCovered = extractProductNames(json).join(", ");
  const dateDisplay = formatDisplayDate(matched.date ?? "");
  // 주소 + 상세주소 조합(장소명 대응 필드는 없음 → name은 빈값)
  const addressFull = [d2.address, d2.addressDetail]
    .filter((v): v is string => Boolean(v))
    .join(", ");

  return {
    ...STATIC_SESSION_BASE, // whoShouldAttend/meals/agenda/positionOptions/calendar 정적 유지
    courseId,
    sessionId,
    category: categoryLabel,
    title: matched.title ?? "",
    breadcrumbCurrent: dateDisplay,
    sidebar: {
      ...STATIC_SESSION_BASE.sidebar, // registerLabel 등 정적
      date: dateDisplay,
      eventDateToAttend: dateDisplay,
      duration: toDisplayString(d2.duration),
      classSize: toDisplayString(d2.capacity),
      location: {
        // 장소명(location.name) 대응 필드 없음(설계 6절-3) → 빈값, address만 표시
        name: "",
        address: addressFull,
        phone: d2.phone ?? "",
        email: d2.email ?? "",
      },
      productsCovered,
      trainingType: trainingTypeLabel,
    },
  };
}
