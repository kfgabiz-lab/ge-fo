// Training 상세(코스 1뎁스 + 세션 2뎁스, slug: currDtlMgmt-data) 값가공/매핑 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/services/currDtlMgmt-data.md
// - 규칙 근거: fo/docs/FO-RULE.md 원칙9 (네트워크 조회는 공통 fetchData/fetchApi 재사용,
//   화면전용 fetch 래퍼 신설 금지. 이 파일은 "값가공/마크업 헬퍼"만 담당한다.)
//
// ★ 1:N 모델(재작성):
//   currMgmt-data(커리큘럼) 1 → currDtlMgmt-data(교육회차) N행.
//   각 행 = 코스상세(1뎁스) 스케줄 카드 1건. 그 행 내부 training_schedule[] = 세션 2뎁스 Agenda.
//   - 조회는 서버 컴포넌트(TrainingDetailPage/TrainingSessionPage)에서 공통 fetchData(목록 브랜치, unpaged)로
//     "다건 행 전체"를 받아 여기서 뷰모델로 매핑.
//   - 세션 2뎁스는 별도 API 없이, 같은 다건 결과에서 행 PK(id === sessionId) 1건을 FE에서 선택.
//
// 조회 where(옵션A 역방향 + 공개 게이트 + 과거회차 제외):
//   eq_curriculum_detail1.curriculum_id, eq_curriculum_detail3.is_visible=001,
//   condexpr_training_date_to(training_date_to>=today()?'valid':'past') + condval_training_date_to=valid
// 이중 방어: 서버 where(is_visible/과거제외) + FE 2차 재판정(_fetchedRel8.curriculum.is_visible & training_date_to>=today)
import type { Metadata } from "next";
import { fetchApi, SITE_URL } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { formatDisplayDate } from "@/lib/formatDate";
import type { PageDataItem } from "@/lib/pageData";
import {
  engineeringTrainingDetails,
  type EngineeringTrainingDetail,
  type EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";
import {
  engineeringTrainingSessionDetails,
  type EngineeringTrainingAgendaRow,
  type EngineeringTrainingSessionDetail,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import { type CodeItem, trainingImageSrc } from "./trainingData";

// 상세 slug (bo slug_registry id=155, type=PAGE_DATA)
export const TRAINING_DETAIL_SLUG = "currDtlMgmt-data";

// 코스/세션 공통 조회 정렬(교육 시작일 오름차순)
export const TRAINING_DETAIL_SORT = "curriculum_detail2.training_date_from,asc";

// 옵션A where 빌더 — courseId(부모 currMgmt-data.id)로 역방향 필터, 공개(is_visible=001) + 과거회차 제외.
// - condexpr/condval: 서버에서 training_date_to>=today() 인 행만 통과(과거회차 1차 제외). 값은 STEP4 확정 문자열 그대로 사용.
export function trainingDetailWhere(courseId: string): Record<string, string> {
  return {
    "eq_curriculum_detail1.curriculum_id": courseId,
    "eq_curriculum_detail3.is_visible": "001",
    "condexpr_training_date_to": "training_date_to>=today()?'valid':'past'",
    "condval_training_date_to": "valid",
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
  training_type?: string; // TRAININGTYPE 코드 CSV("001" / "002" / "001,002")
  training_course?: string; // 01/02/03
}

// curriculum_detail2: 운영 정보(교육기간/정원/장소/연락처/접수마감)
interface CurriculumDetail2 {
  title?: string;
  duration?: string | number;
  capacity?: string | number;
  address?: string;
  addressDetail?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  register_period_to?: string; // 접수마감/카운트다운 산출용
  training_date_from?: string; // 교육 시작일
  training_date_to?: string; // 교육 종료일
  content?: string; // 세션 본문(WYSIWYG HTML) — 세션 상세 "Who/Meals" 대체 단일 본문
}

// curriculum_detail3: 공개/수강료
interface CurriculumDetail3 {
  is_visible?: string;
  training_fee_type?: string;
  training_fee?: string | number;
}

// training_schedule 정본 아이템(= 세션 2뎁스 Agenda 1행)
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

// currDtlMgmt-data 1행의 dataJson 구조
interface CurrDtlDataJson {
  curriculum_detail1?: CurriculumDetail1;
  curriculum_detail2?: CurriculumDetail2;
  curriculum_detail3?: CurriculumDetail3;
  training_schedule?: TrainingScheduleItemRaw[];
  _fetchedRel8?: { curriculum?: ParentCurriculum } | null;
  _fetchedRel22?: RelProductItem[] | null; // Power 연결제품
  _fetchedRel23?: RelProductItem[] | null; // Automation 연결제품
}

// 파싱된 행(원본 + dataJson) — 뷰모델 빌더 내부 취급용
interface ParsedRow {
  raw: PageDataItem;
  json: CurrDtlDataJson;
}

// ---------------- 정적 유지(대응 필드 없는 요소) 베이스 ----------------
// - Who should attend/Meals/등록폼 옵션/캘린더 라벨 등은 실데이터 바인딩 대상이 아님(설계 6절-7 정적 유지).
//   기존 정적 콘텐츠를 템플릿으로 재사용해 실데이터 필드만 채운다.
const STATIC_COURSE_BASE = engineeringTrainingDetails["breaker-training"];
const STATIC_SESSION_BASE =
  engineeringTrainingSessionDetails["breaker-training/jan-10-2026"];

// 월 약어(교육일자 범위 표기용)
const MONTH_ABBR = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
  const ymd = parseYmd(registerPeriodTo);
  if (!ymd) return "";
  const now = new Date();
  // 타임존 영향 제거를 위해 날짜(연/월/일)만으로 UTC 기준 일수 차 계산
  const endUtc = Date.UTC(ymd.y, ymd.m - 1, ymd.d);
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.ceil((endUtc - todayUtc) / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `Closes in ${days} ${days === 1 ? "day" : "days"}`;
}

// "YYYY-MM-DD"[...] → {y,m,d}. 파싱 불가 시 null(범위 방어 포함)
function parseYmd(dateStr?: string): { y: number; m: number; d: number } | null {
  if (!dateStr) return null;
  const parts = String(dateStr).trim().slice(0, 10).split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (![y, m, d].every(Number.isInteger)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

// 교육일자 범위 표기(연도 1회):
// - 동일일/한쪽만: "Jul 30, 2026"
// - 동월(동년):    "Jul 30–31, 2026"
// - 월경계(동년):  "Jul 30 – Aug 1, 2026"
// - 연경계:        "Dec 30, 2025 – Jan 2, 2026"
function formatSessionDateRange(from?: string, to?: string): string {
  const f = parseYmd(from);
  const t = parseYmd(to);
  if (f && t) {
    if (f.y === t.y && f.m === t.m && f.d === t.d) {
      return `${MONTH_ABBR[f.m]} ${f.d}, ${f.y}`;
    }
    if (f.y === t.y && f.m === t.m) {
      return `${MONTH_ABBR[f.m]} ${f.d}–${t.d}, ${f.y}`;
    }
    if (f.y === t.y) {
      return `${MONTH_ABBR[f.m]} ${f.d} – ${MONTH_ABBR[t.m]} ${t.d}, ${f.y}`;
    }
    return `${MONTH_ABBR[f.m]} ${f.d}, ${f.y} – ${MONTH_ABBR[t.m]} ${t.d}, ${t.y}`;
  }
  const only = f ?? t;
  if (!only) return "";
  return `${MONTH_ABBR[only.m]} ${only.d}, ${only.y}`;
}

// 과거회차 2차 재판정(FE 방어): training_date_to >= today 면 통과.
// - 서버 condexpr 로 1차 제외되나, 값 부재/서버 조건 미적용 대비 방어. 종료일 없으면 통과(과거로 단정 안 함).
function isNotPast(dateTo?: string): boolean {
  const ymd = parseYmd(dateTo);
  if (!ymd) return true;
  const now = new Date();
  const endUtc = Date.UTC(ymd.y, ymd.m - 1, ymd.d);
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return endUtc >= todayUtc;
}

// Agenda 정렬: date("YYYY-MM-DD") 우선 오름차순, 동일 date면 time_from("HH:MM") 오름차순.
// - 값 없는 항목 방어: 빈 문자열은 어떤 값보다 앞(빈 date/time 이 선두). 원본 불변(복사 후 정렬).
function sortSchedule(
  items: TrainingScheduleItemRaw[],
): TrainingScheduleItemRaw[] {
  return [...items].sort((a, b) => {
    const da = (a.date ?? "").slice(0, 10);
    const db = (b.date ?? "").slice(0, 10);
    if (da !== db) return da < db ? -1 : 1;
    const ta = a.time_from ?? "";
    const tb = b.time_from ?? "";
    if (ta !== tb) return ta < tb ? -1 : 1;
    return 0;
  });
}

// training_type CSV → 코드 배열("001,002" → ["001","002"])
function splitTypeCodes(csv?: string): string[] {
  return String(csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// training_type CSV → 라벨 조합("001,002" → "In-Person, Virtual"). 맵 미스 시 코드값 유지.
function trainingTypeLabels(
  csv: string | undefined,
  map: Map<string, string>,
): string {
  return splitTypeCodes(csv)
    .map((code) => map.get(code) ?? code)
    .join(", ");
}

// 주소 노출 여부: training_type 이 Virtual(002)만이면 숨김. In-Person(001) 포함 시 노출.
// - 코드가 비어있으면 기본 노출(정보 손실 방지).
function shouldShowAddress(csv?: string): boolean {
  const codes = splitTypeCodes(csv);
  if (codes.length === 0) return true;
  return codes.includes("001");
}

// duration/capacity 등 숫자/문자 혼재 필드 → 표시 문자열
function toDisplayString(value: unknown): string {
  return value != null ? String(value) : "";
}

// duration(시간 수) → "N Hours". 값 없으면 빈 문자열("Hours"만 찍히지 않게)
function formatDurationHours(value: unknown): string {
  const s = value != null ? String(value).trim() : "";
  if (!s) return "";
  return `${s} Hours`;
}

// 코드 → 라벨(맵 미스 시 코드값 유지: 빈 값보다 정보 손실 적음)
function codeLabel(map: Map<string, string>, code: string | undefined): string {
  const key = code ?? "";
  return map.get(key) ?? key;
}

// 행 1건 → 공개/variant/과거제외 게이트 통과 여부(FE 2차 재판정)
function passesGate(json: CurrDtlDataJson, expectedCourseCode?: string): boolean {
  const curriculum = json._fetchedRel8?.curriculum;
  if (!curriculum || curriculum.is_visible !== "001") return false;
  if (expectedCourseCode && curriculum.training_course !== expectedCourseCode) {
    return false;
  }
  if (!isNotPast(json.curriculum_detail2?.training_date_to)) return false;
  return true;
}

// ---------------- 코스 1뎁스 뷰모델 빌더 ----------------

// 코스 상세(EngineeringTrainingDetail) 뷰모델 생성 — 다건 행 → 카드 배열.
// - rows: currDtlMgmt-data 다건(교육회차 N행). 각 행 = 스케줄 카드 1건.
// - Hero: 게이트 통과 첫 행의 부모 curriculum(_fetchedRel8.curriculum.*).
// - 게이트 통과 행이 0건이면 null(호출부 notFound).
export function toTrainingCourseDetail(
  rows: PageDataItem[],
  courseId: string,
  categoryMap: Map<string, string>,
  trainingTypeMap: Map<string, string>,
  expectedCourseCode?: string,
): EngineeringTrainingDetail | null {
  const valid: ParsedRow[] = rows
    .map((raw) => ({ raw, json: (raw.dataJson ?? {}) as CurrDtlDataJson }))
    .filter(({ json }) => passesGate(json, expectedCourseCode));
  if (valid.length === 0) return null;

  const curriculum = valid[0].json._fetchedRel8?.curriculum;
  if (!curriculum) return null;

  const categoryLabel = codeLabel(categoryMap, curriculum.product_category);

  // 히어로 이미지: 부모 curriculum.image[0] → page-files, 미등록 시 정적 폴백
  const imageArr = curriculum.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? Number(imageArr[0]) : null;
  const heroImage =
    mediaId != null ? trainingImageSrc(mediaId) : STATIC_COURSE_BASE.heroImage;

  // 다건 행 → 스케줄 카드 배열(각 행이 곧 회차 카드 1건)
  const sessions: EngineeringTrainingSession[] = valid.map(({ raw, json }) =>
    toCourseCard(raw, json, trainingTypeMap),
  );

  return {
    courseId,
    breadcrumbCurrent: STATIC_COURSE_BASE.breadcrumbCurrent, // 정적 유지
    category: categoryLabel,
    title: curriculum.title ?? "",
    descriptionLines: [curriculum.description ?? ""],
    heroImage,
    schedule: {
      // 필터 라벨은 정적 유지(Training Type/Month). 옵션/동작은 client(TrainingDetailSchedule)에서 처리.
      trainingTypeFilter: STATIC_COURSE_BASE.schedule.trainingTypeFilter,
      monthFilter: STATIC_COURSE_BASE.schedule.monthFilter,
      sessions,
    },
  };
}

// 행 1건 → 스케줄 카드 뷰모델
function toCourseCard(
  raw: PageDataItem,
  json: CurrDtlDataJson,
  trainingTypeMap: Map<string, string>,
): EngineeringTrainingSession {
  const d1 = json.curriculum_detail1 ?? {};
  const d2 = json.curriculum_detail2 ?? {};
  const typeCodes = splitTypeCodes(d1.training_type);
  const showAddress = shouldShowAddress(d1.training_type);

  return {
    id: String(raw.id), // 행 PK(세션 상세 href 및 2뎁스 픽에 사용)
    // 교육일자: training_date_from ~ training_date_to 범위 표기(연도 1회)
    date: formatSessionDateRange(d2.training_date_from, d2.training_date_to),
    // 월 필터 파생용 원본 시작일(앞 10자리)
    isoDate: (d2.training_date_from ?? "").slice(0, 10),
    // 카드 제목: 이 행의 curriculum_detail2.title
    title: d2.title ?? "",
    // 접수마감: 이 행의 register_period_to 기준 산출
    closesLabel: computeClosesLabel(d2.register_period_to),
    // 교육타입: CSV split + 라벨 조합
    trainingType: trainingTypeLabels(d1.training_type, trainingTypeMap),
    // 교육시간: "N Hours"
    duration: formatDurationHours(d2.duration),
    // 주소: Virtual(002) 단독이면 숨김(값 자체를 undefined 로 → 카드 위치 미노출)
    location: showAddress ? d2.address || undefined : undefined,
    // 대상제품: 연결제품 제품명 합산
    productsCovered: extractProductNames(json).join(", "),
    // Training Type 필터 파생용 코드 목록
    typeCodes,
  };
}

// ---------------- 세션 2뎁스 뷰모델 빌더 ----------------

// 세션 상세(EngineeringTrainingSessionDetail) 뷰모델 생성 — 다건 행에서 행 PK 매칭.
// - rows 에서 Number(id)===Number(sessionId) 1행 선택(sessionId = currDtlMgmt-data 행 PK). 없으면 null.
// - 공개/variant/과거제외 게이트(코스와 동일).
// - Agenda = 그 행의 training_schedule[] 동적 매핑. Who should attend/Meals 등은 STATIC_SESSION_BASE 유지.
export function toTrainingSessionDetail(
  rows: PageDataItem[],
  courseId: string,
  sessionId: string,
  categoryMap: Map<string, string>,
  trainingTypeMap: Map<string, string>,
  expectedCourseCode?: string,
): EngineeringTrainingSessionDetail | null {
  const matched = rows
    .map((raw) => ({ raw, json: (raw.dataJson ?? {}) as CurrDtlDataJson }))
    .find(({ raw }) => Number(raw.id) === Number(sessionId));
  if (!matched) return null;

  const { json } = matched;
  if (!passesGate(json, expectedCourseCode)) return null;
  const curriculum = json._fetchedRel8?.curriculum;
  if (!curriculum) return null;

  const d1 = json.curriculum_detail1 ?? {};
  const d2 = json.curriculum_detail2 ?? {};

  const categoryLabel = codeLabel(categoryMap, curriculum.product_category);
  const trainingTypeLabel = trainingTypeLabels(d1.training_type, trainingTypeMap);
  const productsCovered = extractProductNames(json).join(", ");
  const dateDisplay = formatDisplayDate(d2.training_date_from ?? "");
  // 주소 노출 게이트(코스 카드 toCourseCard 와 동일 공통 헬퍼): Virtual(002) 단독이면 숨김.
  const showAddress = shouldShowAddress(d1.training_type);
  // 주소 + 상세주소 조합(장소명 대응 필드는 없음 → name 은 빈값).
  // Virtual 단독이면 빈값 → 사이드바 주소 li·지도·캘린더 location 모두 미노출.
  const addressFull = showAddress
    ? [d2.address, d2.addressDetail]
        .filter((v): v is string => Boolean(v))
        .join(", ")
    : "";

  // Agenda: 이 행의 training_schedule[] → date+time_from 오름차순 정렬 후 No 재채번(1부터).
  const scheduleRaw = Array.isArray(json.training_schedule)
    ? json.training_schedule
    : [];
  const scheduleSorted = sortSchedule(scheduleRaw);
  const agenda: EngineeringTrainingAgendaRow[] = scheduleSorted.map(
    (s, idx) => ({
      id: s.id ? String(s.id) : `agenda-${idx + 1}`,
      number: String(idx + 1),
      time: [s.time_from, s.time_to].filter(Boolean).join(" ~ "),
      title: s.title ?? "",
      description: s.description || undefined,
      trainer: s.trainer || undefined,
    }),
  );
  // Trainer 컬럼 노출 여부: 정렬된 배열 중 하나라도 trainer 값이 있으면 노출(모두 빈값이면 비노출).
  const showTrainerColumn = scheduleSorted.some(
    (s) => (s.trainer ?? "").trim().length > 0,
  );

  // Add to Calendar(A-2) 이벤트: 회차 시작일 + Agenda(정렬 후) 첫/끝 시각으로 세션 span 구성
  const firstSch = scheduleSorted[0];
  const lastSch = scheduleSorted[scheduleSorted.length - 1];

  return {
    ...STATIC_SESSION_BASE, // positionOptions/calendar/sidebar 템플릿 정적 유지
    courseId,
    sessionId,
    category: categoryLabel,
    title: d2.title ?? "",
    breadcrumbCurrent: dateDisplay,
    // 세션 본문(WYSIWYG HTML). 빈값이면 컴포넌트에서 본문 섹션/탭 비노출.
    content: d2.content ?? "",
    // 동적 Agenda 로 정적 agenda 덮어쓰기
    agenda,
    // Agenda Trainer 컬럼 노출 여부(뷰모델 계산 결과)
    showTrainerColumn,
    event: {
      title: d2.title ?? "",
      startIso: (d2.training_date_from ?? "").slice(0, 10),
      timeFrom: firstSch?.time_from || undefined,
      timeTo: lastSch?.time_to || firstSch?.time_from || undefined,
      location: addressFull || undefined,
      description: firstSch?.description || undefined,
    },
    // 카운트다운(A-3) 기준: 이 행의 register_period_to
    countdownTo: d2.register_period_to || undefined,
    sidebar: {
      ...STATIC_SESSION_BASE.sidebar, // registerLabel 등 정적
      date: dateDisplay,
      eventDateToAttend: dateDisplay,
      duration: formatDurationHours(d2.duration),
      classSize: toDisplayString(d2.capacity),
      location: {
        // 장소명(location.name) 대응 필드 없음(설계 6절-3) → 빈값, address 만 표시
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

// ---------------- OG 메타데이터 헬퍼(라우트 generateMetadata 공용) ----------------

// 상세 조회 행 취득(코스/세션 공통, 라우트 generateMetadata + page 컴포넌트 공용).
// - page 컴포넌트와 "동일 인자"로 fetchData 를 호출해 Next fetch memoization 으로 실제 요청 1회만 발생시킨다.
export async function fetchTrainingDetailRows(
  courseId: string,
): Promise<PageDataItem[]> {
  const result = await fetchData<PageDataItem>({
    slug: TRAINING_DETAIL_SLUG,
    where: trainingDetailWhere(courseId),
    sort: TRAINING_DETAIL_SORT,
    unpaged: true,
    리턴함수: (rows) => rows,
  });
  return result.content;
}

// 게이트 통과 첫 행의 부모 curriculum 선택(메타 대표값 산출용). 없으면 null.
function pickGateCurriculum(
  rows: PageDataItem[],
  expectedCourseCode?: string,
): ParentCurriculum | null {
  const valid = rows
    .map((raw) => ({ json: (raw.dataJson ?? {}) as CurrDtlDataJson }))
    .filter(({ json }) => passesGate(json, expectedCourseCode));
  return valid[0]?.json._fetchedRel8?.curriculum ?? null;
}

// curriculum.image[0] → page-files 절대경로(OG image). 미등록/파싱불가 시 undefined.
// - 절대화 방식: SITE_URL 접두(옵션 b). 근거: fetchApi 서버측 절대화와 동일 SITE_URL 관례 재사용,
//   layout 의 기존 openGraph(완전 절대 URL, metadataBase 미의존)에 부작용 없음.
function ogImageFromCurriculum(
  curriculum: ParentCurriculum | null,
): string | undefined {
  const imageArr = curriculum?.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? Number(imageArr[0]) : null;
  if (mediaId == null || Number.isNaN(mediaId)) return undefined;
  return `${SITE_URL}${trainingImageSrc(mediaId)}`;
}

// title/description/image → openGraph 포함 Metadata 구성(공용).
function buildOgMetadata(
  title: string,
  description: string,
  image?: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

// 코스 상세 OG 메타: title=부모 curriculum.title, description=부모 curriculum.description,
// image=curriculum.image[0]. 데이터 없으면 안전 폴백(빈 Metadata → layout 기본값 유지).
export function buildCourseMetadata(
  rows: PageDataItem[],
  expectedCourseCode?: string,
): Metadata {
  const curriculum = pickGateCurriculum(rows, expectedCourseCode);
  if (!curriculum) return {};
  return buildOgMetadata(
    curriculum.title ?? "",
    curriculum.description ?? "",
    ogImageFromCurriculum(curriculum),
  );
}

// 세션 상세 OG 메타: title=curriculum_detail2.title, description=부모 curriculum.description
// (세션 별도 설명 필드 없음 → 부모 curriculum.description 사용), image=커리큘럼 image 동일.
// 미매칭/게이트 탈락 시 안전 폴백(빈 Metadata).
export function buildSessionMetadata(
  rows: PageDataItem[],
  sessionId: string,
  expectedCourseCode?: string,
): Metadata {
  const matched = rows
    .map((raw) => ({ raw, json: (raw.dataJson ?? {}) as CurrDtlDataJson }))
    .find(({ raw }) => Number(raw.id) === Number(sessionId));
  if (!matched || !passesGate(matched.json, expectedCourseCode)) return {};
  const curriculum = matched.json._fetchedRel8?.curriculum ?? null;
  const d2 = matched.json.curriculum_detail2 ?? {};
  return buildOgMetadata(
    d2.title ?? "",
    curriculum?.description ?? "",
    ogImageFromCurriculum(curriculum),
  );
}
