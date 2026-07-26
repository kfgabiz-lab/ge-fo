// 하이라이트 뉴스("최신 뉴스") 섹션 공통 데이터 헬퍼
// - main("Catch up on the latest news")과 markets("Highlights")가 동일 로직으로 공유
// - press/blog/articles 3개 slug를 통합해 게시중 최신 3건을 HighlightNewsItem으로 변환
// - main: market 무관 전체 통합 / markets: 자기 market 코드가 markets 필드에 포함된 항목만 통합
//   (병합/정렬/포맷/폴백 로직은 완전히 동일 → 내부 헬퍼로 추출해 두 함수가 공유)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유한 각 목록 헬퍼 재사용)
import type { HighlightNewsItem } from "@/types/highlightNews";
import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import {
  PRESS_LIST_SIZE,
  PRESS_STATUS_WHERE,
  pressDetailHref,
  pressImageSrc,
  toPressCard,
  type PressRow,
} from "@/app/company/data/pressData";
import {
  BLOG_LIST_SIZE,
  BLOG_STATUS_WHERE,
  blogDetailHref,
  blogImageSrc,
  toBlogCard,
  type BlogRow,
} from "@/app/company/data/blogData";
import {
  ARTICLES_LIST_SIZE,
  ARTICLES_STATUS_WHERE,
  articlesDetailHref,
  articlesImageSrc,
  toArticlesCard,
  type ArticlesRow,
} from "@/app/company/data/articlesData";

// 폴백 이미지: 각 목록 페이지가 쓰는 기존 정적 자산 경로 재사용(신규 자산 생성 없음)
const PRESS_FALLBACK_IMAGE = "/img/company/press/list_01.png";
const BLOG_FALLBACK_IMAGE = "/img/company/blog/list_01.jpg";
const ARTICLES_FALLBACK_IMAGE = "/img/company/articles/list_01.png";

// 통합 노출 건수(최신 3건)
const HIGHLIGHT_LIMIT = 3;

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// "YYYY-MM-DD" → "Mon DD, YYYY"(기존 정적 데이터 표기와 동일). 형식 불일치 시 원본 그대로 반환.
function formatNewsDate(raw: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  const monthIdx = Number(m[2]) - 1;
  if (monthIdx < 0 || monthIdx > 11) return raw;
  return `${MONTH_ABBR[monthIdx]} ${m[3]}, ${m[1]}`;
}

// 정렬 키 — sortKey: publish_dttm 원본("YYYY-MM-DD", 사전식 비교로도 정확한 최신순 정렬 보장).
// sortId: press/blog/articles가 공유하는 page_data 원본 id(카테고리 무관 비교 가능) — sortKey 동률 시 내림차순 2차 정렬.
type HighlightEntry = { item: HighlightNewsItem; sortKey: string; sortId: number };

