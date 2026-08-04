import { fetchApi } from "@/lib/api";
import type { DownloadCenterItem } from "@/data/support/downloadCenterData";

interface DownloadCenterSearchResponse {
  total: number;
  items: DownloadCenterItem[];
}

export interface SearchAllDocumentsResult {
  total: number;
  items: DownloadCenterItem[];
}

export async function fetchSearchAllDocuments(
  query: string,
  limit = 4,
): Promise<SearchAllDocumentsResult> {
  const q = query.trim();
  if (!q) return { total: 0, items: [] };

  try {
    const res = await fetchApi<DownloadCenterSearchResponse>(
      `/api/v1/fo/download-center/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    );

    const items = Array.isArray(res?.items) ? res.items : [];

    return { total: typeof res?.total === "number" ? res.total : 0, items };
  } catch {
    return { total: 0, items: [] };
  }
}

export async function fetchSearchAllDocumentsByKeyword(
  keyword: string,
  limit = 4,
): Promise<SearchAllDocumentsResult> {
  const kw = keyword.trim();
  if (!kw) return { total: 0, items: [] };

  try {
    const res = await fetchApi<DownloadCenterSearchResponse>(
      `/api/v1/fo/download-center/keyword-search?keyword=${encodeURIComponent(kw)}&limit=${limit}`,
    );

    const items = Array.isArray(res?.items) ? res.items : [];

    return { total: typeof res?.total === "number" ? res.total : 0, items };
  } catch {
    return { total: 0, items: [] };
  }
}
