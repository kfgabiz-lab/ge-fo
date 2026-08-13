import { fetchApi } from "@/lib/api";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";
import type { SearchMediaItem } from "@/data/search/searchAllContent";


export type MediaSourceType = "TECH_HUB" | "BLOG" | "PRESS" | "ARTICLE";

type MediaSourceMeta = {
  optionId: string;
  sourceType: MediaSourceType;
  filterLabel: string;
  categoryLabel: string;
};

export const SEARCH_MEDIA_SOURCES: MediaSourceMeta[] = [
  {
    optionId: "tech-hub",
    sourceType: "TECH_HUB",
    filterLabel: "Tech Hub",
    categoryLabel: "Tech Hub",
  },
  {
    optionId: "blog",
    sourceType: "BLOG",
    filterLabel: "Blog",
    categoryLabel: "Blog",
  },
  {
    optionId: "press",
    sourceType: "PRESS",
    filterLabel: "Press",
    categoryLabel: "Press",
  },
  {
    optionId: "articles",
    sourceType: "ARTICLE",
    filterLabel: "Articles",
    categoryLabel: "Article",
  },
];

const SOURCE_BY_OPTION_ID = new Map(
  SEARCH_MEDIA_SOURCES.map((meta) => [meta.optionId, meta]),
);
const SOURCE_BY_TYPE = new Map(
  SEARCH_MEDIA_SOURCES.map((meta) => [meta.sourceType, meta]),
);

export function toMediaSourcesParam(optionIds: string[]): string {
  return SEARCH_MEDIA_SOURCES.filter((meta) => optionIds.includes(meta.optionId))
    .map((meta) => meta.sourceType)
    .join(",");
}


interface MediaSearchApiItem {
  sourceType: string;
  id: number;
  title: string | null;
  snippet: string | null;
  imageUrl: string | null;
  sortDate: string | null;
  link: string | null;
}

interface MediaSearchApiResponse {
  content: MediaSearchApiItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  sourceCounts: Record<string, number>;
}


export interface SearchMediaResult {
  items: SearchMediaItem[];
  totalElements: number;
  totalPages: number;
  counts: Record<string, number>;
}

export const EMPTY_SEARCH_MEDIA_RESULT: SearchMediaResult = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  counts: Object.fromEntries(
    SEARCH_MEDIA_SOURCES.map((meta) => [meta.optionId, 0]),
  ),
};

function toOptionCounts(
  sourceCounts?: Record<string, number>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const meta of SEARCH_MEDIA_SOURCES) {
    const raw = sourceCounts?.[meta.sourceType];
    counts[meta.optionId] = typeof raw === "number" ? raw : 0;
  }
  return counts;
}

function toMediaCard(
  item: MediaSearchApiItem,
  highlight: string,
): SearchMediaItem {
  const meta = SOURCE_BY_TYPE.get(item.sourceType as MediaSourceType);
  const isVideo = item.sourceType === "TECH_HUB";
  const description = stripHtmlText(item.snippet, LIST_DESCRIPTION_MAX_LENGTH);

  return {
    id: `${item.sourceType}-${item.id}`,
    href: item.link ?? "",
    image: item.imageUrl ?? "",
    category: meta?.categoryLabel ?? "",
    title: item.title ?? "",
    description: description || undefined,
    highlight: highlight || undefined,
    variant: isVideo ? "video" : "default",
  };
}


export interface SearchMediaQueryOptions {
  sources?: string[];
  page?: number;
  size?: number;
}

export async function fetchSearchMedia(
  query: string,
  options: SearchMediaQueryOptions = {},
): Promise<SearchMediaResult> {
  const { sources = [], page = 0, size = 10 } = options;
  const q = query.trim();
  if (!q && sources.length === 0) return EMPTY_SEARCH_MEDIA_RESULT;

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const sourcesParam = toMediaSourcesParam(sources);
    if (sourcesParam) params.set("sources", sourcesParam);
    params.set("page", String(page));
    params.set("size", String(size));

    const res = await fetchApi<MediaSearchApiResponse>(
      `/api/v1/fo/media-search?${params.toString()}`,
    );

    const content = Array.isArray(res?.content) ? res.content : [];
    return {
      items: content.map((item) => toMediaCard(item, q)),
      totalElements:
        typeof res?.totalElements === "number" ? res.totalElements : 0,
      totalPages: typeof res?.totalPages === "number" ? res.totalPages : 0,
      counts: toOptionCounts(res?.sourceCounts),
    };
  } catch {
    return EMPTY_SEARCH_MEDIA_RESULT;
  }
}

export function getMediaSourceMeta(optionId: string): MediaSourceMeta | undefined {
  return SOURCE_BY_OPTION_ID.get(optionId);
}