// press/blog/articles 원본 행들을 카드로 변환 → publishDttm 내림차순(동률 시 id 내림차순) 병합 → 상위 3건.
// main/markets 두 진입점이 100% 동일 로직을 쓰므로 여기로 추출(중복 제거).
function mergeAndPickTopNews(
  pressRows: PressRow[],
  blogRows: BlogRow[],
  articlesRows: ArticlesRow[],
): HighlightNewsItem[] {
  const entries: HighlightEntry[] = [];

  for (const row of pressRows) {
    const card = toPressCard(row);
    entries.push({
      sortKey: card.rawDate,
      sortId: card.id,
      item: {
        // slug 간 id 접두로 충돌 방지(press/blog/articles 동일 id 가능)
        id: `press-${card.id}`,
        href: pressDetailHref(card.id),
        image: card.imageSrc ?? PRESS_FALLBACK_IMAGE,
        imageAlt: card.title,
        tag: "Press",
        title: card.title,
        date: formatNewsDate(card.date),
      },
    });
  }

  // blog: toBlogCard는 categoryMap 인자가 필수지만 하이라이트는 카테고리 라벨을 쓰지 않으므로
  // 빈 맵을 전달해 BLOGCATEGORY 추가 조회를 생략한다(태그는 고정 "Blog").
  const emptyCategoryMap = new Map<string, string>();
  for (const row of blogRows) {
    const card = toBlogCard(row, emptyCategoryMap);
    entries.push({
      sortKey: card.rawDate,
      sortId: card.id,
      item: {
        id: `blog-${card.id}`,
        href: blogDetailHref(card.id),
        image: card.imageSrc ?? BLOG_FALLBACK_IMAGE,
        imageAlt: card.title,
        tag: "Blog",
        title: card.title,
        date: formatNewsDate(card.date),
      },
    });
  }

  for (const row of articlesRows) {
    const card = toArticlesCard(row);
    entries.push({
      sortKey: card.rawDate,
      sortId: card.id,
      item: {
        id: `articles-${card.id}`,
        href: articlesDetailHref(card.id),
        image: card.imageSrc ?? ARTICLES_FALLBACK_IMAGE,
        imageAlt: card.title,
        tag: "Articles",
        title: card.title,
        date: formatNewsDate(card.date),
      },
    });
  }

  return entries
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey) || b.sortId - a.sortId)
    .slice(0, HIGHLIGHT_LIMIT)
    .map((entry) => entry.item);
}

// press/blog/articles 통합 최신 3건 조회 공통 로직.
// market 지정 시 각 목록에 has_markets_markets 필터 전달(해당 market 코드 포함 항목만).
// 실패 시 빈 배열(섹션 자연 숨김, throw 금지).
async function fetchHighlightNews(
  market?: string,
): Promise<HighlightNewsItem[]> {
  try {
    // 각 목록 List 브랜치 호출(page:0, size는 각 LIST_SIZE, market 있으면 has_markets_markets, sort 생략=BE 기본)
    // 리턴함수=identity로 raw rows를 받아 mergeAndPickTopNews에 그대로 전달
    const marketWhere: Record<string, string> = market
      ? { has_markets_markets: market }
      : {};
    const [pressRes, blogRes, articlesRes] = await Promise.all([
      fetchData({
        slug: "press-data",
        page: 0,
        size: PRESS_LIST_SIZE,
        where: { ...PRESS_STATUS_WHERE, ...marketWhere },
        리턴함수: (rows) => rows,
      }),
      fetchData({
        slug: "blog-data",
        page: 0,
        size: BLOG_LIST_SIZE,
        where: { ...BLOG_STATUS_WHERE, ...marketWhere },
        리턴함수: (rows) => rows,
      }),
      fetchData({
        slug: "articles-data",
        page: 0,
        size: ARTICLES_LIST_SIZE,
        where: { ...ARTICLES_STATUS_WHERE, ...marketWhere },
        리턴함수: (rows) => rows,
      }),
    ]);
    return mergeAndPickTopNews(pressRes.content, blogRes.content, articlesRes.content);
  } catch {
    return [];
  }
}

// 메인("Catch up on the latest news") — market 무관 전체 통합 최신 3건
export async function fetchMainHighlightNews(): Promise<HighlightNewsItem[]> {
  return fetchHighlightNews();
}

// markets("Highlights") — 자기 market 코드가 markets 필드에 포함된 항목만 통합 최신 3건
export async function fetchMarketHighlightNews(
  marketCode: string,
): Promise<HighlightNewsItem[]> {
  return fetchHighlightNews(marketCode);
}

// ---------------- Insights — 서버 필터(BE) ----------------
// - 제품상세(스펙 38): `GET /api/v1/fo/products/{id}/insights`
// - Lv1 카테고리(기획서 13번): `GET /api/v1/fo/categories/{id}/insights`
// 두 엔드포인트의 응답 shape이 ProductInsightRowResponse로 동일해 매핑 로직을 공유한다.

// BE 응답 1건(ProductInsightRowResponse).
interface ProductInsightRow {
  id: number;
  dataSlug: string; // 'press-data' | 'blog-data' | 'articles-data'
  title: string;
  publishDttm: string;
  image: string | null; // 파일ID 배열의 JSON 텍스트("[123]") 또는 null
}

