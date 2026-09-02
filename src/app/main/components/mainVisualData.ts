import { cache } from "react";
import { fetchApi } from "@/lib/api";
import { pickField } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";
import { getPreviewBannerId, getPreviewToken } from "@/lib/previewMode";

const BANNER_SLUG = "banner-data";
const BANNER_POSITION_HERO = "HERO";
const BANNER_POSITION_INFORMATION = "INFORMATION";
const MAX_HERO_BANNERS = 3;

export interface HeroItem {
  id: number;
  sub: string;
  titleText: string;
  btnUrl: string;
  btnText: string;
  orderNo: string;
  mediaId: number | null;
  mediaMimeType: string | null;
  updatedAt: string | null;
}

interface PageFileMeta {
  id: number;
  mimeType: string | null;
}

async function fetchMediaMimeTypeMap(
  mediaIds: number[],
): Promise<Map<number, string | null>> {
  if (mediaIds.length === 0) return new Map();
  try {
    const metas = await fetchApi<PageFileMeta[]>(
      `/api/v1/fo/page-files/meta?ids=${mediaIds.join(",")}`,
    );
    return new Map((metas ?? []).map((meta) => [meta.id, meta.mimeType]));
  } catch {
    return new Map();
  }
}

function orderNoValue(orderNo: string): number {
  if (orderNo === "") return Number.POSITIVE_INFINITY;
  const n = Number(orderNo);
  return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

export async function fetchHeroItems(): Promise<HeroItem[]> {
  const res = await fetchData<Record<string, unknown>>({
    slug: "hero-data",
    sort: "hero.sort_order,asc",
    size: 100,
    datetimeRange: true,
  });

  const rows = (res.content ?? []).map((row) => {
    const contentArr = row.content;
    const mediaId =
      Array.isArray(contentArr) && contentArr.length > 0
        ? (contentArr[0] as number)
        : null;
    return { row, mediaId };
  });

  const mediaIds = Array.from(
    new Set(
      rows
        .map(({ mediaId }) => mediaId)
        .filter((mediaId): mediaId is number => mediaId != null),
    ),
  );

  const mimeTypeMap = await fetchMediaMimeTypeMap(mediaIds);

  const items: HeroItem[] = rows.map(({ row, mediaId }) => ({
    id: row._id as number,
    sub: (pickField(row, "sub_title", "sub") as string) ?? "",
    titleText: (pickField(row, "hero_title", "titleText") as string) ?? "",
    btnUrl: (pickField(row, "button_url", "btnUrl") as string) ?? "",
    btnText: (pickField(row, "button_text", "btnText") as string) ?? "",
    orderNo: (pickField(row, "sort_order", "orderNo") as string) ?? "",
    mediaId,
    mediaMimeType:
      mediaId != null ? (mimeTypeMap.get(mediaId) ?? null) : null,
    updatedAt: (row.updatedAt as string) ?? null,
  }));

  items.sort((a, b) => {
    const av = orderNoValue(a.orderNo);
    const bv = orderNoValue(b.orderNo);
    if (av !== bv) return av - bv;
    const at = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bt - at;
  });

  return items;
}

export interface BannerItem {
  id: number;
  url: string;
  mainTitle: string;
  subTitle: string;
  sortOrder: string;
  mediaId: number | null;
  updatedAt: string | null;
}

function sortOrderValue(sortOrder: string): number {
  if (sortOrder === "") return Number.POSITIVE_INFINITY;
  const n = Number(sortOrder);
  return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

function updatedAtValue(updatedAt: string | null): number {
  if (!updatedAt) return 0;
  const t = new Date(updatedAt).getTime();
  return Number.isNaN(t) ? 0 : t;
}


const fetchPreviewBannerRow = cache(
  async (): Promise<Record<string, unknown> | null> => {
    const recordId = await getPreviewBannerId();
    if (!recordId) return null;
    const previewToken = await getPreviewToken(BANNER_SLUG, recordId);
    return fetchData<Record<string, unknown>>({
      slug: BANNER_SLUG,
      id: recordId,
      where: previewToken ? { previewToken } : undefined,
    });
  },
);

function isPreviewRowForPosition(
  row: Record<string, unknown> | null,
  position: string,
): row is Record<string, unknown> {
  if (!row) return false;
  const rowPosition =
    (pickField(row, "banner_position", "bannerPosition") as string) ?? "";
  return rowPosition === position;
}

function mapBannerRow(row: Record<string, unknown>): BannerItem {
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0
      ? (imageArr[0] as number)
      : null;
  return {
    id: row._id as number,
    url: (pickField(row, "url_hero") as string) ?? "",
    mainTitle: (pickField(row, "banner_title", "mainTitle") as string) ?? "",
    subTitle: (pickField(row, "sub_title", "subTitle") as string) ?? "",
    sortOrder: (pickField(row, "sort_order", "sortOrder") as string) ?? "",
    mediaId,
    updatedAt: (row.updatedAt as string) ?? null,
  };
}

export async function fetchBannerItems(): Promise<BannerItem[]> {
  const [res, previewRow] = await Promise.all([
    fetchData<Record<string, unknown>>({
      slug: BANNER_SLUG,
      where: {
        eq_banner_position: BANNER_POSITION_HERO,
      },
      sort: "banner.sort_order,asc",
      size: 100,
      datetimeRange: true,
    }),
    fetchPreviewBannerRow(),
  ]);

  const items: BannerItem[] = (res.content ?? []).map(mapBannerRow);

  items.sort((a, b) => {
    const av = sortOrderValue(a.sortOrder);
    const bv = sortOrderValue(b.sortOrder);
    if (av !== bv) return av - bv;
    const at = updatedAtValue(a.updatedAt);
    const bt = updatedAtValue(b.updatedAt);
    if (at !== bt) return bt - at;
    return a.id - b.id;
  });

  const limited = items.slice(0, MAX_HERO_BANNERS);

  if (isPreviewRowForPosition(previewRow, BANNER_POSITION_HERO)) {
    const previewId = previewRow._id as number;
    if (!limited.some((item) => item.id === previewId)) {
      limited.push(
        items.find((item) => item.id === previewId) ?? mapBannerRow(previewRow),
      );
    }
  }

  return limited;
}

interface CodeItem {
  code: string;
  name: string;
}

export interface NoticeItem {
  prefixLabel: string;
  bottomText: string;
  url: string;
}

export async function fetchNoticeItem(): Promise<NoticeItem | null> {
  const [bannerRes, codes, previewRow] = await Promise.all([
    fetchData<Record<string, unknown>>({
      slug: BANNER_SLUG,
      where: {
        eq_banner_position: BANNER_POSITION_INFORMATION,
      },
      sort: "banner.post_period_from,desc",
      size: 1,
      datetimeRange: true,
    }),
    fetchApi<CodeItem[]>("/api/v1/fo/codes/BANNER_PREFIX"),
    fetchPreviewBannerRow(),
  ]);

  const row = isPreviewRowForPosition(previewRow, BANNER_POSITION_INFORMATION)
    ? previewRow
    : bannerRes.content?.[0];
  if (!row) return null;

  const prefixCode = (pickField(row, "prefix") as string) ?? "";

  const codeMap = new Map<string, string>(
    (codes ?? []).map((c) => [c.code, c.name]),
  );
  const prefixLabel = codeMap.get(prefixCode) ?? prefixCode;

  return {
    prefixLabel,
    bottomText: (pickField(row, "banner_text", "bottomText") as string) ?? "",
    url: (pickField(row, "url_information") as string) ?? "",
  };
}
