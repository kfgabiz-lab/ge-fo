// 통합검색(/search) Pages 탭 · All 탭 "Pages" 섹션 실검색 헬퍼.
// - 원천 데이터: 관리기능 search_manage / search_manage_text (통합검색 페이지 관리).
//   ※ 과거 integration_contents(type NULL) 기반이었으나 잘못된 설계로 확인되어 교체됨.
//     site 구분 컬럼이 search_manage 에 없어 X-Site-Id 를 보내지 않는다.
// - BE 엔드포인트: GET /api/v1/fo/page-search?q=&sections=&page=&size= (인증 불필요/permitAll)
//   응답 { content:[{ id, url, title, snippet, section, sectionName }],
//          totalElements, totalPages, page, size, sectionCounts }
//   · id      = search_manage.id (NOT NULL). 목록 key 용 — 다른 검색 소스와 겹치지 않게 접두어를 붙인다.
//   · url     = search_manage.url (NOT NULL). 이동 대상 경로 → 목록 카드 href 로 사용.
//   · title   = NOT NULL 보장(제목이 없으면 BE 가 url 로 폴백). 평문이라 가공 없이 그대로 사용.
//   · snippet = 대표 검색텍스트. BE 에서 이미 평문 + 200자 캡 처리된 값이다.
//               목록 카드 기준 길이로 한 번 더 맞추기 위해서만 stripHtmlText 를 통과시킨다.
//   · section     = 분류 코드(MARKETS/SERVICE/SUPPORT/COMPANY). 미지정 데이터는 null.
//   · sectionName = 분류 표시명(공통코드 name). null 이면 빈 값으로 두고 임의 폴백 문구를 만들지 않는다.
//   · sections    = 요청 시 분류 코드 CSV(Media 의 sources 와 동일 스타일). 미지정이면 전체.
//   · sectionCounts = sections 선택과 무관하게 항상 활성 코드 전부(0건도 0) · 순서 고정.
//                     키워드(q)만 반영하므로 필터를 바꿔도 값이 흔들리지 않는다 → 필터 패널 count 표시에 사용.
//                     ※ section 이 NULL 인 데이터는 어느 count 에도 안 잡히므로
//                       totalElements 와 sectionCounts 합계는 다를 수 있다(정상). Total 은 항상 totalElements 사용.
//   · imageUrl / sortDate / mark 에 대응하는 컬럼이 원천에 없다 →
//     화면에서도 해당 요소는 채우지 않는다(퍼블리싱 마크업은 그대로 두고 값만 비움).
//   · page    = 0-based (화면 PageNumbering 은 1-based → 호출부에서 변환)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";
import type { SearchPageItem } from "@/data/search/searchAllContent";

// ---------------- 분류 4종 단일 정의(필터 옵션 id ↔ API section 코드 ↔ 화면 라벨) ----------------

export type PageSectionCode = "MARKETS" | "SERVICE" | "SUPPORT" | "COMPANY";

type PageSectionMeta = {
  /** 필터 옵션 id(체크박스 실제 id 는 "search-page-type-{optionId}") */
  optionId: string;
  /** API sections 파라미터 값 / 응답 section 코드 */
  sectionCode: PageSectionCode;
  /** 필터 패널 표시 라벨(퍼블리싱 문구 유지) */
  filterLabel: string;
};

/**
 * 옵션 id ↔ section 코드 매핑의 유일한 출처.
 * 소문자화/대문자화 같은 암묵 변환에 의존하지 않고 명시적으로 짝을 적어 둔다
 * (코드값과 옵션 id 가 앞으로 갈라져도 이 표만 고치면 된다).
 * 라벨은 Media 와 동일 정책으로 FO 정적 정의를 유지한다(공통코드 API 로 끌어오지 않음).
 */
export const SEARCH_PAGE_SECTIONS: PageSectionMeta[] = [
  { optionId: "markets", sectionCode: "MARKETS", filterLabel: "Markets" },
  { optionId: "service", sectionCode: "SERVICE", filterLabel: "Service" },
  { optionId: "support", sectionCode: "SUPPORT", filterLabel: "Support" },
  { optionId: "company", sectionCode: "COMPANY", filterLabel: "Company" },
];

const SECTION_BY_OPTION_ID = new Map(
  SEARCH_PAGE_SECTIONS.map((meta) => [meta.optionId, meta]),
);

/**
 * 필터에서 선택된 옵션 id 목록 → API sections CSV.
 * 아무것도 선택하지 않으면 빈 문자열 → 호출부에서 sections 파라미터 자체를 보내지 않는다(= 전체).
 */
export function toPageSectionsParam(optionIds: string[]): string {
  // 정의 순서(SEARCH_PAGE_SECTIONS)를 따라 정렬해 동일 선택이면 항상 같은 CSV 가 되도록 한다.
  return SEARCH_PAGE_SECTIONS.filter((meta) => optionIds.includes(meta.optionId))
    .map((meta) => meta.sectionCode)
    .join(",");
}

