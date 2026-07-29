import { fetchApi } from "@/lib/api";
import {
  fetchTopCategories,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
import type { DownloadCenterItem } from "@/data/support/downloadCenterData";

interface DownloadCenterSearchResponse {
  total: number;
  items: DownloadCenterItem[];
}

export interface SearchDocumentItem extends DownloadCenterItem {
  categoryLabel: string;
}

export interface SearchAllDocumentsResult {
  total: number;
  items: SearchDocumentItem[];
}

async function fetchCategoryCodeTitleMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const tops = await fetchTopCategories();
    tops.forEach((top) => {
      if (top.code) map.set(top.code, top.title ?? "");
    });
    const childLists = await Promise.all(
      tops.map((top) => fetchCategoryChildren(top.id)),
    );
    childLists.forEach((children) => {
      children.forEach((child) => {
        if (child.code) map.set(child.code, child.title ?? "");
      });
    });
  } catch {
  }
  return map;
}

function buildCategoryLabel(
  codeTitle: Map<string, string>,
  categoryL1Id: string | null,
  categoryL2Id: string | null,
): string {
  const lv1 = (categoryL1Id && codeTitle.get(categoryL1Id)) || "";
  const lv2 = (categoryL2Id && codeTitle.get(categoryL2Id)) || "";
  return [lv1, lv2].filter(Boolean).join(" > ");
}

export async function fetchSearchAllDocuments(
  query: string,
  limit = 10,
): Promise<SearchAllDocumentsResult> {
  const q = query.trim();
  if (!q) return { total: 0, items: [] };

  try {
    const [res, codeTitle] = await Promise.all([
      fetchApi<DownloadCenterSearchResponse>(
        `/api/v1/fo/download-center/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      ),
      fetchCategoryCodeTitleMap(),
    ]);

    const apiItems = Array.isArray(res?.items) ? res.items : [];
    const items: SearchDocumentItem[] = apiItems.map((it) => ({
      ...it,
      categoryLabel: buildCategoryLabel(
        codeTitle,
        it.categoryL1Id,
        it.categoryL2Id,
      ),
    }));

    return { total: typeof res?.total === "number" ? res.total : 0, items };
  } catch {
    return { total: 0, items: [] };
  }
}
