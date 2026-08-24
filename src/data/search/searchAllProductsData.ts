import { fetchApi } from "@/lib/api";
import { fetchDevicesTreeRows, type DevicesTreeRow } from "@/data/gnb/devicesTree";
import { contentDetailPath } from "@/lib/contentDetailPath";
import type { SearchProductItem } from "@/data/search/searchAllContent";
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";

interface ProductSearchApiItem {
  id: number;
  productName: string | null;
  productDescription: string | null;
  image: string | null;
  slug: string | null;
  category: string | null;
  highlight: string | null;
}

interface ProductSearchApiResponse {
  total: number;
  items: ProductSearchApiItem[];
}

export interface SearchAllProductsResult {
  total: number;
  items: SearchProductItem[];
}

export interface SearchProductsQueryOptions {
  categories?: string[];
  offset?: number;
  limit?: number;
}

export async function fetchSearchAllProducts(
  query: string,
  options: SearchProductsQueryOptions = {},
): Promise<SearchAllProductsResult> {
  const { categories = [], offset = 0, limit = 4 } = options;
  const q = query.trim();
  if (!q && categories.length === 0) return { total: 0, items: [] };

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categories.length > 0) params.set("categories", categories.join(","));
    params.set("offset", String(offset));
    params.set("limit", String(limit));

    const res = await fetchApi<ProductSearchApiResponse>(
      `/api/v1/fo/products/search?${params.toString()}`,
    );

    const apiItems = Array.isArray(res?.items) ? res.items : [];
    const items: SearchProductItem[] = apiItems.map((it) => ({
      id: String(it.id),
      href: it.slug ? contentDetailPath("/product", it.id, it.slug) : "",
      image: it.image ?? "",
      category: it.category ?? "",
      highlight: it.highlight ?? "",
      title: it.productName ?? "",
      description: it.productDescription ?? "",
    }));

    return { total: typeof res?.total === "number" ? res.total : 0, items };
  } catch {
    return { total: 0, items: [] };
  }
}


export interface ProductCategoryCount {
  categoryL2Id: string;
  count: number;
}

export async function fetchProductCategoryCounts(
  query = "",
): Promise<ProductCategoryCount[]> {
  try {
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set("q", q);
    const qs = params.toString();
    return await fetchApi<ProductCategoryCount[]>(
      `/api/v1/fo/products/category-counts${qs ? `?${qs}` : ""}`,
    );
  } catch {
    return [];
  }
}

function buildProductCategoryTree(
  rows: DevicesTreeRow[],
  countMap: Map<string, number>,
): DownloadCategoryOption[] {
  const toSort = (v: string | null) => (v == null ? 0 : Number(v) || 0);

  const lv1Rows = rows
    .filter((r) => r.depth === "1" && r.rowId != null)
    .sort((a, b) => toSort(a.sortOrder) - toSort(b.sortOrder));

  return lv1Rows.map((lv1) => {
    const nested = rows
      .filter(
        (r) =>
          r.depth === "2" &&
          r.rowId != null &&
          r.parentId === String(lv1.rowId),
      )
      .sort((a, b) => toSort(a.sortOrder) - toSort(b.sortOrder))
      .map((lv2) => ({
        id: String(lv2.rowId),
        label: lv2.categoryTitle ?? "",
        count: countMap.get(String(lv2.rowId)) ?? 0,
      }));

    return {
      id: String(lv1.rowId),
      label: lv1.categoryTitle ?? "",
      hasArrow: nested.length > 0,
      count: nested.reduce((sum, n) => sum + (n.count ?? 0), 0),
      nested,
    } satisfies DownloadCategoryOption;
  });
}

export async function fetchSearchProductCategoryTree(
  query = "",
): Promise<DownloadCategoryOption[]> {
  const [rows, counts] = await Promise.all([
    fetchDevicesTreeRows(),
    fetchProductCategoryCounts(query),
  ]);
  const countMap = new Map(counts.map((c) => [c.categoryL2Id, c.count]));
  return buildProductCategoryTree(rows, countMap);
}
