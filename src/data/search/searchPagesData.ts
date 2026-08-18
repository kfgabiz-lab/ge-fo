import { fetchApi } from "@/lib/api";
import { stripHtmlText } from "@/lib/stripHtmlText";
import type { SearchPageItem } from "@/data/search/searchAllContent";

const SEARCH_PAGES_DESCRIPTION_MAX_LENGTH = 399;


export type PageSectionCode = "MARKETS" | "SERVICE" | "SUPPORT" | "COMPANY";

type PageSectionMeta = {
  optionId: string;
  sectionCode: PageSectionCode;
  filterLabel: string;
};

export const SEARCH_PAGE_SECTIONS: PageSectionMeta[] = [
  { optionId: "markets", sectionCode: "MARKETS", filterLabel: "Markets" },
  { optionId: "service", sectionCode: "SERVICE", filterLabel: "Service" },
  { optionId: "support", sectionCode: "SUPPORT", filterLabel: "Support" },
  { optionId: "company", sectionCode: "COMPANY", filterLabel: "Company" },
];

const SECTION_BY_OPTION_ID = new Map(
  SEARCH_PAGE_SECTIONS.map((meta) => [meta.optionId, meta]),
);

export function toPageSectionsParam(optionIds: string[]): string {
  return SEARCH_PAGE_SECTIONS.filter((meta) => optionIds.includes(meta.optionId))
    .map((meta) => meta.sectionCode)
    .join(",");
}

export function getPageSectionMeta(optionId: string): PageSectionMeta | undefined {
  return SECTION_BY_OPTION_ID.get(optionId);
}


interface PageSearchApiItem {
  id: number;
  url: string;
  title: string;
  snippet: string;
  section: string | null;
  sectionName: string | null;
}

interface PageSearchApiResponse {
  content: PageSearchApiItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  sectionCounts: Record<string, number>;
}


export interface SearchPagesResult {
  items: SearchPageItem[];
  totalElements: number;
  totalPages: number;
  counts: Record<string, number>;
}

export const EMPTY_SEARCH_PAGES_RESULT: SearchPagesResult = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  counts: Object.fromEntries(
    SEARCH_PAGE_SECTIONS.map((meta) => [meta.optionId, 0]),
  ),
};

function toOptionCounts(
  sectionCounts?: Record<string, number>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const meta of SEARCH_PAGE_SECTIONS) {
    const raw = sectionCounts?.[meta.sectionCode];
    counts[meta.optionId] = typeof raw === "number" ? raw : 0;
  }
  return counts;
}

function toPageItem(
  item: PageSearchApiItem,
  highlight: string,
): SearchPageItem {
  return {
    id: `PAGE-${item.id}`,
    href: item.url ?? "",
    category: item.sectionName ?? "",
    title: item.title ?? "",
    description: stripHtmlText(item.snippet, SEARCH_PAGES_DESCRIPTION_MAX_LENGTH),
    highlight: highlight || undefined,
  };
}


export interface SearchPagesQueryOptions {
  sections?: string[];
  page?: number;
  size?: number;
}

export async function fetchSearchPages(
  query: string,
  options: SearchPagesQueryOptions = {},
): Promise<SearchPagesResult> {
  const { sections = [], page = 0, size = 10 } = options;
  const q = query.trim();
  if (!q && sections.length === 0) return EMPTY_SEARCH_PAGES_RESULT;

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const sectionsParam = toPageSectionsParam(sections);
    if (sectionsParam) params.set("sections", sectionsParam);
    params.set("page", String(page));
    params.set("size", String(size));

    const res = await fetchApi<PageSearchApiResponse>(
      `/api/v1/fo/page-search?${params.toString()}`,
    );

    const content = Array.isArray(res?.content) ? res.content : [];
    return {
      items: content.map((item) => toPageItem(item, q)),
      totalElements:
        typeof res?.totalElements === "number" ? res.totalElements : 0,
      totalPages: typeof res?.totalPages === "number" ? res.totalPages : 0,
      counts: toOptionCounts(res?.sectionCounts),
    };
  } catch {
    return EMPTY_SEARCH_PAGES_RESULT;
  }
}
