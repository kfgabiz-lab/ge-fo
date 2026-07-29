import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

/** Figma 6430:112540 — Search Pages tab + filter */
// totalResults(목업 2658)는 page-search API 실연동으로 전환되면서 제거됨 — Total 표기는 응답 totalElements 사용.
export const searchPagesPage = {
  pageSize: 10,
} as const;

// 좌측 "Document Type" 필터 옵션.
// integration_contents 에 유형 구분 컬럼이 없어 이번 라운드는 API 미연동(체크해도 결과가 바뀌지 않음).
export const searchPageTypes: DownloadFilterOption[] = [
  { id: "markets", label: "Markets", count: 100 },
  { id: "service", label: "Service", count: 100 },
  { id: "support", label: "Support", count: 100 },
  { id: "company", label: "Company", count: 352 },
];

// 목업 목록(pagesPool) 과 getSearchPagesPageItems 는 page-search API 실연동으로 전환되면서 제거됨.
// Pages 목록 데이터는 @/data/search/searchPagesData 의 fetchSearchPages 가 생성한다.
