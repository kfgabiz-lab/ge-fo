// 통합검색(/search) Pages 탭 · All 탭 "Pages" 섹션 실검색 헬퍼.
// - BE 엔드포인트: GET /api/v1/fo/page-search?q=&page=&size= (인증 불필요/permitAll)
//   응답 { content:[{ id, title, snippet }], totalElements, totalPages, page, size }
//   · 아이템 필드는 id / title / snippet 3개뿐이다.
//     link(URL) · imageUrl · sortDate · category 에 대응하는 컬럼이 원천(integration_contents)에 없어
//     화면에서도 해당 요소는 채우지 않는다(퍼블리싱 마크업은 그대로 두고 값만 비움).
//   · title   = 평문. 가공 없이 그대로 사용.
//   · snippet = BE 에서 HTML 태그 제거 + 200자 캡까지 끝난 평문.
//               목록 카드 기준 길이로 한 번 더 맞추기 위해서만 stripHtmlText 를 통과시킨다.
//   · sourceCounts 없음(단일 타입) → 필터 패널 count 연동 대상 아님.
//   · page    = 0-based (화면 PageNumbering 은 1-based → 호출부에서 변환)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";
import type { SearchPageItem } from "@/data/search/searchAllContent";

// ---------------- API 응답 타입 ----------------

// = bo-api PageSearchItemResponse
interface PageSearchApiItem {
  id: number;
  title: string | null;
  snippet: string | null;
}

// = bo-api PageSearchResponse
interface PageSearchApiResponse {
  content: PageSearchApiItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ---------------- 화면 사용 결과 ----------------

export interface SearchPagesResult {
  /** 현재 페이지 목록 항목 */
  items: SearchPageItem[];
  /** 전체 건수(Total 표시 · 탭 라벨 카운트 · 섹션 헤더 카운트 공용) */
  totalElements: number;
  /** 전체 페이지 수(응답값 그대로) */
  totalPages: number;
}

/** 실패/빈 결과 폴백. */
export const EMPTY_SEARCH_PAGES_RESULT: SearchPagesResult = {
  items: [],
  totalElements: 0,
  totalPages: 0,
};

// API 아이템 → Pages 목록 항목
function toPageItem(
  item: PageSearchApiItem,
  highlight: string,
): SearchPageItem {
  return {
    // 다른 검색 소스와 id 가 겹치지 않도록 접두어 부여
    id: `PAGE-${item.id}`,
    // 이동 대상 URL 컬럼이 없다 → 빈 값. SearchPageListItem 이 클릭 불가 항목으로 렌더한다.
    href: "",
    // 분류(Markets/Service/…) 컬럼이 없다 → 빈 값. 카테고리 줄은 렌더되지 않는다.
    category: "",
    title: item.title ?? "",
    // BE 가 이미 평문화했지만 목록 카드 길이 기준을 맞추기 위해 공통 헬퍼를 통과시킨다.
    description: stripHtmlText(item.snippet, LIST_DESCRIPTION_MAX_LENGTH),
    highlight: highlight || undefined,
    // mark(제목 뒤 " I 접미 라벨")는 대응 컬럼이 없어 미설정 → 접미 마크 자체가 렌더되지 않는다.
  };
}

// ---------------- 조회 함수 ----------------

export interface SearchPagesQueryOptions {
  /** 0-based 페이지 번호. 기본 0. */
  page?: number;
  /** 페이지 크기. 기본 10. */
  size?: number;
}

/**
 * Pages 통합검색.
 * - q 가 비어 있어도 호출한다(BE 규약상 q 미지정 = 전체 목록).
 * - 실패 시 빈 결과 폴백(화면 방어).
 */
export async function fetchSearchPages(
  query: string,
  options: SearchPagesQueryOptions = {},
): Promise<SearchPagesResult> {
  const { page = 0, size = 10 } = options;
  const q = query.trim();

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("size", String(size));

    const res = await fetchApi<PageSearchApiResponse>(
      `/api/v1/fo/page-search?${params.toString()}`,
    );

    const content = Array.isArray(res?.content) ? res.content : [];
    return {
      items: content.map((item) => toPageItem(item, q)),
      totalElements:
        typeof res?.totalElements === "number" ? res.totalElements : 0,
      totalPages: typeof res?.totalPages === "number" ? res.totalPages : 0,
    };
  } catch {
    return EMPTY_SEARCH_PAGES_RESULT;
  }
}
