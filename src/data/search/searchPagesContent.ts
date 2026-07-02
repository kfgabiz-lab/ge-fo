import type { SearchPageItem } from "@/data/search/searchAllContent";
import { searchAllPages } from "@/data/search/searchAllContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

/** Figma 4701:84292 · list 5661:80869 — Search Pages tab + filter */
export const searchPagesPage = {
  totalResults: 2658,
  pageSize: 10,
} as const;

export const searchPageTypes: DownloadFilterOption[] = [
  { id: "markets", label: "Markets", count: 100 },
  { id: "service", label: "Service", count: 100 },
  { id: "support", label: "Support", count: 100 },
  { id: "company", label: "Company", count: 352 },
];

/** Figma 5661:80869 — page 1 slot order (template index into searchAllPages) */
const searchPagesFirstPageTemplateIndices = [0, 1, 2, 3, 0, 2, 1, 3, 1, 3] as const;

function buildSearchPagesPool(): SearchPageItem[] {
  return searchPagesFirstPageTemplateIndices.map((templateIndex, slotIndex) => {
    const source = searchAllPages[templateIndex];
    const item: SearchPageItem = {
      ...source,
      id: `${source.id}-slot-${slotIndex}`,
    };

    if (slotIndex === 4 && source.highlight) {
      item.title = "Power your data center with reliable electrical solutions  |";
    }

    return item;
  });
}

const pagesPool: SearchPageItem[] = buildSearchPagesPool();

export function getSearchPagesPageItems(page: number, pageSize: number): SearchPageItem[] {
  const start = (page - 1) * pageSize;
  const items: SearchPageItem[] = [];

  for (let i = 0; i < pageSize; i++) {
    const globalIndex = start + i;
    const source = pagesPool[globalIndex % pagesPool.length];
    items.push({
      ...source,
      id: `${source.id}-p${page}-${i}`,
    });
  }

  return items;
}
