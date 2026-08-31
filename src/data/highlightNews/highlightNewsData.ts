import type { HighlightNewsItem } from "@/types/highlightNews";
import { fetchApi } from "@/lib/api";
import {
  pressDetailHref,
  pressImageSrc,
} from "@/app/company/data/pressData";
import {
  blogDetailHref,
  blogImageSrc,
} from "@/app/company/data/blogData";
import {
  articlesDetailHref,
  articlesImageSrc,
} from "@/app/company/data/articlesData";

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

async function fetchHighlightNews(
  market?: string,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(
    market
      ? `/api/v1/fo/highlight-news?market=${market}`
      : "/api/v1/fo/highlight-news",
  );
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
