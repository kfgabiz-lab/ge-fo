// Markets FAQ 데이터 조회 헬퍼
// - 각 markets 페이지(서버 컴포넌트)에서 자기 페이지의 markets 코드로 호출 → 결과를 MarketsFaq 의 items prop 으로 전달
// - 설계 문서: fo/docs/dev/markets/faq-data.md
// - 재사용 엔드포인트(신규 BE 없음): GET /api/v1/fo/page-data/faq-data
//   where: eq_main_category=002(Markets 대분류) + eq_is_visible=001(공개) + eq_markets={페이지별 코드}
//   정렬: id ASC, size=100 (다건 전체)
// - flatten: dataJson.faq.question → question, dataJson.faq.answer → answer
//   (현행 정본 스키마의 content key = faq. 설계 문서 3번 API 확인 섹션 참고)
// - ⚠️ 현재 라이브에 스펙 where 를 만족하는 레코드가 0건이라 빈 목록이 정상(설계 문서 6번 비고). BE/FE 버그 아님.
import { fetchApi } from "@/lib/api";
import type { FaqItem } from "./marketsContent";

// bo-api page-data 응답(Spring Data Page) 공통 형태 (content 배열만 사용)
interface PageDataResponse<TForm> {
  content: Array<{
    id: number;
    dataJson: TForm;
  }>;
}

// faq-data dataJson 현행(정본) 스키마 — content key = faq (설계 문서 3번)
interface FaqFormRow {
  faq?: {
    question?: string;
    answer?: string;
  };
}

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
// 조회 실패/빈 응답 시 빈 배열 → 화면엔 빈 FAQ 목록(현재 라이브 0건이 정상 케이스).
export async function fetchMarketsFaqItems(
  marketsCode: MarketsFaqCode,
): Promise<FaqItem[]> {
  const res = await fetchApi<PageDataResponse<FaqFormRow>>(
    `/api/v1/fo/page-data/faq-data?eq_main_category=002&eq_is_visible=001&eq_markets=${marketsCode}&sort=id,asc&size=100`,
  );

  return (res.content ?? []).map((row) => {
    const form = row.dataJson?.faq ?? {};
    return {
      question: form.question ?? "",
      answer: form.answer ?? "",
    };
  });
}
