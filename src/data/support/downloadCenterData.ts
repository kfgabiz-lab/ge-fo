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

export function hasSelectableVersions(item: DownloadCenterItem): boolean {
  const sourceSystem = item.versions[0]?.files[0]?.sourceSystem ?? null;
  if (sourceSystem !== "SSQ") return false;
  return item.versions.some((v) => v.versionName != null && v.versionName.trim() !== "");
}

export type DownloadCenterSort =
  | ""
  | "relevance"
  | "doctype"
  | "newest"
  | "title"
  | "title_desc";

export interface DownloadCenterFilterParams {
  q?: string;
  categories?: string[];
  parentCategories?: string[];
  docTypes?: string[];
  productCodes?: string[];
  includeFileContent?: boolean;
}

export interface DownloadCenterContentsParams extends DownloadCenterFilterParams {
  sort?: DownloadCenterSort;
  page?: number;
  size?: number;
}

function buildDownloadCenterFilterQuery(
  params: DownloadCenterFilterParams,
): URLSearchParams {
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
  if (params.includeFileContent) sp.set("includeFileContent", "true");
  return sp;
}

export async function fetchDownloadCenterContents(
  params: DownloadCenterContentsParams,
): Promise<DownloadCenterContentsPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const sp = buildDownloadCenterFilterQuery(params);
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

export interface DownloadCenterKeywordResult {
  total: number;
  items: DownloadCenterItem[];
}

export async function fetchDownloadCenterContentsByKeyword(
  keyword: string,
  query = "",
): Promise<DownloadCenterKeywordResult> {
  const kw = keyword.trim();
  const q = query.trim();
  if (!kw && !q) return { total: 0, items: [] };
  const sp = new URLSearchParams();
  if (kw) sp.set("keyword", kw);
  if (q) sp.set("q", q);
  try {
    return await fetchApi<DownloadCenterKeywordResult>(
      `/api/v1/fo/download-center/keyword-contents?${sp.toString()}`,
    );
  } catch {
    return { total: 0, items: [] };
  }
}

export interface DownloadCenterCategoryCount {
  categoryL1Id: string | null;
  categoryL2Id: string | null;
  count: number;
}

export interface DownloadCenterL1CategoryCount {
  categoryL1Id: string | null;
  count: number;
}

export interface DownloadCenterCategoryCounts {
  l1Counts: DownloadCenterL1CategoryCount[];
  l2Counts: DownloadCenterCategoryCount[];
}

const EMPTY_CATEGORY_COUNTS: DownloadCenterCategoryCounts = {
  l1Counts: [],
  l2Counts: [],
};

export interface DownloadCenterCategoryCountMaps {
  l1CountMap: Map<string, number>;
  l2CountMap: Map<string, number>;
}

export function deriveCategoryCountsFromItems(
  items: DownloadCenterItem[],
): DownloadCenterCategoryCounts {
  const l1Counts = new Map<string, number>();
  const l2Counts = new Map<string, { categoryL1Id: string | null; count: number }>();

  for (const item of items) {
    const l1Id = item.categoryL1Id;
    if (l1Id) {
      l1Counts.set(l1Id, (l1Counts.get(l1Id) ?? 0) + 1);
    }
    const l2Id = item.categoryL2Id;
    if (l2Id) {
      const prev = l2Counts.get(l2Id);
      l2Counts.set(l2Id, {
        categoryL1Id: prev?.categoryL1Id ?? l1Id ?? null,
        count: (prev?.count ?? 0) + 1,
      });
    }
  }

  return {
    l1Counts: [...l1Counts].map(([categoryL1Id, count]) => ({ categoryL1Id, count })),
    l2Counts: [...l2Counts].map(([categoryL2Id, entry]) => ({
      categoryL1Id: entry.categoryL1Id,
      categoryL2Id,
      count: entry.count,
    })),
  };
}

export function toCategoryCountMaps(
  counts: DownloadCenterCategoryCounts,
): DownloadCenterCategoryCountMaps {
  return {
    l1CountMap: new Map(
      counts.l1Counts
        .filter((c) => c.categoryL1Id)
        .map((c) => [c.categoryL1Id as string, c.count]),
    ),
    l2CountMap: new Map(
      counts.l2Counts
        .filter((c) => c.categoryL2Id)
        .map((c) => [c.categoryL2Id as string, c.count]),
    ),
  };
}

