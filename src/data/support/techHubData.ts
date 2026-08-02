import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem } from "@/lib/pageData";
import {
  fetchTopCategories,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
import { getYoutubeIdFromUrl, getYoutubePosterSrc } from "@/lib/youtubeEmbed";
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";

export interface TechHubCard {
  id: number;
  title: string;
  sourceUpdatedAt: string | null;
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  videoUrl: string | null;
  versionCount: number;
}

export interface TechHubContentsPage {
  content: TechHubCard[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface TechHubContentsParams {
  q?: string;
  categories?: string[];
  certs?: string[];
  page?: number;
  size?: number;
}

export async function fetchTechHubContents(
  params: TechHubContentsParams,
): Promise<TechHubContentsPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const sp = new URLSearchParams();
  if (params.q && params.q.trim()) sp.set("q", params.q.trim());
  if (params.categories && params.categories.length > 0) {
    sp.set("categories", params.categories.join(","));
  }
  if (params.certs && params.certs.length > 0) {
    sp.set("certs", params.certs.join(","));
  }
  sp.set("page", String(page));
  sp.set("size", String(size));
  try {
    return await fetchApi<TechHubContentsPage>(
      `/api/v1/fo/tech-hub/contents?${sp.toString()}`,
    );
  } catch {
    return { content: [], totalElements: 0, totalPages: 0, page, size };
  }
}

export interface TechHubChapter {
  versionId: number;
  chapterName: string | null;
  sortKey: number;
  videoUrl: string | null;
}

export interface TechHubDetail {
  id: number;
  title: string;
  sourceUpdatedAt: string | null;
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  versionCount: number;
  chapters: TechHubChapter[];
  relatedVideos: TechHubCard[];
}

export async function fetchTechHubContentDetail(
  masterId: number,
): Promise<TechHubDetail | null> {
  try {
    return await fetchApi<TechHubDetail>(
      `/api/v1/fo/tech-hub/contents/${masterId}`,
    );
  } catch {
    return null;
  }
}

export interface TechHubCategoryCount {
  categoryL2Id: string;
  count: number;
}

export async function fetchTechHubCategoryCounts(): Promise<
  TechHubCategoryCount[]
> {
  try {
    return await fetchApi<TechHubCategoryCount[]>(
      `/api/v1/fo/tech-hub/category-counts`,
    );
  } catch {
    return [];
  }
}

export interface TechHubCertCount {
  certCode: string;
  count: number;
}

export async function fetchTechHubCertCounts(): Promise<TechHubCertCount[]> {
  try {
    return await fetchApi<TechHubCertCount[]>(
      `/api/v1/fo/tech-hub/cert-counts`,
    );
  } catch {
    return [];
  }
}

export async function fetchTechHubCategoryTree(): Promise<
  DownloadCategoryOption[]
> {
  try {
    const [tops, counts] = await Promise.all([
      fetchTopCategories(),
      fetchTechHubCategoryCounts(),
    ]);
    const countMap = new Map(counts.map((c) => [c.categoryL2Id, c.count]));

    const options = await Promise.all(
      tops.map(async (top) => {
        const children = await fetchCategoryChildren(top.id);
        const nested = children.map((child) => ({
          id: child.code,
          label: child.title,
          count: countMap.get(child.code) ?? 0,
        }));
        const total = nested.reduce((sum, n) => sum + (n.count ?? 0), 0);
        return {
          id: top.code,
          label: top.title,
          hasArrow: nested.length > 0,
          count: total,
          nested,
        } satisfies DownloadCategoryOption;
      }),
    );
    return options;
  } catch {
    return [];
  }
}

export interface ProductTechHubBanner {
  categoryCodes: string[];
  lv2Name: string;
  totalCount: number;
  latest: TechHubCard;
  posterSrc: string | null;
  href: string;
}

export interface ProductTechHubBannerCopy {
  title?: string;
  description?: string[];
  countText?: string;
}

export function buildHwProductTechHubBannerCopy(
  banner: ProductTechHubBanner,
): ProductTechHubBannerCopy {
  const name = banner.lv2Name.trim();
  if (!name) return {};
  return {
    title: `${name} Video Tutorials`,
    description: [
      "Need help with installation, configuration, troubleshooting, or maintenance?",
      `Watch step-by-step video guides for the ${name} series in our Tech Hub.`,
    ],
    countText: `${banner.totalCount} ${name} Video Tutorials Available`,
  };
}

export function buildSwProductTechHubBannerCopy(
  banner: ProductTechHubBanner,
): ProductTechHubBannerCopy {
  const name = banner.lv2Name.trim();
  return {
    title: "Video Tutorials",
    description: name
      ? [
          `Need installation or support help? Watch video guides for ${name} in our Tech Hub.`,
        ]
      : undefined,
  };
}

export async function fetchProductTechHubBanner(
  productId: number,
  categoryId?: number,
): Promise<ProductTechHubBanner | null> {
  try {
    const treeRows = await fetchDevicesTreeRows();
    const mappedLv2Ids = new Set(
      treeRows
        .filter((r) => r.depth === "3" && r.productId === productId)
        .map((r) => r.parentId)
        .filter((p): p is string => p != null && p !== ""),
    );
    if (mappedLv2Ids.size === 0) return null;

    const currentLv2Id = categoryId != null ? String(categoryId) : "";
    const lv2Ids =
      mappedLv2Ids.size > 1 && currentLv2Id && mappedLv2Ids.has(currentLv2Id)
        ? new Set([currentLv2Id])
        : mappedLv2Ids;

    const categoryRes = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "eq_category.depth": "2" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const lv2ById = new Map<number, { code: string; title: string }>();
    for (const row of categoryRes.content) {
      lv2ById.set(Number(row._id), {
        code: String(row["category.code"] ?? ""),
        title: String(row["category.title"] ?? ""),
      });
    }

    const lv2List: { code: string; title: string }[] = [];
    const seenCodes = new Set<string>();
    for (const id of lv2Ids) {
      const lv2 = lv2ById.get(Number(id));
      if (!lv2 || lv2.code === "" || seenCodes.has(lv2.code)) continue;
      seenCodes.add(lv2.code);
      lv2List.push(lv2);
    }
    const codes = lv2List.map((lv2) => lv2.code);
    if (codes.length === 0) return null;
    const lv2Name = lv2List[0]?.title ?? "";

    const latestPage = await fetchTechHubContents({
      categories: codes,
      page: 0,
      size: 1,
    });
    const latest = latestPage.content[0];
    if (latestPage.totalElements === 0 || !latest) return null;

    const videoId = latest.videoUrl ? getYoutubeIdFromUrl(latest.videoUrl) : "";
    const posterSrc = videoId ? getYoutubePosterSrc(videoId) : null;

    const href = `/support/tech-hub?categories=${codes
      .map((code) => encodeURIComponent(code))
      .join(",")}`;

    return {
      categoryCodes: codes,
      lv2Name,
      totalCount: latestPage.totalElements,
      latest,
      posterSrc,
      href,
    };
  } catch {
    return null;
  }
}
