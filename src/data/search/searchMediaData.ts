// 통합검색(/search) Media 탭 실검색 헬퍼.
// - BE 엔드포인트: GET /api/v1/fo/media-search?q=&sources=&page=&size= (인증 불필요/permitAll)
//   응답 { content:[{ sourceType, id, title, snippet, imageUrl, sortDate, link }],
//          totalElements, totalPages, page, size, sourceCounts }
//   · sourceType = TECH_HUB | BLOG | PRESS | ARTICLE (4종 고정)
//   · link       = BE 가 완성한 실제 FO 라우트. FE 에서 조립하지 않고 그대로 href 로 사용.
//   · imageUrl   = 프록시 URL(/api/v1/fo/page-files/{fileId}) 또는 YouTube 썸네일. 없으면 null.
//   · snippet    = 본문 HTML 원문 200자 캡. TECH_HUB 은 항상 null(본문 컬럼 없음) → description 없이 렌더.
//   · sourceCounts = sources 필터 선택과 무관하게 항상 4키 전부(0건도 0). 필터 패널 count 표시에 사용.
//   · page       = 0-based (화면 PageNumbering 은 1-based → 호출부에서 변환)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { LIST_DESCRIPTION_MAX_LENGTH, stripHtmlText } from "@/lib/stripHtmlText";
import type { SearchMediaItem } from "@/data/search/searchAllContent";

// ---------------- 소스 4종 단일 정의(필터 옵션 id ↔ API sourceType ↔ 화면 라벨 ↔ 폴백 이미지) ----------------

export type MediaSourceType = "TECH_HUB" | "BLOG" | "PRESS" | "ARTICLE";

type MediaSourceMeta = {
  /** 필터 옵션 id(체크박스 실제 id 는 "search-media-type-{optionId}") */
  optionId: string;
  /** API sources 파라미터 값 */
  sourceType: MediaSourceType;
  /** 필터 패널 표시 라벨(퍼블리싱 문구 유지 — Articles) */
  filterLabel: string;
  /** 결과 카드 상단 카테고리 라벨 */
  categoryLabel: string;
  /**
   * 썸네일(imageUrl) 이 없을 때 사용할 정적 폴백 이미지.
   * 각 소스의 목록 화면에서 쓰는 폴백과 동일한 퍼블리싱 이미지를 재사용한다
   * (company/press/page.tsx · company/articles/page.tsx · CompanyBlogPage.tsx 의 LIST_FALLBACK_IMAGE).
   * TECH_HUB 은 목록(TechHubVideoCard)에서도 정적 폴백을 쓰지 않고 src 미설정으로 두므로 여기서도 미지정.
   */
  fallbackImage?: string;
};

export const SEARCH_MEDIA_SOURCES: MediaSourceMeta[] = [
  {
    optionId: "tech-hub",
    sourceType: "TECH_HUB",
    filterLabel: "Tech Hub",
    categoryLabel: "Tech Hub",
  },
  {
    optionId: "blog",
    sourceType: "BLOG",
    filterLabel: "Blog",
    categoryLabel: "Blog",
    fallbackImage: "/img/company/blog/list_01.jpg",
  },
  {
    optionId: "press",
    sourceType: "PRESS",
    filterLabel: "Press",
    categoryLabel: "Press",
    fallbackImage: "/img/company/press/list_01.png",
  },
  {
    optionId: "articles",
    sourceType: "ARTICLE",
    filterLabel: "Articles",
    categoryLabel: "Article",
    fallbackImage: "/img/company/articles/list_01.png",
  },
];

const SOURCE_BY_OPTION_ID = new Map(
  SEARCH_MEDIA_SOURCES.map((meta) => [meta.optionId, meta]),
);
const SOURCE_BY_TYPE = new Map(
  SEARCH_MEDIA_SOURCES.map((meta) => [meta.sourceType, meta]),
);

/**
 * 필터에서 선택된 옵션 id 목록 → API sources CSV.
 * 아무것도 선택하지 않으면 빈 문자열 → 호출부에서 sources 파라미터 자체를 보내지 않는다(= 4개 전체).
 */
export function toMediaSourcesParam(optionIds: string[]): string {
  // 정의 순서(SEARCH_MEDIA_SOURCES)를 따라 정렬해 동일 선택이면 항상 같은 CSV 가 되도록 한다.
  return SEARCH_MEDIA_SOURCES.filter((meta) => optionIds.includes(meta.optionId))
    .map((meta) => meta.sourceType)
    .join(",");
}

// ---------------- API 응답 타입 ----------------

// = bo-api MediaSearchItemResponse
interface MediaSearchApiItem {
  sourceType: string;
  id: number;
  title: string | null;
  snippet: string | null;
  imageUrl: string | null;
  sortDate: string | null;
  link: string | null;
}