// slug별 태그/상세href/폴백이미지/이미지URL 헬퍼(기존 company 데이터 헬퍼 재사용).
function resolveInsightMeta(slug: string) {
  switch (slug) {
    case "press-data":
      return { tag: "Press", href: pressDetailHref, fallback: PRESS_FALLBACK_IMAGE, img: pressImageSrc };
    case "blog-data":
      return { tag: "Blog", href: blogDetailHref, fallback: BLOG_FALLBACK_IMAGE, img: blogImageSrc };
    case "articles-data":
      return { tag: "Articles", href: articlesDetailHref, fallback: ARTICLES_FALLBACK_IMAGE, img: articlesImageSrc };
    default:
      return null;
  }
}

// Insights 응답 행 → HighlightNewsItem 변환 공통 로직(제품상세 / 카테고리 Lv1 공용).
// 정렬/건수(게시일 내림차순·동률 id 내림차순·최대 3)는 BE 쿼리가 이미 확정하므로 FE는 매핑만 한다.
// dataSlug가 press/blog/articles가 아니면(알 수 없는 slug) 해당 행은 버린다.
function toHighlightNewsItems(rows: ProductInsightRow[]): HighlightNewsItem[] {
  return rows
    .map((row): HighlightNewsItem | null => {
      const meta = resolveInsightMeta(row.dataSlug);
      if (!meta) return null;
      // image: "[123]" → 첫 파일ID → page-files URL. 실패/없으면 폴백 이미지.
      let imageSrc: string | null = null;
      try {
        const arr = row.image ? JSON.parse(row.image) : null;
        const mediaId =
          Array.isArray(arr) && arr.length > 0 ? Number(arr[0]) : null;
        imageSrc = mediaId != null && !Number.isNaN(mediaId) ? meta.img(mediaId) : null;
      } catch {
        imageSrc = null;
      }
      return {
        id: `${meta.tag.toLowerCase()}-${row.id}`,
        href: meta.href(row.id),
        image: imageSrc ?? meta.fallback,
        imageAlt: row.title,
        tag: meta.tag,
        title: row.title,
        date: formatNewsDate(row.publishDttm),
      };
    })
    .filter((item): item is HighlightNewsItem => item !== null);
}

// Insights 계열 엔드포인트 공통 호출부(응답 shape이 ProductInsightRowResponse로 동일).
// 실패/0건 시 빈 배열 → HighlightNewsSection이 items 0건이면 섹션 자체를 렌더하지 않음(자연 숨김).
async function fetchInsights(endpoint: string): Promise<HighlightNewsItem[]> {
  try {
    return toHighlightNewsItems(await fetchApi<ProductInsightRow[]>(endpoint));
  } catch {
    return [];
  }
}

// 제품에 맵핑된 게시글 최신 3건(공개+게시일 과거는 BE에서 필터).
export async function fetchProductInsights(
  productId: number,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(`/api/v1/fo/products/${productId}/insights`);
}

// Lv1 카테고리(products-category/[slug]) Highlights — 해당 Lv1의 "노출가능 제품"에 맵핑된 게시글 최신 3건.
// 대상 제품 집합 판정(Lv2 노출조건 + 제품 공개/판매중)과 정렬/건수는 전부 BE가 처리한다.
export async function fetchCategoryInsights(
  categoryId: number,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(`/api/v1/fo/categories/${categoryId}/insights`);
}

// Lv2 카테고리(product-range/[slug]) Highlights — 해당 Lv2 "자신"에 맵핑된 노출가능 제품의 게시글 최신 3건.
// Lv1용 /insights 와 응답 shape·매핑 로직은 동일하고 대상 제품 집합만 다르다(Lv1: 하위 Lv2 전체 / Lv2: 자신 직접 맵핑).
export async function fetchCategoryInsightsLv2(
  categoryId: number,
): Promise<HighlightNewsItem[]> {
  return fetchInsights(`/api/v1/fo/categories/${categoryId}/lv2-insights`);
}
