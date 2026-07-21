// 하이라이트 뉴스("최신 뉴스") 섹션 공통 데이터 헬퍼
// - main("Catch up on the latest news")과 markets("Highlights")가 동일 로직으로 공유
// - press/blog/articles 3개 slug를 통합해 게시중 최신 3건을 HighlightNewsItem으로 변환
// - main: market 무관 전체 통합 / markets: 자기 market 코드가 markets 필드에 포함된 항목만 통합
//   (병합/정렬/포맷/폴백 로직은 완전히 동일 → 내부 헬퍼로 추출해 두 함수가 공유)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유한 각 목록 헬퍼 재사용)
import type { HighlightNewsItem } from "@/types/highlightNews";
import {
  fetchPressList,
  pressDetailHref,
  toPressCard,
  type PressRow,
} from "@/app/company/data/pressData";
import {
  blogDetailHref,
  fetchBlogList,
  toBlogCard,
  type BlogRow,
} from "@/app/company/data/blogData";
import {
  articlesDetailHref,
  fetchArticlesList,
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
    const [pressRes, blogRes, articlesRes] = await Promise.all([
      fetchPressList({ page: 0, market }),
      fetchBlogList({ page: 0, market }),
      fetchArticlesList({ page: 0, market }),
    ]);
    return mergeAndPickTopNews(pressRes.rows, blogRes.rows, articlesRes.rows);
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
