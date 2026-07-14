// 하이라이트 뉴스 섹션 데이터 진입점 — main/markets 공용 실데이터 헬퍼 재노출
// (정적 main.ts / markets.ts 는 실데이터 전환으로 제거됨)
export {
  fetchMainHighlightNews,
  fetchMarketHighlightNews,
} from "./highlightNewsData";
