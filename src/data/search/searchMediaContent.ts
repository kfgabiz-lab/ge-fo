import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import { SEARCH_MEDIA_SOURCES } from "@/data/search/searchMediaData";

/**
 * Figma 6430:112128 — Search Media tab + filter (정적 화면 메타)
 * 결과 목록/건수/필터 count 는 전부 실 API(/api/v1/fo/media-search) 값이므로 여기 두지 않는다.
 * → 목록 조회는 @/data/search/searchMediaData 의 fetchSearchMedia 사용.
 */
export const searchMediaPage = {
  pageSize: 10,
} as const;

/**
 * 필터(Document Type) 옵션 — 소스 4종 단일 정의(SEARCH_MEDIA_SOURCES)에서 파생한다.
 * count 는 검색 응답(sourceCounts)으로 매번 달라지므로 여기서는 지정하지 않고
 * SearchMediaFilterPanel 의 counts prop 으로 주입한다.
 */
export const searchMediaTypes: DownloadFilterOption[] = SEARCH_MEDIA_SOURCES.map(
  (meta) => ({ id: meta.optionId, label: meta.filterLabel }),
);
