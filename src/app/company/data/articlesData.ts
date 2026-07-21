// Company Articles(slug: articles-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/articles-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - pressData.ts와 완전히 동일 패턴(articles-data엔 press와 마찬가지로 category/hashtag 필드가 없음)
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";

// 목록 페이지당 개수(설계 4절: size=10 페이지네이션)
export const ARTICLES_LIST_SIZE = 10;

// 업로드 미디어 스트리밍 엔드포인트(articlesForm.image[0] → page-files)
export const articlesImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반 동적 라우트)
export const articlesDetailHref = (id: number) => `/company/articles/detail/${id}`;

// ---------------- 응답 원본 타입 ----------------

// page-data 응답 1건. flattenPageDataItem(fo/src/lib/pageData.ts)에 그대로 넘길 수 있는 형태.
// articlesForm 필드(title/content/isVisible/publishDttm/image)는 flatten 후 root에서 접근한다.
export type ArticlesRow = PageDataItem;

// Spring Data Page 공통 형태
interface ArticlesPageResponse {
  content: ArticlesRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ---------------- 화면 카드 바인딩용(가공 완료) ----------------

export interface ArticlesCardItem {
  id: number;
  title: string;
  description: string; // seo.meta_description(신)/seo.metaDescription(구) 재사용(설계 2-2)
  date: string; // publishDttm(YYYY-MM-DD) 원본
  imageSrc: string | null; // 미디어 없으면 null → 호출부에서 정적 폴백
}

// ---------------- 순수 가공 헬퍼 ----------------

// 원본 행 → 카드 항목
export function toArticlesCard(item: ArticlesRow): ArticlesCardItem {
  // flattenPageDataItem: articlesForm/seo 섹션 간 키 충돌 없음 → title/publish_dttm/image/meta_description 전부 root로 flat 병합됨
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    // 신규(meta_description)/구(metaDescription) seo 스키마 모두 지원 — 신규 우선
    description: (pickField(row, "meta_description", "metaDescription") as string) ?? "",
    // 신규(publish_dttm)/구(publishDttm) 스키마 모두 지원 — 신규 우선
    date: (pickField(row, "publish_dttm", "publishDttm") as string) ?? "",
    imageSrc: mediaId != null ? articlesImageSrc(mediaId) : null,
  };
}

// ---------------- 조회 함수 ----------------

export interface ArticlesListResult {
  rows: ArticlesRow[];
  totalPages: number;
  page: number; // 0-based
}

// 목록 조회(게시 상태 고정 + 검색/정렬/월/연도 필터, 기본 정렬 created_at DESC) — articles엔 category 필터 없음
export async function fetchArticlesList(params: {
  page: number; // 0-based
  search?: string; // 제목+본문 검색어(설계문서 4절 B)
  sort?: "latest" | "oldest" | "az" | "za"; // 기본 latest(설계문서 4절 C), az/za는 제목 정렬
  month?: string; // 게시월 "01"~"12", 연도 무관(설계문서 4절 D)
  year?: string; // 게시연도 "YYYY"(설계문서 4절 D)
  market?: string; // markets 필터(3자리 코드) — dataJson.markets CSV 토큰 포함 항목만(BE has_markets_markets)
}): Promise<ArticlesListResult> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(ARTICLES_LIST_SIZE));
  // 공개 + 게시일 도래(BO 게시상태 판정식과 동일, press-data.md 9-A와 동일 조건)
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  if (params.search) sp.set("title|content", params.search);
  // 필드명이 publishDttm→publish_dttm(snake)로 변경됨. month_/year_는 필드키만(래퍼키 무관, 최상위+중첩 자동탐색)
  if (params.month) sp.set("month_publish_dttm", params.month);
  if (params.year) sp.set("year_publish_dttm", params.year);
  // markets 코드가 넘어온 경우에만 필터 추가(옵션이라 기존 호출부는 그대로 전체 조회)
  if (params.market) sp.set("has_markets_markets", params.market);
  // 정렬 분기(latest=미지정은 sort 생략하여 BE 기본 created_at DESC 유지)
  if (params.sort === "oldest") sp.set("sort", "createdAt,asc"); // 오래된순(등록일 오름차순)
  else if (params.sort === "az") sp.set("sort", "articles.title,asc"); // 제목 A-Z(오름차순)
  else if (params.sort === "za") sp.set("sort", "articles.title,desc"); // 제목 Z-A(내림차순)

  const res = await fetchApi<ArticlesPageResponse>(
    `/api/v1/fo/page-data/articles-data?${sp.toString()}`,
  );
  return {
    rows: res.content ?? [],
    totalPages: res.totalPages ?? 0,
    page: res.page ?? params.page,
  };
}

// 상세 단건 조회 — 신규 상세 엔드포인트 GET /{slug}/{id} 사용(목록 search 재활용 방식 폐기)
// - 응답은 기존 목록 content[0]과 동일한 PageDataResponse(ArticlesRow) 단건 형태 → flatten 후처리 그대로 유지
// - 상태게이트(공개+게시일 도래)를 query로 전달, 못 찾거나 게이트 탈락 시 BE가 HTTP 404 → catch→null(page.tsx에서 notFound())
export async function fetchArticlesDetail(
  id: string | number,
): Promise<ArticlesRow | null> {
  const sp = new URLSearchParams();
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  try {
    return await fetchApi<ArticlesRow>(
      `/api/v1/fo/page-data/articles-data/${id}?${sp.toString()}`,
    );
  } catch (e) {
    // 404(미존재/게이트 탈락)만 null 반환, 그 외 오류는 전파
    if (e instanceof Error && e.message.includes("실패: 404")) return null;
    throw e;
  }
}

// ---------------- 인접글(이전/다음) ----------------

// 인접 이웃 1건(신규 adjacent 엔드포인트 응답)
export interface ArticlesAdjacentNeighbor {
  id: number;
  title: string;
}

// adjacent 엔드포인트 응답 {prev, next}
export interface ArticlesAdjacentResult {
  prev: ArticlesAdjacentNeighbor | null;
  next: ArticlesAdjacentNeighbor | null;
}

// 인접글 조회 — 신규 엔드포인트 GET /{slug}/{id}/adjacent 사용(FE 목록 index 계산 방식 폐기)
// - sortField=createdAt, titleField=articles.title, 스코프게이트=목록과 동일(공개+게시일 도래)
export async function fetchArticlesAdjacent(
  id: string | number,
): Promise<ArticlesAdjacentResult> {
  const sp = new URLSearchParams();
  sp.set("sortField", "createdAt");
  sp.set("titleField", "articles.title");
  // 인접 스코프 게이트: 목록(fetchArticlesList)과 동일 게시상태 조건으로 이웃 후보를 한정
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  try {
    return await fetchApi<ArticlesAdjacentResult>(
      `/api/v1/fo/page-data/articles-data/${id}/adjacent?${sp.toString()}`,
    );
  } catch (e) {
    // 404(미존재/게이트 탈락) 시 pager 미표시(상세 본문 렌더는 유지), 그 외 오류는 전파
    if (e instanceof Error && e.message.includes("실패: 404")) {
      return { prev: null, next: null };
    }
    throw e;
  }
}
