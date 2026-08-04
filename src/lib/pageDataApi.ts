import { fetchApi } from "@/lib/api";
import { commonData, commonEachData, type PageDataItem } from "@/lib/pageData";
import { notFound } from "next/navigation";


export interface AdjacentNeighbor {
  id: number;
  title: string;
}

export interface AdjacentResult {
  prev: AdjacentNeighbor | null;
  next: AdjacentNeighbor | null;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

interface RawPageResponse {
  content: PageDataItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}


interface FetchDataCommonParams {
  slug: string;
  where?: Record<string, string>;
}

interface FetchDataAdjacentParams extends FetchDataCommonParams {
  id: string | number;
  adjacent: true;
  sortField?: string;
  titleField?: string;
}

interface FetchDataDetailParams<T> extends FetchDataCommonParams {
  id: string | number;
  adjacent?: false;
  리턴함수?: (raw: PageDataItem) => T;
}

interface FetchDataListParams<T> extends FetchDataCommonParams {
  id?: undefined;
  adjacent?: false;
  page?: number;
  size?: number;
  unpaged?: boolean;
  sort?: string;
  리턴함수?: (rows: PageDataItem[]) => T[];
  datetimeRange?: boolean;
}


export function fetchData(params: FetchDataAdjacentParams): Promise<AdjacentResult>;
export function fetchData<T = Record<string, unknown>>(
  params: FetchDataDetailParams<T>,
): Promise<T | null>;
export function fetchData<T = Record<string, unknown>>(
  params: FetchDataListParams<T>,
): Promise<PageResult<T>>;

export async function fetchData(params: {
  slug: string;
  id?: string | number;
  adjacent?: boolean;
  page?: number;
  size?: number;
  unpaged?: boolean;
  where?: Record<string, string>;
  sort?: string;
  sortField?: string;
  titleField?: string;
  리턴함수?:
    | ((raw: PageDataItem) => unknown)
    | ((rows: PageDataItem[]) => unknown[]);
  datetimeRange?: boolean;
}): Promise<unknown> {
  const {
    slug,
    id,
    adjacent,
    page,
    size,
    unpaged,
    where,
    sort,
    sortField,
    titleField,
    리턴함수,
    datetimeRange,
  } = params;
  const sp = new URLSearchParams();

  const appendWhere = () => {
    if (!where) return;
    for (const [k, v] of Object.entries(where)) {
      sp.set(k, v);
    }
  };

  if (id != null && adjacent) {
    if (sortField) sp.set("sortField", sortField);
    if (titleField) sp.set("titleField", titleField);
    appendWhere();
    try {
      return await fetchApi<AdjacentResult>(
        `/api/v1/fo/page-data/${slug}/${id}/adjacent?${sp.toString()}`,
      );
    } catch (e) {
      if (e instanceof Error && e.message.includes("실패: 404")) {
        return { prev: null, next: null };
      }
      throw e;
    }
  }

  if (id != null) {
    appendWhere();
    try {
      const raw = await fetchApi<PageDataItem>(
        `/api/v1/fo/page-data/${slug}/${id}?${sp.toString()}`,
      );
      return 리턴함수
        ? (리턴함수 as (raw: PageDataItem) => unknown)(raw)
        : commonData(raw);
    } catch (e) {
      if (e instanceof Error && e.message.includes("실패: 404")) notFound()
      // if (e instanceof Error && e.message.includes("실패: 404")) return null;
      throw e;
    }
  }

  if (page != null) sp.set("page", String(page));
  if (size != null) sp.set("size", String(size));
  if (unpaged != null) sp.set("unpaged", String(unpaged));
  appendWhere();
  if (sort) sp.set("sort", sort);

  const res = await fetchApi<RawPageResponse>(
    `/api/v1/fo/page-data/${slug}${datetimeRange ? "/datetime-range" : ""}?${sp.toString()}`,
  );
  const rawContent = res.content ?? [];
  const content = 리턴함수
    ? (리턴함수 as (rows: PageDataItem[]) => unknown[])(rawContent)
    : commonEachData(rawContent);
  return {
    content,
    totalElements: res.totalElements,
    totalPages: res.totalPages,
    page: res.page,
    size: res.size,
  };
}


export async function incrementViewCount(
  slug: string,
  id: string | number,
): Promise<void> {
  try {
    await fetchApi<void>(`/api/v1/fo/page-data/${slug}/${id}/view-count`, {
      method: "POST",
    });
  } catch {
  }
}