// = bo-api MediaSearchResponse
interface MediaSearchApiResponse {
  content: MediaSearchApiItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  sourceCounts: Record<string, number>;
}

// ---------------- 화면 사용 결과 ----------------

export interface SearchMediaResult {
  /** 현재 페이지 카드 목록 */
  items: SearchMediaItem[];
  /** 선택 소스 기준 전체 건수(Total 표시) */
  totalElements: number;
  /** 전체 페이지 수(응답값 그대로) */
  totalPages: number;
  /** 필터 옵션 id 기준 소스별 건수(예: { "tech-hub": 44, blog: 12, press: 11, articles: 0 }) */
  counts: Record<string, number>;
}

/** 실패/빈 결과 폴백. counts 는 4키 0으로 채워 "Articles (0)" 표기가 유지되도록 한다. */
export const EMPTY_SEARCH_MEDIA_RESULT: SearchMediaResult = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  counts: Object.fromEntries(
    SEARCH_MEDIA_SOURCES.map((meta) => [meta.optionId, 0]),
  ),
};

// sourceType 키(API) → optionId 키(화면 필터) 로 변환. 누락 키는 0.
function toOptionCounts(
  sourceCounts?: Record<string, number>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const meta of SEARCH_MEDIA_SOURCES) {
    const raw = sourceCounts?.[meta.sourceType];
    counts[meta.optionId] = typeof raw === "number" ? raw : 0;
  }
  return counts;
}

// API 아이템 → Media 카드 항목
function toMediaCard(
  item: MediaSearchApiItem,
  highlight: string,
): SearchMediaItem {
  const meta = SOURCE_BY_TYPE.get(item.sourceType as MediaSourceType);
  // TECH_HUB 은 BE 게이트상 영상만 내려오므로 video 스타일(썸네일 딤/레터박스)로 파생한다.
  const isVideo = item.sourceType === "TECH_HUB";
  // snippet 은 HTML 원문 → 공통 헬퍼로 태그 제거 후 목록 카드 기준 길이로 컷.
  const description = stripHtmlText(item.snippet, LIST_DESCRIPTION_MAX_LENGTH);

  return {
    // 소스별로 id 가 겹칠 수 있어 sourceType 을 접두어로 사용
    id: `${item.sourceType}-${item.id}`,
    href: item.link ?? "",
    image: item.imageUrl ?? meta?.fallbackImage ?? "",
    category: meta?.categoryLabel ?? "",
    title: item.title ?? "",
    description: description || undefined,
    highlight: highlight || undefined,
    variant: isVideo ? "video" : "default",
  };
}

// ---------------- 조회 함수 ----------------

export interface SearchMediaQueryOptions {
  /** 선택된 필터 옵션 id 목록(tech-hub/blog/press/articles). 빈 배열이면 소스 필터 없음(= 전체). */
  sources?: string[];
  /** 0-based 페이지 번호. 기본 0. */
  page?: number;
  /** 페이지 크기. 기본 10. */
  size?: number;
}

/**
 * Media 탭 통합검색.
 * - q 가 비어 있어도 호출한다(BE 규약상 q 미지정 = 전체 목록. 필터만으로 탐색 가능).
 * - 실패 시 빈 결과 폴백(화면 방어). 섹션 자체를 숨기지 않는다.
 */
export async function fetchSearchMedia(
  query: string,
  options: SearchMediaQueryOptions = {},
): Promise<SearchMediaResult> {
  const { sources = [], page = 0, size = 10 } = options;
  const q = query.trim();

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const sourcesParam = toMediaSourcesParam(sources);
    // 아무것도 선택하지 않으면 sources 파라미터를 보내지 않는다(= 4개 전체).
    if (sourcesParam) params.set("sources", sourcesParam);
    params.set("page", String(page));
    params.set("size", String(size));

    const res = await fetchApi<MediaSearchApiResponse>(
      `/api/v1/fo/media-search?${params.toString()}`,
    );

    const content = Array.isArray(res?.content) ? res.content : [];
    return {
      items: content.map((item) => toMediaCard(item, q)),
      totalElements:
        typeof res?.totalElements === "number" ? res.totalElements : 0,
      totalPages: typeof res?.totalPages === "number" ? res.totalPages : 0,
      counts: toOptionCounts(res?.sourceCounts),
    };
  } catch {
    return EMPTY_SEARCH_MEDIA_RESULT;
  }
}

/** 필터 옵션 id 로 소스 메타 조회(필요 시 재사용). */
export function getMediaSourceMeta(optionId: string): MediaSourceMeta | undefined {
  return SOURCE_BY_OPTION_ID.get(optionId);
}
