// Company Events(slug: events-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/events-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - press/blog/articles와 달리 category 대신 location/period_from/period_to(행사기간) 필드를 씀
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";
import type {
  EventsCalendarEntry,
  EventsCalendarMonth,
  EventsFeaturedItem,
  EventsPastItem,
} from "@/app/company/data/eventsListContent";

export const EVENTS_PAST_SIZE = 10;

export const eventsImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;
export const eventsDetailHref = (id: number) => `/company/events/detail/${id}`;

// ---------------- 응답 원본 타입 ----------------

export type EventsRow = PageDataItem;

interface EventsPageResponse {
  content: EventsRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// 게시상태(A조건) — 공개 + 게시일 도래. Upcoming(Featured/Calendar)에만 적용(events-data.md 3절)
function applyPublishedCondition(sp: URLSearchParams) {
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
}

// 공개 여부만(게시일 조건 제외) — Past/상세는 publishDttm 무시하고 isVisible만 확인
// (사용자 확정: 지난 이벤트는 publishDttm이 과거여도 보여야 함 — publishDttm은 "노출 유지 기한" 성격이라
//  이미 끝난 행사의 기록성 노출과는 무관)
function applyVisibleOnlyCondition(sp: URLSearchParams) {
  // 필드명이 isVisible→is_visible(snake)로 변경됨(page_template events-basicInfo 확인). 33행 condexpr_status와 동일 필드명으로 정합성 유지
  sp.set("eq_is_visible", "001");
}

// 예정/지난 분류(events 전용) — period_to 기준(events-data.md 확정사항 3)
function applyUpcomingCondition(sp: URLSearchParams, upcoming: boolean) {
  sp.set("condexpr_upcoming", "period_to>=today()?'upcoming':'past'");
  sp.set("condval_upcoming", upcoming ? "upcoming" : "past");
}

// "YYYY-MM-DD" 포맷 헬퍼(로컬 타임존 기준, UTC 변환 오차 방지)
function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 이전달 1일 ~ 이번달 마지막날 범위(events-data.md 3-1, Featured="이번달+이전달 전체")
function thisAndLastMonthRange(now: Date) {
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toDateStr(from), to: toDateStr(to) };
}

// 원본 행 → venue/dateRange 등 공통 가공값
function toEventsCommon(item: EventsRow) {
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  // 신규(period_from/period_to)/구(periodFrom/periodTo) 스키마 모두 지원 — 신규 우선
  const periodFrom = (pickField(row, "period_from", "periodFrom") as string) ?? "";
  const periodTo = (pickField(row, "period_to", "periodTo") as string) ?? "";
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    venue: (row.location as string) ?? "",
    periodFrom,
    periodTo,
    dateRange: periodFrom && periodTo ? `${periodFrom} - ${periodTo}` : periodFrom || periodTo,
    dates: periodFrom && periodTo ? `${periodFrom}~ ${periodTo}` : periodFrom || periodTo,
    imageSrc: mediaId != null ? eventsImageSrc(mediaId) : null,
  };
}

// ---------------- 조회 함수 ----------------

// Featured(상단) — 이번달+이전달 전체(개수 제한 없음), events-data.md 3-1
export async function fetchEventsFeatured(
  fallbackImage: string,
  now: Date = new Date(),
): Promise<EventsFeaturedItem[]> {
  const { from, to } = thisAndLastMonthRange(now);
  const sp = new URLSearchParams();
  sp.set("page", "0");
  sp.set("size", "100");
  applyPublishedCondition(sp);
  sp.set("period_from_gte", from);
  sp.set("period_from_lte", to);
  // sort는 단순키에 중첩 fallback이 없어 래퍼키 포함 dot-notation 필수. contentKey eventsForm→events로 변경됨
  sp.set("sort", "events.period_from,asc");

  const res = await fetchApi<EventsPageResponse>(
    `/api/v1/fo/page-data/events-data?${sp.toString()}`,
  );
  return (res.content ?? []).map((item) => {
    const c = toEventsCommon(item);
    return {
      id: String(c.id),
      title: c.title,
      dateRange: c.dateRange,
      venue: c.venue,
      image: c.imageSrc ?? fallbackImage,
      href: eventsDetailHref(c.id),
    };
  });
}

// Calendar — Upcoming(period_to>=today)을 period_from 월별로 그룹핑, events-data.md 3-2
export async function fetchEventsCalendar(): Promise<EventsCalendarMonth[]> {
  const sp = new URLSearchParams();
  sp.set("page", "0");
  sp.set("size", "100");
  applyPublishedCondition(sp);
  applyUpcomingCondition(sp, true);
  // sort는 단순키에 중첩 fallback이 없어 래퍼키 포함 dot-notation 필수. contentKey eventsForm→events로 변경됨
  sp.set("sort", "events.period_from,asc");

  const res = await fetchApi<EventsPageResponse>(
    `/api/v1/fo/page-data/events-data?${sp.toString()}`,
  );

  const monthMap = new Map<string, EventsCalendarEntry[]>();
  for (const item of res.content ?? []) {
    const c = toEventsCommon(item);
    if (!c.periodFrom) continue;
    const monthKey = c.periodFrom.slice(0, 7); // "YYYY-MM"
    const entry: EventsCalendarEntry = {
      id: String(c.id),
      title: c.title,
      venue: c.venue,
      dates: c.dates,
      href: eventsDetailHref(c.id),
    };
    const list = monthMap.get(monthKey) ?? [];
    list.push(entry);
    monthMap.set(monthKey, list);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, events]) => ({
      id: monthKey,
      label: monthKey,
      events,
    }));
}

