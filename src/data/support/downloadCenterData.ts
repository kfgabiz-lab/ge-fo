import { fetchApi, fetchApiText } from "@/lib/api";
import {
  fetchTopCategories,
  fetchCategoryChildrenBatch,
} from "@/app/()/products-systems/data/productsSystemsData";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";

export interface DownloadCenterFile {
  fileId: number | null;
  fileName: string | null;
  fileExt: string | null;
  fileSize: number | null;
  fileSizeText: string | null;
  sourceSystem: string | null;
  filePath: string | null;
  sourceFilePath: string | null;
}

export interface DownloadCenterVersion {
  versionId: number;
  versionName: string | null;
  sortKey: number;
  files: DownloadCenterFile[];
}

export interface DownloadCenterItem {
  id: number;
  docType: string | null;
  docTypeLabel: string | null;
  title: string | null;
  date: string | null;
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  versions: DownloadCenterVersion[];
}

export interface DownloadCenterContentsPage {
  content: DownloadCenterItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export type DownloadCenterSort =
  | ""
  | "doctype"
  | "newest"
  | "oldest"
  | "title"
  | "title_desc";

export interface DownloadCenterContentsParams {
  q?: string;
  categories?: string[];
  parentCategories?: string[];
  docTypes?: string[];
  productCodes?: string[];
  sort?: DownloadCenterSort;
  page?: number;
  size?: number;
}

export async function fetchDownloadCenterContents(
  params: DownloadCenterContentsParams,
): Promise<DownloadCenterContentsPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const sp = new URLSearchParams();
  if (params.q && params.q.trim()) sp.set("q", params.q.trim());
  if (params.categories && params.categories.length > 0) {
    sp.set("categories", params.categories.join(","));
  }
  if (params.parentCategories && params.parentCategories.length > 0) {
    sp.set("parentCategories", params.parentCategories.join(","));
  }
  if (params.docTypes && params.docTypes.length > 0) {
    sp.set("docTypes", params.docTypes.join(","));
  }
  if (params.productCodes && params.productCodes.length > 0) {
    sp.set("productCodes", params.productCodes.join(","));
  }
  if (params.sort) sp.set("sort", params.sort);
  sp.set("page", String(page));
  sp.set("size", String(size));
  try {
    return await fetchApi<DownloadCenterContentsPage>(
      `/api/v1/fo/download-center/contents?${sp.toString()}`,
    );
  } catch {
    return { content: [], totalElements: 0, totalPages: 0, page, size };
  }
}

export interface DownloadCenterContentsByKeywordParams {
  keyword?: string;
  categories?: string[];
  parentCategories?: string[];
  docTypes?: string[];
  productCodes?: string[];
  page?: number;
  size?: number;
}

export async function fetchDownloadCenterContentsByKeyword(
  params: DownloadCenterContentsByKeywordParams,
): Promise<DownloadCenterContentsPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const sp = new URLSearchParams();
  if (params.keyword && params.keyword.trim()) {
    sp.set("keyword", params.keyword.trim());
  }
  if (params.categories && params.categories.length > 0) {
    sp.set("categories", params.categories.join(","));
  }
  if (params.parentCategories && params.parentCategories.length > 0) {
    sp.set("parentCategories", params.parentCategories.join(","));
  }
  if (params.docTypes && params.docTypes.length > 0) {
    sp.set("docTypes", params.docTypes.join(","));
  }
  if (params.productCodes && params.productCodes.length > 0) {
    sp.set("productCodes", params.productCodes.join(","));
  }
  sp.set("page", String(page));
  sp.set("size", String(size));
  try {
    return await fetchApi<DownloadCenterContentsPage>(
      `/api/v1/fo/download-center/keyword-contents?${sp.toString()}`,
    );
  } catch {
    return { content: [], totalElements: 0, totalPages: 0, page, size };
  }
}

export interface DownloadCenterCategoryCount {
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  count: number;
}

export async function fetchDownloadCenterCategoryCounts(): Promise<
  DownloadCenterCategoryCount[]
> {
  try {
    return await fetchApi<DownloadCenterCategoryCount[]>(
      `/api/v1/fo/download-center/category-counts`,
    );
  } catch {
    return [];
  }
}

export interface DownloadCenterDocTypeCount {
  docType: string;
  docTypeLabel: string;
  count: number;
}

export async function fetchDownloadCenterDocTypeCounts(
  productCodes?: string[],
): Promise<DownloadCenterDocTypeCount[]> {
  const sp = new URLSearchParams();
  if (productCodes && productCodes.length > 0) {
    sp.set("productCodes", productCodes.join(","));
  }
  const queryString = sp.toString();
  try {
    return await fetchApi<DownloadCenterDocTypeCount[]>(
      `/api/v1/fo/download-center/doctype-counts${
        queryString ? `?${queryString}` : ""
      }`,
    );
  } catch {
    return [];
  }
}

export interface DownloadDocTypeCode {
  code: string;
  name: string;
}

export async function fetchDownloadDocTypes(): Promise<DownloadFilterOption[]> {
  try {
    const codes = await fetchApi<DownloadDocTypeCode[]>(
      `/api/v1/fo/codes/DOC_TYPE`,
    );
    return (codes ?? []).map((item) => ({ id: item.code, label: item.name }));
  } catch {
    return [];
  }
}

export async function fetchDownloadDocTypeFilters(options?: {
  productCodes?: string[];
  fallbackCount?: number;
}): Promise<DownloadFilterOption[]> {
  const [docTypes, counts] = await Promise.all([
    fetchDownloadDocTypes(),
    fetchDownloadCenterDocTypeCounts(options?.productCodes),
  ]);
  const countMap = new Map(counts.map((c) => [c.docType, c.count]));
  return docTypes.map((docType) => ({
    ...docType,
    count: countMap.get(docType.id) ?? options?.fallbackCount,
  }));
}

export async function fetchDownloadCenterCategoryTree(): Promise<
  DownloadCategoryOption[]
> {
  try {
    const [tops, counts] = await Promise.all([
      fetchTopCategories(),
      fetchDownloadCenterCategoryCounts(),
    ]);
    const countMap = new Map(
      counts
        .filter((c) => c.categoryL2Id)
        .map((c) => [c.categoryL2Id as string, c.count]),
    );
    const parentOnlyCountMap = new Map(
      counts
        .filter((c) => !c.categoryL2Id && c.categoryL1Id)
        .map((c) => [c.categoryL1Id as string, c.count]),
    );

    const childrenByParentId = await fetchCategoryChildrenBatch(
      tops.map((top) => top.id),
    );

    const options = tops.map((top) => {
      const children = childrenByParentId.get(top.id) ?? [];
      const nested = children.map((child) => ({
        id: child.code,
        label: child.title,
        count: countMap.get(child.code) ?? 0,
      }));
      const total =
        nested.reduce((sum, n) => sum + (n.count ?? 0), 0) +
        (parentOnlyCountMap.get(top.code) ?? 0);
      return {
        id: top.code,
        label: top.title,
        hasArrow: nested.length > 0,
        count: total,
        nested,
      } satisfies DownloadCategoryOption;
    });
    return options;
  } catch {
    return [];
  }
}

export async function fetchDownloadCenterFileUrl(
  filePath: string | null | undefined,
): Promise<string> {
  if (!filePath) return "";
  try {
    const text = await fetchApiText(
      `/api/v1/fo/ctpApi/fileDownUrl?filePath=${encodeURIComponent(filePath)}`,
    );
    return text.replace(/^"|"$/g, "").trim();
  } catch {
    return "";
  }
}