export function applyCategoryCounts(
  baseTree: DownloadCategoryOption[],
  l1CountMap: Map<string, number>,
  l2CountMap: Map<string, number>,
): DownloadCategoryOption[] {
  return baseTree.map((top) => {
    const nested = (top.nested ?? []).map((child) => ({
      ...child,
      count: l2CountMap.get(child.id) ?? 0,
    }));
    return {
      ...top,
      count: l1CountMap.get(top.id) ?? 0,
      nested,
    } satisfies DownloadCategoryOption;
  });
}

export async function fetchDownloadCenterCategoryCounts(
  params: DownloadCenterFilterParams = {},
): Promise<DownloadCenterCategoryCounts> {
  const queryString = buildDownloadCenterFilterQuery(params).toString();
  try {
    const res = await fetchApi<DownloadCenterCategoryCounts>(
      `/api/v1/fo/download-center/category-counts${
        queryString ? `?${queryString}` : ""
      }`,
    );
    return {
      l1Counts: res?.l1Counts ?? [],
      l2Counts: res?.l2Counts ?? [],
    };
  } catch {
    return EMPTY_CATEGORY_COUNTS;
  }
}

export interface DownloadCenterDocTypeCount {
  docType: string;
  docTypeLabel: string;
  count: number;
}

export function deriveDocTypeCountsFromItems(
  items: DownloadCenterItem[],
): DownloadCenterDocTypeCount[] {
  const counts = new Map<string, { docTypeLabel: string; count: number }>();
  for (const item of items) {
    const docType = item.docType;
    if (!docType) continue;
    const prev = counts.get(docType);
    counts.set(docType, {
      docTypeLabel: prev?.docTypeLabel ?? item.docTypeLabel ?? docType,
      count: (prev?.count ?? 0) + 1,
    });
  }
  return [...counts].map(([docType, entry]) => ({
    docType,
    docTypeLabel: entry.docTypeLabel,
    count: entry.count,
  }));
}

export function toDocTypeCountMap(
  counts: DownloadCenterDocTypeCount[],
): Map<string, number> {
  return new Map(counts.map((c) => [c.docType, c.count]));
}

export function buildDocTypeFilters(
  docTypeCodes: DownloadFilterOption[],
  countMap: Map<string, number>,
  fallbackCount?: number,
): DownloadFilterOption[] {
  return docTypeCodes.map((docType) => ({
    ...docType,
    count: countMap.get(docType.id) ?? fallbackCount,
  }));
}

export async function fetchDownloadCenterDocTypeCounts(
  params: DownloadCenterFilterParams = {},
): Promise<DownloadCenterDocTypeCount[]> {
  const queryString = buildDownloadCenterFilterQuery(params).toString();
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

export type DownloadDocTypeFilterOptions = DownloadCenterFilterParams & {
  fallbackCount?: number;
};

export async function fetchDownloadDocTypeFilters(
  options: DownloadDocTypeFilterOptions = {},
): Promise<DownloadFilterOption[]> {
  const { fallbackCount, ...filterParams } = options;
  const [docTypes, counts] = await Promise.all([
    fetchDownloadDocTypes(),
    fetchDownloadCenterDocTypeCounts(filterParams),
  ]);
  return buildDocTypeFilters(docTypes, toDocTypeCountMap(counts), fallbackCount);
}

export async function fetchDownloadCenterBaseCategoryTree(): Promise<
  DownloadCategoryOption[]
> {
  try {
    const tops = await fetchTopCategories();
    const childrenByParentId = await fetchCategoryChildrenBatch(
      tops.map((top) => top.id),
    );
    return tops.map((top) => {
      const children = childrenByParentId.get(top.id) ?? [];
      const nested = children.map((child) => ({
        id: child.code,
        label: child.title,
      }));
      return {
        id: top.code,
        label: top.title,
        hasArrow: nested.length > 0,
        nested,
      } satisfies DownloadCategoryOption;
    });
  } catch {
    return [];
  }
}

export async function fetchDownloadCenterCategoryTree(
  params: DownloadCenterFilterParams = {},
): Promise<DownloadCategoryOption[]> {
  const [baseTree, counts] = await Promise.all([
    fetchDownloadCenterBaseCategoryTree(),
    fetchDownloadCenterCategoryCounts(params),
  ]);
  const { l1CountMap, l2CountMap } = toCategoryCountMaps(counts);
  return applyCategoryCounts(baseTree, l1CountMap, l2CountMap);
}

export async function fetchDownloadCenterFileUrl(
  filePath: string | null | undefined,
): Promise<string> {
  if (!filePath) return "";
  const text = await fetchApiText(
    `/api/v1/fo/ctpApi/fileDownUrl?filePath=${encodeURIComponent(filePath)}`,
  );
  return text.replace(/^"|"$/g, "").trim();
}
