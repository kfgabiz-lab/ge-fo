import { contentDetailPath } from "@/lib/contentDetailPath";
import { formatDisplayDateRange, formatMonthLabel } from "@/lib/formatDate";
import { siteToday } from "@/lib/siteTime";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";
import type {
  EventsCalendarEntry,
  EventsCalendarMonth,
  EventsFeaturedItem,
  EventsPastItem,
} from "@/app/company/data/eventsListContent";

export const EVENTS_PAST_SIZE = 9;

export const eventsImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;
export const eventsDetailHref = (id: string | number, slug?: string | null) =>
  contentDetailPath("/company/events", id, slug);

export type EventsRow = PageDataItem;

/** 게시상태는 bo-api가 events-data에 대해 서버측에서 항상 강제한다 — 클라이언트가 조건을 보낼 필요 없음 */
const EVENTS_VISIBLE_WHERE: Record<string, string> = {};

const EVENTS_PAST_WHERE: Record<string, string> = {
  condexpr_upcoming: "period_to>=today()?'upcoming':'past'",
  condval_upcoming: "past",
};

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function nextMonthEnd(now: Date) {
  return toDateStr(new Date(now.getFullYear(), now.getMonth() + 2, 0));
}

function toEventsCommon(item: EventsRow) {
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const periodFrom = (pickField(row, "period_from", "periodFrom") as string) ?? "";
  const periodTo = (pickField(row, "period_to", "periodTo") as string) ?? "";
  return {
    id: item.id,
    slug: (row["seo.slug"] as string) || null,
    title: (row.title as string) ?? "",
    venue: (row.location as string) ?? "",
    periodFrom,
    periodTo,
    dateRange: formatDisplayDateRange(periodFrom, periodTo),
    dates: formatDisplayDateRange(periodFrom, periodTo),
    imageSrc: mediaId != null ? eventsImageSrc(mediaId) : null,
  };
}

export function eventsFeaturedQuery(fallbackImage: string, now: Date = siteToday()) {
  return {
    slug: "events-data",
    page: 0,
    size: 2,
    sort: "events.period_from,asc",
    where: {
      ...EVENTS_VISIBLE_WHERE,
      exclude: "content",
      period_from_gte: "today()",
      //period_from_lte: nextMonthEnd(now),
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
          href: eventsDetailHref(c.id, c.slug),
        };
      }),
  };
}

export function eventsCalendarQuery() {
  return {
    slug: "events-data",
    page: 0,
    unpaged: true,
    sort: "events.period_from,asc",
    where: {
      ...EVENTS_VISIBLE_WHERE,
      exclude: "content",
      condexpr_upcoming: "period_to>=today()?'upcoming':'past'",
      condval_upcoming: "upcoming",
    },
    리턴함수: (rows: PageDataItem[]): EventsCalendarMonth[] => {
      const monthMap = new Map<string, EventsCalendarEntry[]>();
      for (const item of rows) {
        const c = toEventsCommon(item);
        if (!c.periodFrom) continue;
        const monthKey = c.periodFrom.slice(0, 7);
        const entry: EventsCalendarEntry = {
          id: String(c.id),
          title: c.title,
          venue: c.venue,
          dates: c.dates,
          href: eventsDetailHref(c.id, c.slug),
        };
        const list = monthMap.get(monthKey) ?? [];
        list.push(entry);
        monthMap.set(monthKey, list);
      }
      return Array.from(monthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([monthKey, events]) => ({
          id: monthKey,
          label: formatMonthLabel(monthKey),
          events,
        }));
    },
  };
}

export function eventsPastQuery(params: {
  page: number;
  search?: string;
  sort?: "latest" | "oldest" | "az" | "za";
  month?: string;
  year?: string;
  fallbackImage: string;
}) {
  const where: Record<string, string> = {
    ...EVENTS_VISIBLE_WHERE,
    ...EVENTS_PAST_WHERE,
    exclude: "content",
  };
  if (params.search) where["title|content|location"] = params.search;
  if (params.month) where["month_period_from"] = params.month;
  if (params.year) where["year_period_from"] = params.year;
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
        [...rows]
            .sort((a, b) => {
              // A-Z / Z-A는 서버 정렬 그대로 사용
              if (params.sort === "az" || params.sort === "za") {
                return 0;
              }

              const aRow = flattenPageDataItem(a);
              const bRow = flattenPageDataItem(b);

              const aPeriodFrom =
                  (pickField(aRow, "period_from", "periodFrom") as string) ?? "";
              const bPeriodFrom =
                  (pickField(bRow, "period_from", "periodFrom") as string) ?? "";

              // 날짜가 다르면 서버에서 정렬한 순서 유지
              if (aPeriodFrom !== bPeriodFrom) {
                return 0;
              }

              // 동일 날짜일 때만 보조 정렬
              return params.sort === "oldest"
                  ? Number(a.id) - Number(b.id) // Oldest: id ASC
                  : Number(b.id) - Number(a.id); // Latest: id DESC
            })
            .map((item) => {
              const c = toEventsCommon(item);

              return {
                id: String(c.id),
                title: c.title,
                dateRange: c.dateRange,
                image: c.imageSrc ?? fallbackImage,
                href: eventsDetailHref(c.id, c.slug),
              };
            }),
  };
}

export function eventsDetailQuery(id: string | number, opts?: { previewToken?: string | null }) {
  return {
    slug: "events-data",
    id,
    where: opts?.previewToken
      ? { previewToken: opts.previewToken }
      : { ...EVENTS_VISIBLE_WHERE },
    리턴함수: (raw: PageDataItem): EventsRow => raw,
  };
}

export function eventsAdjacentQuery(id: string | number) {
  return {
    slug: "events-data",
    id,
    adjacent: true as const,
    sortField: "events.period_from",
    titleField: "events.title",
    slugField: "seo.slug",
    where: { ...EVENTS_VISIBLE_WHERE, ...EVENTS_PAST_WHERE },
  };
}
