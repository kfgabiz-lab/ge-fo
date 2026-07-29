import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";
import { SEARCH_PAGE_SECTIONS } from "@/data/search/searchPagesData";

/**
 * Figma 6430:112540 — Search Pages tab + filter (정적 화면 메타)
 * 결과 목록/건수/필터 count 는 전부 실 API(/api/v1/fo/page-search) 값이므로 여기 두지 않는다.
 * → 목록 조회는 @/data/search/searchPagesData 의 fetchSearchPages 사용.
 */
export const searchPagesPage = {
  pageSize: 10,
} as const;

/**
 * 좌측 "Document Type" 필터 옵션 — 분류 4종 단일 정의(SEARCH_PAGE_SECTIONS)에서 파생한다.
 * 체크 시 sections 파라미터로 전달돼 실제 결과가 필터링된다.
 * count 는 검색 응답(sectionCounts)으로 매번 달라지므로 여기서는 지정하지 않고
 * SearchPagesFilterPanel 의 counts prop 으로 주입한다.
 */
export const searchPageTypes: DownloadFilterOption[] = SEARCH_PAGE_SECTIONS.map(
  (meta) => ({ id: meta.optionId, label: meta.filterLabel }),
);

// 목업 목록(pagesPool) 과 getSearchPagesPageItems 는 page-search API 실연동으로 전환되면서 제거됨.
// Pages 목록 데이터는 @/data/search/searchPagesData 의 fetchSearchPages 가 생성한다.
