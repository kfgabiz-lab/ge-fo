import type { Metadata, ResolvedMetadata, ResolvingMetadata } from "next";
import { fetchApi, SITE_URL } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
import { formatDisplayDate } from "@/lib/formatDate";
import { formatPhoneDisplay } from "@/lib/formatPhone";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { stripHtmlText } from "@/lib/stripHtmlText";
import type { PageDataItem } from "@/lib/pageData";
import { fetchProductNamesByIds } from "@/lib/training/trainingProductTree";
import {
  engineeringTrainingDetails,
  type EngineeringTrainingDetail,
  type EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";
import {
  engineeringTrainingSessionCalendarLabels,
  engineeringTrainingSessionFormCopy,
  type EngineeringTrainingAgendaRow,
  type EngineeringTrainingSessionDetail,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import { contentDetailPath } from "@/lib/contentDetailPath";
import {
  type CodeItem,
  TRAINING_COURSE_DETAIL_HREF_PREFIX,
  TRAINING_SESSION_DETAIL_HREF_PREFIX,
  TRAINING_SLUG,
  TRAINING_VARIANT_BY_COURSE_CODE,
  trainingImageSrc,
} from "./trainingData";

export const TRAINING_DETAIL_SLUG = "currDtlMgmt-data";

export const TRAINING_DETAIL_SORT = "curriculum_detail2.training_date_from,asc";

/** 노출여부(is_visible)는 bo-api가 currDtlMgmt-data에 대해 서버측에서 항상 강제한다 — 클라이언트가 조건을 보낼 필요 없음 */
export function trainingDetailWhere(courseId: string): Record<string, string> {
  return {
    "eq_curriculum_detail1.curriculum_id": courseId,
  };
}

export async function fetchTrainingTypeCodes(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/TRAININGTYPE");
}

interface CurriculumDetail1 {
  curriculum_id?: number | string;
  training_type?: string; 
  training_course?: string; 
}

interface CurriculumDetail2 {
  title?: string;
  duration?: string | number;
  capacity?: string | number;
  address?: string;
  address_detail?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  register_period_from?: string;
  register_period_to?: string;
  training_date_from?: string; 
  training_date_to?: string; 
  content?: string; 
}

interface CurriculumDetail3 {
  is_visible?: string;
  training_fee_type?: string;
  training_fee?: string | number;
}

interface TrainingScheduleItemRaw {
  id?: string;
  date?: string;
  time_from?: string;
  time_to?: string;
  title?: string;
  description?: string;
  trainer?: string;
}

export interface ParentCurriculum {
  id?: number;
  slug?: string | null;
  title?: string;
  description?: string;
  image?: number[];
  product_category?: string;
  is_visible?: string;
  training_course?: string;
}

interface CurrDtlProductRef {
  id?: number | string;
  productId?: number | string;
  depth1?: number | string;
  depth2?: number | string;
  depth3?: number | string;
}

interface CurrDtlDataJson {
  seo?: { slug?: string };
  curriculum_detail1?: CurriculumDetail1;
  curriculum_detail2?: CurriculumDetail2;
  curriculum_detail3?: CurriculumDetail3;
  training_schedule?: TrainingScheduleItemRaw[];
  power_list?: CurrDtlProductRef[] | null;
  automation_list?: CurrDtlProductRef[] | null;
  _registrationDaysLeft?: number | null;
  _registrationClosed?: boolean;
  _registrationClosesToday?: boolean;
  _registrationNotYetOpen?: boolean | null;
}

interface ParsedRow {
  raw: PageDataItem;
  json: CurrDtlDataJson;
}

const STATIC_COURSE_BASE = engineeringTrainingDetails["breaker-training"];

const ICS_ORGANIZER_NAME = "LESA Technical Services";

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

function depth3Of(ref: CurrDtlProductRef | null | undefined): number | null {
  if (ref == null || typeof ref !== "object") return null;
  const id = Number(ref.depth3);
  return Number.isFinite(id) ? id : null;
}

function productRefsOf(json: CurrDtlDataJson): CurrDtlProductRef[] {
  return [...(json.power_list ?? []), ...(json.automation_list ?? [])];
}

function extractProductNames(
  json: CurrDtlDataJson,
  nameMap: Map<number, string>,
): string[] {
  const out: string[] = [];
  const seen = new Set<number>();
  for (const ref of productRefsOf(json)) {
    const id = depth3Of(ref);
    if (id == null || seen.has(id)) continue;
    seen.add(id);
    const name = nameMap.get(id);
    if (name) out.push(name);
  }
  return out;
}

function formatClosesLabel(
  daysLeft: number | null,
  closed: boolean,
  closesToday: boolean,
): string {
  if (daysLeft == null) return "";
  if (closed) return "Closed";
  if (closesToday) return "Closes today";
  return `Closes in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`;
}

function parseYmd(dateStr?: string): { y: number; m: number; d: number } | null {
  if (!dateStr) return null;
  const parts = String(dateStr).trim().slice(0, 10).split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (![y, m, d].every(Number.isInteger)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

function formatSessionDateRange(from?: string, to?: string): string {
  const f = parseYmd(from);
  const t = parseYmd(to);
  if (f && t) {
    if (f.y === t.y && f.m === t.m && f.d === t.d) {
      return `${MONTH_ABBR[f.m]} ${f.d}, ${f.y}`;
    }
    if (f.y === t.y && f.m === t.m) {
      return `${MONTH_ABBR[f.m]} ${f.d}-${t.d}, ${f.y}`;
    }
    if (f.y === t.y) {
      return `${MONTH_ABBR[f.m]} ${f.d} - ${MONTH_ABBR[t.m]} ${t.d}, ${f.y}`;
    }
    return `${MONTH_ABBR[f.m]} ${f.d}, ${f.y} - ${MONTH_ABBR[t.m]} ${t.d}, ${t.y}`;
  }
  const only = f ?? t;
  if (!only) return "";
  return `${MONTH_ABBR[only.m]} ${only.d}, ${only.y}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatCompactDateRange(
  from?: string,
  to?: string,
): { primary: string; secondary?: string } {
  const f = parseYmd(from);
  const t = parseYmd(to);
  const only = f ?? t;
  if (!f || !t || (f.y === t.y && f.m === t.m && f.d === t.d)) {
    if (!only) return { primary: "" };
    return { primary: `${MONTH_ABBR[only.m]} ${pad2(only.d)}, ${only.y}` };
  }
  if (f.y === t.y && f.m === t.m) {
    return { primary: `${MONTH_ABBR[f.m]} ${pad2(f.d)}-${pad2(t.d)}, ${f.y}` };
  }
  if (f.y === t.y) {
    return {
      primary: `${MONTH_ABBR[f.m]} ${pad2(f.d)}-${MONTH_ABBR[t.m]} ${pad2(t.d)}, ${f.y}`,
    };
  }
  return {
    primary: `${MONTH_ABBR[f.m]} ${pad2(f.d)}, ${f.y}`,
    secondary: `${MONTH_ABBR[t.m]} ${pad2(t.d)}, ${t.y}`,
  };
}

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

function splitTypeCodes(csv?: string): string[] {
  return String(csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function trainingTypeLabels(
  csv: string | undefined,
  map: Map<string, string>,
): string {
  return splitTypeCodes(csv)
    .map((code) => map.get(code) ?? code)
    .join(", ");
}

function shouldShowAddress(csv?: string): boolean {
  const codes = splitTypeCodes(csv);
  if (codes.length === 0) return true;
  return codes.includes("001");
}

function toDisplayString(value: unknown): string {
  return value != null ? String(value) : "";
}

function formatDurationHours(value: unknown): string {
  const s = value != null ? String(value).trim() : "";
  if (!s) return "";
  return `${s} Hours`;
}

function formatDurationCovered(value: unknown): string {
  const hours = formatDurationHours(value);
  if (!hours) return "";
  return `Duration: ${hours}`;
}

function formatTrainingTypeCovered(
  csv: string | undefined,
  map: Map<string, string>,
): string {
  const joined = splitTypeCodes(csv)
    .map((code) => map.get(code) ?? code)
    .join(" | ");
  if (!joined) return "";
  return `Training Type: ${joined}`;
}

function formatProductsCovered(names: string[]): string {
  const joined = names.join(", ");
  if (!joined) return "";
  return `PRODUCTS COVERED: ${joined}`;
}

function codeLabel(map: Map<string, string>, code: string | undefined): string {
  const key = code ?? "";
  return map.get(key) ?? key;
}

export function isCurriculumVisible(
  curriculum: ParentCurriculum | null,
): boolean {
  return curriculum?.is_visible === "001";
}

export function toTrainingCourseDetail(
  rows: PageDataItem[],
  courseId: string,
  curriculum: ParentCurriculum,
  categoryMap: Map<string, string>,
  trainingTypeMap: Map<string, string>,
  productNameMap: Map<number, string>,
): EngineeringTrainingDetail {
  const valid: ParsedRow[] = rows.map((raw) => ({
    raw,
    json: (raw.dataJson ?? {}) as CurrDtlDataJson,
  }));

  const categoryLabel = codeLabel(categoryMap, curriculum.product_category);

  const imageArr = curriculum.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? Number(imageArr[0]) : null;
  const heroImage = mediaId != null ? trainingImageSrc(mediaId) : "";

  const sessions: EngineeringTrainingSession[] = valid.map(({ raw, json }) =>
    toCourseCard(raw, json, trainingTypeMap, productNameMap),
  );

  return {
    courseId,
    breadcrumbCurrent: STATIC_COURSE_BASE.breadcrumbCurrent, 
    category: categoryLabel,
    title: curriculum.title ?? "",
    descriptionLines: [curriculum.description ?? ""],
    heroImage,
    schedule: {
      trainingTypeFilter: STATIC_COURSE_BASE.schedule.trainingTypeFilter,
      monthFilter: STATIC_COURSE_BASE.schedule.monthFilter,
      sessions,
    },
  };
}

function toCourseCard(
  raw: PageDataItem,
  json: CurrDtlDataJson,
  trainingTypeMap: Map<string, string>,
  productNameMap: Map<number, string>,
): EngineeringTrainingSession {
  const d1 = json.curriculum_detail1 ?? {};
  const d2 = json.curriculum_detail2 ?? {};
  const typeCodes = splitTypeCodes(d1.training_type);
  const showAddress = shouldShowAddress(d1.training_type);
  const productNames = extractProductNames(json, productNameMap);

  return {
    id: String(raw.id),
    slug: json.seo?.slug || null,
    date: formatSessionDateRange(d2.training_date_from, d2.training_date_to),
    isoDate: (d2.training_date_from ?? "").slice(0, 10),
    isoDateTo: (d2.training_date_to ?? "").slice(0, 10),
    title: d2.title ?? "",
    closesLabel: formatClosesLabel(
      json._registrationDaysLeft ?? null,
      json._registrationClosed ?? false,
      json._registrationClosesToday ?? false,
    ),
    trainingType: formatTrainingTypeCovered(d1.training_type, trainingTypeMap),
    duration: formatDurationCovered(d2.duration),
    location: showAddress
      ? [d2.address_detail, d2.address].filter(Boolean).join(", ") || undefined
      : undefined,
    streetAddress: showAddress ? d2.address || undefined : undefined,
    extendedAddress: showAddress ? d2.address_detail || undefined : undefined,
    productsCovered: formatProductsCovered(productNames),
    productNames,
    typeCodes,
  };
}

export function toTrainingSessionDetail(
  rows: PageDataItem[],
  courseHref: string,
  curriculumId: string,
  sessionId: string,
  curriculum: ParentCurriculum,
  categoryMap: Map<string, string>,
  trainingTypeMap: Map<string, string>,
  productNameMap: Map<number, string>,
): EngineeringTrainingSessionDetail | null {
  const matched = rows
    .map((raw) => ({ raw, json: (raw.dataJson ?? {}) as CurrDtlDataJson }))
    .find(({ raw }) => Number(raw.id) === Number(sessionId));
  if (!matched) return null;

  const { json } = matched;

  const d1 = json.curriculum_detail1 ?? {};
  const d2 = json.curriculum_detail2 ?? {};

  const categoryLabel = codeLabel(categoryMap, curriculum.product_category);
  const trainingTypeLabel = trainingTypeLabels(d1.training_type, trainingTypeMap);
  const productNames = extractProductNames(json, productNameMap);
  const productsCovered = productNames.join(", ");
  const dateDisplay = formatDisplayDate(d2.training_date_from ?? "");
  const compactDateRange = formatCompactDateRange(d2.training_date_from, d2.training_date_to);
  const showAddress = shouldShowAddress(d1.training_type);
  const addressFull = showAddress
    ? [d2.address, d2.address_detail]
        .filter((v): v is string => Boolean(v))
        .join(", ")
    : "";

  const scheduleRaw = Array.isArray(json.training_schedule)
    ? json.training_schedule
    : [];
  const scheduleSorted = sortSchedule(scheduleRaw);
  const agenda: EngineeringTrainingAgendaRow[] = scheduleSorted.map(
    (s, idx) => ({
      id: s.id ? String(s.id) : `agenda-${idx + 1}`,
      number: String(idx + 1),
      date: (s.date ?? "").slice(0, 10),
      time: [s.time_from, s.time_to].filter(Boolean).join(" ~ "),
      title: s.title ?? "",
      description: s.description || undefined,
      trainer: s.trainer || undefined,
    }),
  );
  const showTrainerColumn = scheduleSorted.some(
    (s) => (s.trainer ?? "").trim().length > 0,
  );

  const firstSch = scheduleSorted[0];
  const lastSch = scheduleSorted[scheduleSorted.length - 1];

  // 다중 일 교육: 가장 빠른 교육일의 가장 빠른 시작 시각 ~ 가장 늦은 교육일의 가장 늦은 종료 시각
  const firstDay = (firstSch?.date ?? "").slice(0, 10);
  const lastDay = (lastSch?.date ?? "").slice(0, 10);
  const timesOn = (day: string, pick: (s: TrainingScheduleItemRaw) => string | undefined) =>
    scheduleSorted
      .filter((s) => (s.date ?? "").slice(0, 10) === day)
      .map(pick)
      .filter((t): t is string => Boolean(t))
      .sort();
  const eventTimeFrom = timesOn(firstDay, (s) => s.time_from)[0];
  const lastDayEndTimes = timesOn(lastDay, (s) => s.time_to || s.time_from);
  const eventTimeTo = lastDayEndTimes[lastDayEndTimes.length - 1];

  return {
    courseHref,
    curriculumId,
    sessionId,
    category: categoryLabel,
    title: d2.title ?? "",
    courseTitle: curriculum.title ?? undefined,
    breadcrumbCurrent: dateDisplay,
    closesLabel: formatClosesLabel(
      json._registrationDaysLeft ?? null,
      json._registrationClosed ?? false,
      json._registrationClosesToday ?? false,
    ),
    registrationClosed: json._registrationClosed ?? false,
    registrationNotYetOpen: json._registrationNotYetOpen ?? false,
    content: sanitizeHtml(d2.content ?? ""),
    agenda,
    showTrainerColumn,
    calendar: engineeringTrainingSessionCalendarLabels,
    event: {
      title: d2.title ?? "",
      startIso: (d2.training_date_from ?? "").slice(0, 10) || firstDay,
      endIso:
        (d2.training_date_to ?? "").slice(0, 10) || lastDay || undefined,
      timeFrom: eventTimeFrom || undefined,
      timeTo: eventTimeTo || eventTimeFrom || undefined,
      location: addressFull || undefined,
      // 캘린더 메모에는 HTML 태그가 아닌 순수 텍스트만 넣는다
      description: stripHtmlText(d2.content) || undefined,
      organizerName: d2.email ? ICS_ORGANIZER_NAME : undefined,
      organizerEmail: d2.email || undefined,
      categories: curriculum.title || undefined,
    },
    countdownTo: d2.register_period_to || undefined,
    sidebar: {
      date: compactDateRange.primary,
      dateTo: compactDateRange.secondary,
      eventDateToAttend: compactDateRange.secondary
        ? `${compactDateRange.primary} - ${compactDateRange.secondary}`
        : compactDateRange.primary,
      duration: formatDurationHours(d2.duration),
      classSize: toDisplayString(d2.capacity),
      location: {
        name: "",
        address: addressFull,
        streetAddress: showAddress ? d2.address || undefined : undefined,
        extendedAddress: showAddress ? d2.address_detail || undefined : undefined,
        phone: formatPhoneDisplay(d2.phone),
        email: d2.email ?? "",
      },
      productsCovered,
      productNames,
      trainingType: trainingTypeLabel,
      registerLabel: engineeringTrainingSessionFormCopy.scrollToRegisterLabel,
    },
  };
}

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

export async function fetchTrainingCourseIdBySession(
  sessionId: string,
): Promise<string | null> {
  const raw = await fetchData<PageDataItem>({
    slug: TRAINING_DETAIL_SLUG,
    id: sessionId,
    리턴함수: (item) => item,
  });
  if (!raw) return null;
  const json = (raw.dataJson ?? {}) as CurrDtlDataJson;
  const curriculumId = json.curriculum_detail1?.curriculum_id;
  const value = curriculumId != null ? String(curriculumId).trim() : "";
  return value || null;
}

export async function resolveTrainingSessionCourseHref(
  sessionId: string,
): Promise<string | null> {
  const courseId = await fetchTrainingCourseIdBySession(sessionId);
  if (courseId == null) return null;
  const curriculum = await fetchTrainingCurriculum(courseId);
  if (!curriculum || !isCurriculumVisible(curriculum)) return null;
  return contentDetailPath(
    TRAINING_COURSE_DETAIL_HREF_PREFIX,
    courseId,
    curriculum.slug,
  );
}

/** courseId가 속한 Training 목록 페이지(Sales/Engineering/Service Training) href — 브레드크럼 "Training" 링크에 사용 */
export async function resolveTrainingVariantListHref(
  courseId: string,
): Promise<string | null> {
  const curriculum = await fetchTrainingCurriculum(courseId);
  if (!curriculum || !isCurriculumVisible(curriculum)) return null;
  const variant =
    TRAINING_VARIANT_BY_COURSE_CODE[curriculum.training_course ?? ""] ?? "sales";
  return `/services/training/${variant}`;
}

export async function fetchTrainingCurriculum(
  courseId: string,
): Promise<ParentCurriculum | null> {
  const raw = await fetchData<PageDataItem>({
    slug: TRAINING_SLUG,
    id: courseId,
    리턴함수: (item) => item,
  });
  if (!raw) return null;
  const json = (raw.dataJson ?? {}) as {
    curriculum?: ParentCurriculum;
    seo?: { slug?: string };
  };
  const curriculum = json.curriculum;
  if (!curriculum) return null;
  return { ...curriculum, id: Number(raw.id), slug: json.seo?.slug || null };
}

export async function fetchProductNamesForRows(
  rows: PageDataItem[],
): Promise<Map<number, string>> {
  const ids = new Set<number>();
  for (const raw of rows) {
    const json = (raw.dataJson ?? {}) as CurrDtlDataJson;
    for (const ref of productRefsOf(json)) {
      const id = depth3Of(ref);
      if (id != null) ids.add(id);
    }
  }
  return fetchProductNamesByIds(Array.from(ids));
}

export async function fetchTrainingCourseTitle(
  courseId: string,
): Promise<string | null> {
  const curriculum = await fetchTrainingCurriculum(courseId);
  if (!isCurriculumVisible(curriculum)) return null;
  const title = curriculum?.title;
  return title && title.trim() ? title : null;
}

function ogImageFromCurriculum(
  curriculum: ParentCurriculum | null,
): string | undefined {
  const imageArr = curriculum?.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? Number(imageArr[0]) : null;
  if (mediaId == null || Number.isNaN(mediaId)) return undefined;
  return `${SITE_URL}${trainingImageSrc(mediaId)}`;
}

function buildOgMetadata(
  previous: ResolvedMetadata,
  title: string,
  description: string,
  image?: string,
  url?: string,
): Metadata {
  return mergeSeoMetadata(previous, title, description, image, url);
}

export async function buildCourseMetadata(
  courseId: string,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [curriculum, previous] = await Promise.all([
    fetchTrainingCurriculum(courseId),
    parent,
  ]);
  if (!isCurriculumVisible(curriculum) || !curriculum) return {};
  const courseUrl = `${SITE_URL}${contentDetailPath(
    TRAINING_COURSE_DETAIL_HREF_PREFIX,
    courseId,
    curriculum.slug,
  )}`;
  return buildOgMetadata(
    previous,
    curriculum.title ?? "",
    curriculum.description ?? "",
    ogImageFromCurriculum(curriculum),
    courseUrl,
  );
}

export async function buildSessionMetadata(
  sessionId: string,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const courseId = await fetchTrainingCourseIdBySession(sessionId);
  if (courseId == null) return {};
  const [rows, curriculum, previous] = await Promise.all([
    fetchTrainingDetailRows(courseId),
    fetchTrainingCurriculum(courseId),
    parent,
  ]);
  if (!isCurriculumVisible(curriculum)) return {};
  const matched = rows
    .map((raw) => ({ raw, json: (raw.dataJson ?? {}) as CurrDtlDataJson }))
    .find(({ raw }) => Number(raw.id) === Number(sessionId));
  if (!matched) return {};
  const d2 = matched.json.curriculum_detail2 ?? {};
  const sessionUrl = `${SITE_URL}${contentDetailPath(
    TRAINING_SESSION_DETAIL_HREF_PREFIX,
    sessionId,
    matched.json.seo?.slug ?? null,
  )}`;
  return buildOgMetadata(
    previous,
    d2.title ?? "",
    curriculum?.description ?? "",
    ogImageFromCurriculum(curriculum),
    sessionUrl,
  );
}