/** 필터 옵션 id 로 분류 메타 조회(필요 시 재사용). */
export function getPageSectionMeta(optionId: string): PageSectionMeta | undefined {
  return SECTION_BY_OPTION_ID.get(optionId);
}

// ---------------- API 응답 타입 ----------------

// = bo-api PageSearchItemResponse (search_manage / search_manage_text 기반)
interface PageSearchApiItem {
  /** search_manage.id */
  id: number;
  /** search_manage.url — 이동 대상 경로 */
  url: string;
  /** 제목. BE 가 NOT NULL 보장(없으면 url 폴백) */
  title: string;
  /** 대표 검색텍스트(평문, 최대 200자). BE 가 NOT NULL 보장 */
  snippet: string;
  /** 분류 코드(MARKETS/SERVICE/SUPPORT/COMPANY). 미지정이면 null */
  section: string | null;
  /** 분류 표시명(공통코드 name). 없으면 null */
  sectionName: string | null;
}

// = bo-api PageSearchResponse
interface PageSearchApiResponse {
  content: PageSearchApiItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  /** 분류 코드별 건수. sections 선택과 무관하게 항상 전체 코드 포함(0건도 0) */
  sectionCounts: Record<string, number>;
}

// ---------------- 화면 사용 결과 ----------------

export interface SearchPagesResult {
  /** 현재 페이지 목록 항목 */
  items: SearchPageItem[];
  /** 전체 건수(Total 표시 · 탭 라벨 카운트 · 섹션 헤더 카운트 공용) */
  totalElements: number;
  /** 전체 페이지 수(응답값 그대로) */
  totalPages: number;
  /** 필터 옵션 id 기준 분류별 건수(예: { markets: 3, service: 3, support: 3, company: 3 }) */
  counts: Record<string, number>;
}

/** 실패/빈 결과 폴백. counts 는 4키 0으로 채워 "Company (0)" 표기가 유지되도록 한다. */
export const EMPTY_SEARCH_PAGES_RESULT: SearchPagesResult = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  counts: Object.fromEntries(
    SEARCH_PAGE_SECTIONS.map((meta) => [meta.optionId, 0]),
  ),
};

// section 코드 키(API) → optionId 키(화면 필터) 로 변환. 누락 키는 0.
function toOptionCounts(
  sectionCounts?: Record<string, number>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const meta of SEARCH_PAGE_SECTIONS) {
    const raw = sectionCounts?.[meta.sectionCode];
    counts[meta.optionId] = typeof raw === "number" ? raw : 0;
  }
  return counts;
}

// API 아이템 → Pages 목록 항목
function toPageItem(
  item: PageSearchApiItem,
  highlight: string,
): SearchPageItem {
  return {
    // 다른 검색 소스와 id 가 겹치지 않도록 접두어 부여
    id: `PAGE-${item.id}`,
    // search_manage.url = 이동 대상 경로. 값이 비면 SearchPageListItem 이 클릭 불가 항목으로 렌더한다.
    href: item.url ?? "",
    // 분류 표시명(공통코드 name). null 이면 빈 값 유지 → 카테고리 줄 자체가 렌더되지 않는다.
    // (없는 문구를 임의 폴백으로 만들지 않는다 — 코드값을 라벨처럼 노출하지도 않음)
    category: item.sectionName ?? "",
    title: item.title ?? "",
    // BE 가 이미 평문화했지만 목록 카드 길이 기준을 맞추기 위해 공통 헬퍼를 통과시킨다.
    description: stripHtmlText(item.snippet, LIST_DESCRIPTION_MAX_LENGTH),
    highlight: highlight || undefined,
    // mark(제목 뒤 " I 접미 라벨")는 대응 컬럼이 없어 미설정 → 접미 마크 자체가 렌더되지 않는다.
  };
}

// ---------------- 조회 함수 ----------------

export interface SearchPagesQueryOptions {
  /** 선택된 필터 옵션 id 목록(markets/service/support/company). 빈 배열이면 분류 필터 없음(= 전체). */
  sections?: string[];
  /** 0-based 페이지 번호. 기본 0. */
  page?: number;
  /** 페이지 크기. 기본 10. */
  size?: number;
}

/**
 * Pages 통합검색.
 * - q 가 비어 있어도 호출한다(BE 규약상 q 미지정 = 전체 목록. 필터만으로 탐색 가능).
 * - 실패 시 빈 결과 폴백(화면 방어).
 */
export async function fetchSearchPages(
  query: string,
  options: SearchPagesQueryOptions = {},
): Promise<SearchPagesResult> {
  const { sections = [], page = 0, size = 10 } = options;
  const q = query.trim();

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const sectionsParam = toPageSectionsParam(sections);
    // 아무것도 선택하지 않으면 sections 파라미터를 보내지 않는다(= 전체).
    if (sectionsParam) params.set("sections", sectionsParam);
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
      counts: toOptionCounts(res?.sectionCounts),
    };
  } catch {
    return EMPTY_SEARCH_PAGES_RESULT;
  }
}
