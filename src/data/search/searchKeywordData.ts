import { fetchApi } from "@/lib/api";

export type SearchKeywordSource = "DOWNLOAD_CENTER" | "UNIFIED_SEARCH";


export async function logSearchKeyword(
  source: SearchKeywordSource,
  keyword: string,
): Promise<void> {
  const trimmed = keyword?.trim();
  if (!trimmed) return;
  try {
    await fetchApi<void>(`/api/v1/fo/search-keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, keyword: trimmed }),
    });
  } catch {
  }
}


export async function fetchPopularKeywords(
  source: SearchKeywordSource,
): Promise<string[]> {
  try {
    const list = await fetchApi<string[]>(
      `/api/v1/fo/search-keywords/popular?source=${encodeURIComponent(source)}`,
    );
    return Array.isArray(list) ? list.filter((k) => !!k && !!k.trim()) : [];
  } catch {
    return [];
  }
}
