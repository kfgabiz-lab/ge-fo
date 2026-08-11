import { cache } from "react";
import { fetchApi, SITE_ID } from "@/lib/api";
import { pickField } from "@/lib/pageData";
import { fetchData } from "@/lib/pageDataApi";
import { getPreviewBannerId } from "@/lib/previewMode";

const BANNER_SLUG = "banner-data";
const BANNER_POSITION_HERO = "HERO";
const BANNER_POSITION_INFORMATION = "INFORMATION";

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

const PAGE_FILE_ENDPOINT = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

async function fetchMediaMimeType(mediaId: number): Promise<string | null> {
  const isServer = typeof window === "undefined";
  const base = isServer
    ? process.env.API_PROXY_TARGET || "http://localhost:8080"
    : "";
  try {
    const res = await fetch(`${base}${PAGE_FILE_ENDPOINT(mediaId)}`, {
      method: "HEAD",
      headers: { "X-Site-Id": SITE_ID },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.headers.get("content-type");
  } catch {
    return null;
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
    where: { drs_post_period: "in_range" },
    sort: "hero.sort_order,asc",
    size: 100,
    datetimeRange: true,
  });

  const items: HeroItem[] = await Promise.all(
    (res.content ?? []).map(async (row) => {
      const contentArr = row.content;
      const mediaId =
        Array.isArray(contentArr) && contentArr.length > 0
          ? (contentArr[0] as number)
          : null;
      const mediaMimeType =
        mediaId != null ? await fetchMediaMimeType(mediaId) : null;
      return {
        id: row._id as number,
        sub: (pickField(row, "sub_title", "sub") as string) ?? "",
        titleText: (pickField(row, "hero_title", "titleText") as string) ?? "",
        btnUrl: (pickField(row, "button_url", "btnUrl") as string) ?? "",
        btnText: (pickField(row, "button_text", "btnText") as string) ?? "",
        orderNo: (pickField(row, "sort_order", "orderNo") as string) ?? "",
        mediaId,
        mediaMimeType,
        updatedAt: (row.updatedAt as string) ?? null,
      };
    }),
  );

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
}

function sortOrderValue(sortOrder: string): number {
  if (sortOrder === "") return Number.POSITIVE_INFINITY;
  const n = Number(sortOrder);
  return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
}


const fetchPreviewBannerRow = cache(
  async (): Promise<Record<string, unknown> | null> => {
    const recordId = await getPreviewBannerId();
    if (!recordId) return null;
    return fetchData<Record<string, unknown>>({
      slug: BANNER_SLUG,
      id: recordId,
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

export async function fetchBannerItems(): Promise<BannerItem[]> {
  const [res, previewRow] = await Promise.all([
    fetchData<Record<string, unknown>>({
      slug: BANNER_SLUG,
      where: {
        eq_banner_position: BANNER_POSITION_HERO,
        eq_is_visible: "001",
        drs_post_period: "in_range",
      },
      sort: "banner.sort_order,asc",
      size: 100,
      datetimeRange: true,
    }),
    fetchPreviewBannerRow(),
  ]);

  const rows = [...(res.content ?? [])];
  if (isPreviewRowForPosition(previewRow, BANNER_POSITION_HERO)) {
    const alreadyListed = rows.some((row) => row._id === previewRow._id);
    if (!alreadyListed) rows.push(previewRow);
  }

  const items: BannerItem[] = rows.map((row) => {
    const imageArr = row.image;
    const mediaId =
      Array.isArray(imageArr) && imageArr.length > 0
        ? (imageArr[0] as number)
        : null;
    return {
      id: row._id as number,
      url: (pickField(row, "url") as string) ?? "",
      mainTitle: (pickField(row, "banner_title", "mainTitle") as string) ?? "",
      subTitle: (pickField(row, "sub_title", "subTitle") as string) ?? "",
      sortOrder: (pickField(row, "sort_order", "sortOrder") as string) ?? "",
      mediaId,
    };
  });

  items.sort((a, b) => {
    const av = sortOrderValue(a.sortOrder);
    const bv = sortOrderValue(b.sortOrder);
    if (av !== bv) return av - bv;
    return a.id - b.id;
  });

  return items;
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
        eq_is_visible: "001",
        drs_post_period: "in_range",
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
    url: (pickField(row, "url") as string) ?? "",
  };
}
