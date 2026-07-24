// Company Events(slug: events-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/events-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - press/blog/articles와 달리 category 대신 location/period_from/period_to(행사기간) 필드를 씀
import { formatDisplayDateRange, formatMonthLabel } from "@/lib/formatDate";
import { siteToday, siteTodayStr } from "@/lib/siteTime";
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

// 공개 여부만(게시일 조건 제외) — 모든 섹션(Featured/Calendar/Past/상세)이 isVisible만 확인
// (사용자 확정: publishDttm 게이트는 전 섹션에서 미사용 — events-data.md 3-1/3-2/3-3/3-4)
// 필드명은 is_visible(snake) — page_template events-basicInfo 확인
const EVENTS_VISIBLE_WHERE: Record<string, string> = { eq_is_visible: "001" };

// 지난 이벤트만(events 전용) — period_to 기준(events-data.md 확정사항 3). Past 목록/인접 스코프 게이트.
const EVENTS_PAST_WHERE: Record<string, string> = {
  condexpr_upcoming: "period_to>=today()?'upcoming':'past'",
  condval_upcoming: "past",
};

// "YYYY-MM-DD" 포맷 헬퍼(로컬 타임존 기준, UTC 변환 오차 방지)
function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Featured 조회 범위(events-data.md 3-1, "이번달~다음달 + 미시작만")
// 문서 스펙: period_from_gte=이번달1일 & period_from_lte=다음달말일 & period_from>=today()(미시작만)
// 하한 max(이번달1일, today)는 today가 항상 이번달1일 이후이므로 언제나 today와 같다.
// 따라서 period_from_gte를 today로 직접 잡으면 별도 조건식(condexpr) 없이 "미시작만"까지 동시에 만족한다.
function thisAndNextMonthRange(now: Date) {
  const from = now; // 미시작만: 하한을 today로(= max(이번달1일, today))
  const to = new Date(now.getFullYear(), now.getMonth() + 2, 0); // 다음달 마지막날
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
    // 표시용 "Mon D, YYYY - Mon D, YYYY" 포맷 변환(양쪽 다 전체 표기)
    dateRange: formatDisplayDateRange(periodFrom, periodTo),
    dates: formatDisplayDateRange(periodFrom, periodTo),
    imageSrc: mediaId != null ? eventsImageSrc(mediaId) : null,
  };
}

// ---------------- fetchData query 헬퍼(where + sort + 리턴함수 캡슐화) ----------------
// events는 다른 파일에서 재사용되지 않으므로 각 섹션 조립을 이 파일에 캡슐화한다.
// 소비처(CompanyEventsPage / events detail page)는 이 헬퍼 결과를 fetchData에 그대로 넘긴다.

// Featured(상단) — 이번달~다음달, 미시작만(period_from>=today), events-data.md 3-1
export function eventsFeaturedQuery(fallbackImage: string, now: Date = siteToday()) {
  const { from, to } = thisAndNextMonthRange(now);
  return {
    slug: "events-data",
    page: 0,
    size: 100,
    // sort는 단순키에 중첩 fallback이 없어 래퍼키 포함 dot-notation 필수. contentKey eventsForm→events로 변경됨
    sort: "events.period_from,asc",
    where: {
      ...EVENTS_VISIBLE_WHERE,
      // 목록 카드는 content(본문) slugkey 미사용 → 대용량 content 필드를 응답에서 제외(성능 최적화, 상세는 미적용)
      exclude: "content",
      // from은 today(미시작만), to는 다음달 말일 — thisAndNextMonthRange 주석 참고
      period_from_gte: from,
      period_from_lte: to,
    },
    리턴함수: (rows: PageDataItem[]): EventsFeaturedItem[] =>
      rows.map((item) => {
        const c = toEventsCommon(item);
        return {
          id: String(c.id),
          title: c.title,
          dateRange: c.dateRange,
          venue: c.venue,
          image: c.imageSrc ?? fallbackImage,
          href: eventsDetailHref(c.id),
        };
      }),
  };
}

