import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import { SEARCH_PAGE_SECTIONS } from "@/data/search/searchPagesData";

export const searchPagesPage = {
  pageSize: 10,
} as const;

export const searchPageTypes: DownloadFilterOption[] = SEARCH_PAGE_SECTIONS.map(
  (meta) => ({ id: meta.optionId, label: meta.filterLabel }),
);

