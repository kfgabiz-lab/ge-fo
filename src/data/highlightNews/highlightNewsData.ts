import type { HighlightNewsItem } from "@/types/highlightNews";
import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import {
  PRESS_LIST_SIZE,
  PRESS_STATUS_WHERE,
  pressDetailHref,
  pressImageSrc,
  toPressCard,
  type PressRow,
} from "@/app/company/data/pressData";
import {
  BLOG_LIST_SIZE,
  BLOG_STATUS_WHERE,
  blogDetailHref,
  blogImageSrc,
  toBlogCard,
  type BlogRow,
} from "@/app/company/data/blogData";
import {
  ARTICLES_LIST_SIZE,
  ARTICLES_STATUS_WHERE,
  articlesDetailHref,
  articlesImageSrc,
  toArticlesCard,
  type ArticlesRow,
} from "@/app/company/data/articlesData";

const HIGHLIGHT_LIMIT = 3;

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatNewsDate(raw: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  const monthIdx = Number(m[2]) - 1;
  if (monthIdx < 0 || monthIdx > 11) return raw;
  return `${MONTH_ABBR[monthIdx]} ${m[3]}, ${m[1]}`;
}

type HighlightEntry = { item: HighlightNewsItem; sortKey: string; sortId: number };

function mergeAndPickTopNews(
  pressRows: PressRow[],
  blogRows: BlogRow[],
  articlesRows: ArticlesRow[],
): HighlightNewsItem[] {
  const entries: HighlightEntry[] = [];

  for (const row of pressRows) {
    const card = toPressCard(row);
    entries.push({
      sortKey: card.rawDate,
      sortId: card.id,
      item: {
        id: `press-${card.id}`,
        href: pressDetailHref(card.id, card.slug),
        image: card.imageSrc,
        imageAlt: card.title,
        tag: "Press",
        title: card.title,
        date: formatNewsDate(card.date),
      },
    });
  }

  const emptyCategoryMap = new Map<string, string>();
  for (const row of blogRows) {
    const card = toBlogCard(row, emptyCategoryMap);
    entries.push({
      sortKey: card.rawDate,
      sortId: card.id,
      item: {
        id: `blog-${card.id}`,
        href: blogDetailHref(card.id, card.slug),
        image: card.imageSrc,
        imageAlt: card.title,
        tag: "Blog",
        title: card.title,
        date: formatNewsDate(card.date),
      },
    });
  }

  for (const row of articlesRows) {
    const card = toArticlesCard(row);
    entries.push({
      sortKey: card.rawDate,
      sortId: card.id,
      item: {
        id: `articles-${card.id}`,
        href: articlesDetailHref(card.id, card.slug),
        image: card.imageSrc,
        imageAlt: card.title,
        tag: "Articles",
        title: card.title,
        date: formatNewsDate(card.date),
      },
    });
  }

  return entries
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey) || b.sortId - a.sortId)
    .slice(0, HIGHLIGHT_LIMIT)
    .map((entry) => entry.item);
}

async function fetchHighlightNews(
  market?: string,
): Promise<HighlightNewsItem[]> {
  try {
    const marketWhere: Record<string, string> = market
      ? { has_markets_markets: market }
      : {};
    const [pressRes, blogRes, articlesRes] = await Promise.all([
      fetchData({
        slug: "press-data",
        page: 0,
        size: PRESS_LIST_SIZE,
        where: { ...PRESS_STATUS_WHERE, ...marketWhere },
        리턴함수: (rows) => rows,
      }),
      fetchData({
        slug: "blog-data",
        page: 0,
        size: BLOG_LIST_SIZE,
        where: { ...BLOG_STATUS_WHERE, ...marketWhere },
        리턴함수: (rows) => rows,
      }),
      fetchData({
        slug: "articles-data",
        page: 0,
        size: ARTICLES_LIST_SIZE,
        where: { ...ARTICLES_STATUS_WHERE, ...marketWhere },
        리턴함수: (rows) => rows,
      }),
    ]);
    return mergeAndPickTopNews(pressRes.content, blogRes.content, articlesRes.content);
  } catch {
    return [];
  }
}

export async function fetchMainHighlightNews(): Promise<HighlightNewsItem[]> {
  return fetchHighlightNews();
}

export async function fetchMarketHighlightNews(
  marketCode: string,
): Promise<HighlightNewsItem[]> {
  return fetchHighlightNews(marketCode);
}


interface ProductInsightRow {
  id: number;
  dataSlug: string;
  title: string;
  publishDttm: string;
  image: string | null;
  slug: string | null;
}

function resolveInsightMeta(slug: string) {
  switch (slug) {
    case "press-data":
      return { tag: "Press", href: pressDetailHref, img: pressImageSrc };
    case "blog-data":
      return { tag: "Blog", href: blogDetailHref, img: blogImageSrc };
    case "articles-data":
      return { tag: "Articles", href: articlesDetailHref, img: articlesImageSrc };
    default:
      return null;
  }
}

function toHighlightNewsItems(rows: ProductInsightRow[]): HighlightNewsItem[] {
  return rows
    .map((row): HighlightNewsItem | null => {
      const meta = resolveInsightMeta(row.dataSlug);
      if (!meta) return null;
      let imageSrc: string | null = null;
      try {
        const arr = row.image ? JSON.parse(row.image) : null;
        const mediaId =
          Array.isArray(arr) && arr.length > 0 ? Number(arr[0]) : null;
        imageSrc = mediaId != null && !Number.isNaN(mediaId) ? meta.img(mediaId) : null;
      } catch {
        imageSrc = null;
      }
      return {
        id: `${meta.tag.toLowerCase()}-${row.id}`,
        href: meta.href(row.id, row.slug),
        image: imageSrc,
        imageAlt: row.title,
        tag: meta.tag,
        title: row.title,
        date: formatNewsDate(row.publishDttm),
      };
    })
    .filter((item): item is HighlightNewsItem => item !== null);
}

async function fetchInsights(endpoint: string): Promise<HighlightNewsItem[]> {
  try {
    return toHighlightNewsItems(await fetchApi<ProductInsightRow[]>(endpoint));
  } catch {
    return [];
  }
}

export async function fetchProductInsights(
  productId: number,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(`/api/v1/fo/products/${productId}/insights`);
}

export async function fetchCategoryInsights(
  categoryId: number,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(`/api/v1/fo/categories/${categoryId}/insights`);
}

export async function fetchCategoryInsightsLv2(
  categoryId: number,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(`/api/v1/fo/categories/${categoryId}/lv2-insights`);
}
