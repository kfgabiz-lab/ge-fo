// Markets FAQ 데이터 조회 헬퍼
// - 각 markets 페이지(서버 컴포넌트)에서 자기 페이지의 markets 코드로 호출 → 결과를 MarketsFaq 의 items prop 으로 전달
// - 설계 문서: fo/docs/dev/markets/faq-data.md
// - 재사용 엔드포인트(신규 BE 없음): GET /api/v1/fo/page-data/faq-data
//   where: eq_mainCategory=002(Markets 대분류) + eq_isVisible=001(공개) + eq_markets={페이지별 코드}
//   정렬: id ASC, size=100 (다건 전체)
// - 응답 매핑: fo/src/lib/pageData.ts 의 flattenPageDataItem 으로 dataJson 을 flat row 로 변환 후
//   root 필드 title(질문 텍스트) → question, answer(답변 텍스트) → answer 로 매핑
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
import type { FaqItem } from "./marketsContent";

// bo-api page-data 응답(Spring Data Page) 공통 형태 (content 배열만 사용)
// 각 item 은 flattenPageDataItem 에 그대로 넘길 수 있는 PageDataItem 구조.
interface PageDataResponse {
  content: PageDataItem[];
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
// 조회 실패/빈 응답 시 빈 배열 → 화면엔 빈 FAQ 목록.
export async function fetchMarketsFaqItems(
  marketsCode: MarketsFaqCode,
): Promise<FaqItem[]> {
  try {
    const res = await fetchApi<PageDataResponse>(
      `/api/v1/fo/page-data/faq-data?eq_mainCategory=002&eq_isVisible=001&eq_markets=${marketsCode}&sort=id,asc&size=100`,
    );

    return (res.content ?? []).map((item) => {
      // flattenPageDataItem: faqForm 섹션 필드(title/answer/...)를 root 로 flat 병합
      const row = flattenPageDataItem(item as PageDataItem);
      return {
        question: (row.title as string) ?? "",
        answer: (row.answer as string) ?? "",
      };
    });
  } catch {
    return [];
  }
}