export interface EventsPastResult {
  items: EventsPastItem[];
  totalPages: number;
  page: number; // 0-based
}

// Past — period_to<today, 검색/정렬/월/연도(전부 period_from 기준), events-data.md 3-3
export async function fetchEventsPast(params: {
  page: number; // 0-based
  search?: string;
  sort?: "latest" | "oldest" | "az" | "za"; // latest/oldest는 행사기간, az/za는 제목 정렬
  month?: string; // "01"~"12"
  year?: string; // "YYYY"
  fallbackImage: string;
}): Promise<EventsPastResult> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(EVENTS_PAST_SIZE));
  applyVisibleOnlyCondition(sp);
  applyUpcomingCondition(sp, false);
  if (params.search) sp.set("title|content|location", params.search);
  if (params.month) sp.set("month_period_from", params.month);
  if (params.year) sp.set("year_period_from", params.year);
  // sort는 단순키에 중첩 fallback이 없어 래퍼키 포함 dot-notation 필수. contentKey eventsForm→events로 변경됨
  // 정렬 분기: latest/oldest는 행사기간(period_from), az/za는 제목(title) 기준
  if (params.sort === "az") sp.set("sort", "events.title,asc"); // 제목 A-Z(오름차순)
  else if (params.sort === "za") sp.set("sort", "events.title,desc"); // 제목 Z-A(내림차순)
  else sp.set("sort", `events.period_from,${params.sort === "oldest" ? "asc" : "desc"}`); // latest=최신순(desc, 기본)/oldest=오래된순(asc)

  const res = await fetchApi<EventsPageResponse>(
    `/api/v1/fo/page-data/events-data?${sp.toString()}`,
  );
  const items: EventsPastItem[] = (res.content ?? []).map((item) => {
    const c = toEventsCommon(item);
    return {
      id: String(c.id),
      title: c.title,
      dateRange: c.dateRange,
      image: c.imageSrc ?? params.fallbackImage,
      href: eventsDetailHref(c.id),
    };
  });
  return {
    items,
    totalPages: res.totalPages || 1,
    page: res.page ?? params.page,
  };
}

// 상세 단건 조회 — 신규 상세 엔드포인트 GET /{slug}/{id} 사용(목록 search 재활용 방식 폐기)
// - 상세 게이트는 공개 여부만(eq_is_visible=001, 게시일 조건 제외) — Past 이벤트 상세도 접근 가능해야 하므로
//   Featured/Calendar(Upcoming)처럼 publishDttm 게이트를 걸지 않음(Past와 동일 원칙)
// - 응답은 기존 목록 content[0]과 동일한 PageDataResponse(EventsRow) 단건 형태 → flatten 후처리 그대로 유지
// - 못 찾거나 게이트 탈락 시 BE가 HTTP 404 → catch→null(page.tsx에서 notFound())
export async function fetchEventsDetail(id: string | number): Promise<EventsRow | null> {
  const sp = new URLSearchParams();
  applyVisibleOnlyCondition(sp);
  try {
    return await fetchApi<EventsRow>(
      `/api/v1/fo/page-data/events-data/${id}?${sp.toString()}`,
    );
  } catch (e) {
    // 404(미존재/게이트 탈락)만 null 반환, 그 외 오류는 전파
    if (e instanceof Error && e.message.includes("실패: 404")) return null;
    throw e;
  }
}

// ---------------- 인접글(이전/다음) ----------------

// 인접 이웃 1건(신규 adjacent 엔드포인트 응답)
export interface EventsAdjacentNeighbor {
  id: number;
  title: string;
}

// adjacent 엔드포인트 응답 {prev, next}
export interface EventsAdjacentResult {
  prev: EventsAdjacentNeighbor | null;
  next: EventsAdjacentNeighbor | null;
}

// 인접 이벤트 조회 — 신규 엔드포인트 GET /{slug}/{id}/adjacent 사용(FE Past 목록 index 계산 방식 폐기)
// - 상세와 스코프 게이트가 다름에 주의: 인접은 Past 목록(fetchEventsPast)과 동일하게
//   공개(eq_is_visible=001) + 과거 이벤트(condexpr_upcoming=past)만 이웃 후보로 한정
// - sortField=events.period_from(행사기간 기준), titleField=events.title
export async function fetchEventsAdjacent(
  id: string | number,
): Promise<EventsAdjacentResult> {
  const sp = new URLSearchParams();
  sp.set("sortField", "events.period_from");
  sp.set("titleField", "events.title");
  // 인접 스코프 게이트: Past 목록과 동일(공개 + 과거 이벤트만)
  applyVisibleOnlyCondition(sp);
  applyUpcomingCondition(sp, false);
  try {
    return await fetchApi<EventsAdjacentResult>(
      `/api/v1/fo/page-data/events-data/${id}/adjacent?${sp.toString()}`,
    );
  } catch (e) {
    // 404(미존재/게이트 탈락) 시 pager 미표시(상세 본문 렌더는 유지), 그 외 오류는 전파
    if (e instanceof Error && e.message.includes("실패: 404")) {
      return { prev: null, next: null };
    }
    throw e;
  }
}
