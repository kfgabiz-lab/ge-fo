// Company Articles(slug: articles-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/articles-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - pressData.ts와 완전히 동일 패턴(articles-data엔 press와 마찬가지로 category/hashtag 필드가 없음)
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

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
  description: string; // seo.metaDescription 재사용(설계 2-2)
  date: string; // publishDttm(YYYY-MM-DD) 원본
  imageSrc: string | null; // 미디어 없으면 null → 호출부에서 정적 폴백
}

// ---------------- 순수 가공 헬퍼 ----------------

// 원본 행 → 카드 항목
export function toArticlesCard(item: ArticlesRow): ArticlesCardItem {
  // flattenPageDataItem: articlesForm/seo 섹션 간 키 충돌 없음 → title/publishDttm/image/metaDescription 전부 root로 flat 병합됨
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    description: (row.metaDescription as string) ?? "",
    date: (row.publishDttm as string) ?? "",
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
  sort?: "latest" | "oldest"; // 기본 latest(설계문서 4절 C)
  month?: string; // 게시월 "01"~"12", 연도 무관(설계문서 4절 D)
  year?: string; // 게시연도 "YYYY"(설계문서 4절 D)
}): Promise<ArticlesListResult> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(ARTICLES_LIST_SIZE));
  // 공개 + 게시일 도래(BO 게시상태 판정식과 동일, press-data.md 9-A와 동일 조건)
  sp.set("condexpr_status", "isVisible=001,publishDttm>=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  if (params.search) sp.set("title|content", params.search);
  if (params.month) sp.set("month_publishDttm", params.month);
  if (params.year) sp.set("year_publishDttm", params.year);
  if (params.sort === "oldest") sp.set("sort", "createdAt,asc");

  const res = await fetchApi<ArticlesPageResponse>(
    `/api/v1/fo/page-data/articles-data?${sp.toString()}`,
  );
  return {
    rows: res.content ?? [],
    totalPages: res.totalPages ?? 0,
    page: res.page ?? params.page,
  };
}

// 상세 단건 조회(top-level id 정확일치 + 공개·게시 상태)
export async function fetchArticlesDetail(
  id: string | number,
): Promise<ArticlesRow | null> {
  const sp = new URLSearchParams();
  sp.set("eq_id", String(id));
  sp.set("condexpr_status", "isVisible=001,publishDttm>=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  const res = await fetchApi<ArticlesPageResponse>(
    `/api/v1/fo/page-data/articles-data?${sp.toString()}`,
  );
  return res.content?.[0] ?? null;
}