// Calendar — 전체조회(unpaged) 후 FE에서 지난 이벤트 개별 제외, period_from 월별 그룹핑, events-data.md 3-2
export function eventsCalendarQuery() {
  return {
    slug: "events-data",
    page: 0,
    unpaged: true, // 개수 제한 없이 전체 조회(기존 size=100 캡 제거)
    // BE upcoming(미종료) 조건 제거 — 지난 이벤트 제외는 아래 리턴함수 필터에서 처리
    sort: "events.period_from,asc",
    // 목록(캘린더)은 content(본문) slugkey 미사용 → 대용량 content 필드를 응답에서 제외(성능 최적화, 상세는 미적용)
    where: { ...EVENTS_VISIBLE_WHERE, exclude: "content" },
    // content 배열 전체 → 월별 그룹핑 변환(원소별 map 아님)
    리턴함수: (rows: PageDataItem[]): EventsCalendarMonth[] => {
      const todayStr = siteTodayStr(); // 사이트 타임존 기준 오늘 "YYYY-MM-DD"
      const monthMap = new Map<string, EventsCalendarEntry[]>();
      for (const item of rows) {
        const c = toEventsCommon(item);
        if (!c.periodFrom) continue;
        // 지난 이벤트(종료일이 오늘 이전)는 캘린더에서 개별 제외 — "YYYY-MM-DD" 문자열 비교
        if (c.periodTo && c.periodTo < todayStr) continue;
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
          label: formatMonthLabel(monthKey), // "2026-02" → "Feb, 2026"
          events,
        }));
    },
  };
}

// Past — period_to<today, 검색/정렬/월/연도(전부 period_from 기준), events-data.md 3-3
export function eventsPastQuery(params: {
  page: number; // 0-based
  search?: string;
  sort?: "latest" | "oldest" | "az" | "za"; // latest/oldest는 행사기간, az/za는 제목 정렬
  month?: string; // "01"~"12"
  year?: string; // "YYYY"
  fallbackImage: string;
}) {
  const where: Record<string, string> = {
    ...EVENTS_VISIBLE_WHERE,
    ...EVENTS_PAST_WHERE,
    // 목록 카드는 content(본문) slugkey 미사용 → 대용량 content 필드를 응답에서 제외(성능 최적화, 상세는 미적용)
    exclude: "content",
  };
  if (params.search) where["title|content|location"] = params.search;
  if (params.month) where["month_period_from"] = params.month;
  if (params.year) where["year_period_from"] = params.year;
  // 정렬 분기: az/za는 제목(title), 그 외는 행사기간(period_from). latest=desc(기본)/oldest=asc
  const sort =
    params.sort === "az"
      ? "events.title,asc"
      : params.sort === "za"
        ? "events.title,desc"
        : `events.period_from,${params.sort === "oldest" ? "asc" : "desc"}`;
  const fallbackImage = params.fallbackImage;
  return {
    slug: "events-data",
    page: params.page,
    size: EVENTS_PAST_SIZE,
    sort,
    where,
    리턴함수: (rows: PageDataItem[]): EventsPastItem[] =>
      rows.map((item) => {
        const c = toEventsCommon(item);
        return {
          id: String(c.id),
          title: c.title,
          dateRange: c.dateRange,
          image: c.imageSrc ?? fallbackImage,
          href: eventsDetailHref(c.id),
        };
      }),
  };
}

// 상세 단건 — 공개 여부만 게이트(eq_is_visible=001, 게시일 조건 제외). Past 이벤트 상세도 접근 가능해야 함.
// 리턴함수 identity로 raw EventsRow를 그대로 받아 page.tsx의 flatten/pickField 로직을 유지한다.
export function eventsDetailQuery(id: string | number) {
  return {
    slug: "events-data",
    id,
    where: { ...EVENTS_VISIBLE_WHERE },
    리턴함수: (raw: PageDataItem): EventsRow => raw,
  };
}

// 인접 이벤트 — 상세와 스코프 게이트가 다름에 주의: Past 목록과 동일(공개 + 과거 이벤트만) 이웃 후보 한정.
// sortField=events.period_from(행사기간 기준), titleField=events.title
export function eventsAdjacentQuery(id: string | number) {
  return {
    slug: "events-data",
    id,
    adjacent: true as const,
    sortField: "events.period_from",
    titleField: "events.title",
    where: { ...EVENTS_VISIBLE_WHERE, ...EVENTS_PAST_WHERE },
  };
}
