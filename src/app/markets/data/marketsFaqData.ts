// Markets FAQ 데이터 조회 헬퍼
// - 각 markets 페이지(서버 컴포넌트)에서 자기 페이지의 markets 코드로 호출 → 결과를 MarketsFaq 의 items prop 으로 전달
// - 설계 문서: fo/docs/dev/markets/faq-data.md
// - 재사용 엔드포인트(신규 BE 없음): GET /api/v1/fo/page-data/faq-data
//   where: eq_main_category=002(Markets 대분류) + eq_is_visible=001(공개) + eq_markets={페이지별 코드}
//   (필드명은 bo faq-detail/faq-list 빌더 템플릿 config_json 기준 snake_case로 확정 — 2026-07-21 재확인)
//   정렬: id ASC, size=100 (다건 전체)
// - 응답 매핑: fetchData(목록 브랜치)가 content 를 이미 flatten(flattenPageDataItem) 한 row 배열로 내려줌 →
//   root 필드 question(질문 텍스트) → question, answer(답변 텍스트) → answer 로 매핑
import { fetchData } from "@/lib/pageDataApi";
import type { FaqItem } from "./marketsContent";

// 페이지별 markets 코드값 (설계 문서 4번 "페이지별 where(markets 값)" 표)
export const MARKETS_FAQ_CODE = {
  dataCenter: "001",
  publicInfrastructure: "002",
  oilGasMining: "003",
  powerGrid: "004",
  industrial: "005",
  commercialResidential: "006",
} as const;

export type MarketsFaqCode =
  (typeof MARKETS_FAQ_CODE)[keyof typeof MARKETS_FAQ_CODE];

// markets 코드별 FAQ 목록 조회.
// 조회 실패/빈 응답 시 빈 배열 → 화면엔 빈 FAQ 목록.
export async function fetchMarketsFaqItems(
  marketsCode: MarketsFaqCode,
): Promise<FaqItem[]> {
  try {
    // 공통 조회+매핑 계층(fetchData) 경유 — where 키는 BE 인식 키 그대로.
    // content 는 이미 flatten 된 row 배열(faq 섹션 필드가 root 로 병합됨).
    const res = await fetchData({
      slug: "faq-data",
      where: {
        eq_main_category: "002",
        eq_is_visible: "001",
        eq_markets: marketsCode,
      },
      sort: "id,asc",
      size: 100,
    });

    return (res.content ?? []).map((row) => ({
      question: (row.question as string) ?? "",
      answer: (row.answer as string) ?? "",
    }));
  } catch {
    return [];
  }
}
