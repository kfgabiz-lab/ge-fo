// Company Events(slug: events-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/events-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - press/blog/articles와 달리 category 대신 location/period_from/period_to(행사기간) 필드를 씀
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
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
  sp.set("condexpr_status", "isVisible=001,publishDttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
}

// 공개 여부만(게시일 조건 제외) — Past/상세는 publishDttm 무시하고 isVisible만 확인
// (사용자 확정: 지난 이벤트는 publishDttm이 과거여도 보여야 함 — publishDttm은 "노출 유지 기한" 성격이라
//  이미 끝난 행사의 기록성 노출과는 무관)
function applyVisibleOnlyCondition(sp: URLSearchParams) {
  sp.set("eq_isVisible", "001");
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
  const periodFrom = (row.period_from as string) ?? "";
  const periodTo = (row.period_to as string) ?? "";
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
  sp.set("sort", "eventsForm.period_from,asc");

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
  sp.set("sort", "eventsForm.period_from,asc");

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
  sort?: "latest" | "oldest";
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
  sp.set("sort", `eventsForm.period_from,${params.sort === "oldest" ? "asc" : "desc"}`);

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

// 상세 단건 조회(top-level id 정확일치 + 공개 여부만) — Past 이벤트 상세도 접근 가능해야 하므로
// Featured/Calendar(Upcoming)처럼 publishDttm 게이트를 걸지 않음(Past와 동일 원칙)
export async function fetchEventsDetail(id: string | number): Promise<EventsRow | null> {
  const sp = new URLSearchParams();
  sp.set("eq_id", String(id));
  applyVisibleOnlyCondition(sp);
  const res = await fetchApi<EventsPageResponse>(
    `/api/v1/fo/page-data/events-data?${sp.toString()}`,
  );
  return res.content?.[0] ?? null;
}
