import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import { SEARCH_MEDIA_SOURCES } from "@/data/search/searchMediaData";

export const searchMediaPage = {
  pageSize: 10,
} as const;

export const searchMediaTypes: DownloadFilterOption[] = SEARCH_MEDIA_SOURCES.map(
  (meta) => ({ id: meta.optionId, label: meta.filterLabel }),
);
