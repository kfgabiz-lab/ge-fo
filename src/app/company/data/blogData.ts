import { fetchApi } from "@/lib/api";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";

export const BLOG_LIST_SIZE = 10;

export const blogImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

export const blogDetailHref = (id: number, slug?: string | null) =>
  `/company/blog/${slug || id}`;

export type BlogRow = PageDataItem;

export interface CodeItem {
  code: string;
  name: string;
}

export interface BlogCardItem {
  id: number;
  slug: string | null;
  categoryCode: string;
  categoryLabel: string;
  title: string;
  description: string;
  date: string;
  rawDate: string;
  imageSrc: string | null;
  tags: string[];
}

export function splitHashtag(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toCategoryMap(codes: CodeItem[]): Map<string, string> {
  return new Map((codes ?? []).map((c) => [c.code, c.name]));
}

export function toBlogCard(
  item: BlogRow,
  categoryMap: Map<string, string>,
): BlogCardItem {
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const code = (row.category as string) ?? "";
  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  return {
    id: item.id,
    slug: (row["seo.slug"] as string) || null,
    categoryCode: code,
    categoryLabel: categoryMap.get(code) ?? code,
    title: (row.title as string) ?? "",
    description: stripHtmlText(row.content as string | undefined, LIST_DESCRIPTION_MAX_LENGTH),
    date: formatDisplayDate(publishDttm),
    rawDate: publishDttm,
    imageSrc: mediaId != null ? blogImageSrc(mediaId) : null,
    tags: splitHashtag(row.hashtag as string | undefined),
  };
}

/** 게시상태는 bo-api가 blog-data에 대해 서버측에서 항상 강제한다 — 클라이언트가 조건을 보낼 필요 없음 */
export const BLOG_STATUS_WHERE: Record<string, string> = {};

export async function fetchBlogCategories(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/BLOGCATEGORY");
}
