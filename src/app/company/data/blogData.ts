// Company Blog(slug: blog-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/blog-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";

// 목록 페이지당 개수(설계 4절: size=10 페이지네이션)
export const BLOG_LIST_SIZE = 10;

// 업로드 미디어 스트리밍 엔드포인트(blogForm.image[0] → page-files)
export const blogImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반 동적 라우트)
export const blogDetailHref = (id: number) => `/company/blog/detail/${id}`;

// ---------------- 응답 원본 타입 ----------------

// page-data 응답 1건. flattenPageDataItem(fo/src/lib/pageData.ts)에 그대로 넘길 수 있는 형태.
// blogForm 필드(title/content/hashtag/category/isVisible/publishDttm/image)는 flatten 후 root에서 접근한다.
export type BlogRow = PageDataItem;

// Spring Data Page 공통 형태
interface BlogPageResponse {
  content: BlogRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// 코드그룹(BLOGCATEGORY) 응답 항목
export interface CodeItem {
  code: string;
  name: string;
}

// ---------------- 화면 카드 바인딩용(가공 완료) ----------------

export interface BlogCardItem {
  id: number;
  categoryCode: string;
  categoryLabel: string; // BLOGCATEGORY 코드→라벨 변환 결과
  title: string;
  description: string; // seo.meta_description(신)/seo.metaDescription(구) 재사용(설계 6-10)
  date: string; // publishDttm(YYYY-MM-DD) 원본
  imageSrc: string | null; // 미디어 없으면 null → 호출부에서 정적 폴백
  tags: string[]; // hashtag split 결과
}

// ---------------- 순수 가공 헬퍼 ----------------

// hashtag(콤마구분 문자열) → 트림된 배열(빈 값 제거)
export function splitHashtag(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// 코드 목록 → code→name 맵
export function toCategoryMap(codes: CodeItem[]): Map<string, string> {
  return new Map((codes ?? []).map((c) => [c.code, c.name]));
}

// 원본 행 → 카드 항목(코드→라벨 변환은 categoryMap 사용)
export function toBlogCard(
  item: BlogRow,
  categoryMap: Map<string, string>,
): BlogCardItem {
  // flattenPageDataItem: blogForm/seo 섹션 간 키 충돌 없음 → title/category/hashtag/publish_dttm/image/meta_description 전부 root로 flat 병합됨
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const code = (row.category as string) ?? "";
  return {
    id: item.id,
    categoryCode: code,
    // 코드 매칭 실패 시 원본 코드값 유지(빈 값보다 정보 손실 적음)
    categoryLabel: categoryMap.get(code) ?? code,
    title: (row.title as string) ?? "",
    // 신규(meta_description)/구(metaDescription) seo 스키마 모두 지원 — 신규 우선
    description: (pickField(row, "meta_description", "metaDescription") as string) ?? "",
    // 신규(publish_dttm)/구(publishDttm) 스키마 모두 지원 — 신규 우선
    date: (pickField(row, "publish_dttm", "publishDttm") as string) ?? "",
    imageSrc: mediaId != null ? blogImageSrc(mediaId) : null,
    tags: splitHashtag(row.hashtag as string | undefined),
  };
}

// ---------------- 조회 함수 ----------------

// 카테고리 라벨용 코드그룹 조회
export async function fetchBlogCategories(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/BLOGCATEGORY");
}

export interface BlogListResult {
  rows: BlogRow[];
  totalPages: number;
  page: number; // 0-based
}

// 목록 조회(게시 상태 고정 + 카테고리/검색/정렬/월/연도 필터, 기본 정렬 created_at DESC)
export async function fetchBlogList(params: {
  page: number; // 0-based
  category?: string; // 코드값, 없으면 전체
  search?: string; // 제목+본문 검색어(설계문서 9-B)
  sort?: "latest" | "oldest"; // 기본 latest(설계문서 9-C)
  month?: string; // 게시월 "01"~"12", 연도 무관(설계문서 9-D)
  year?: string; // 게시연도 "YYYY"(설계문서 9-D 확장)
  market?: string; // markets 필터(3자리 코드) — dataJson.markets CSV 토큰 포함 항목만(BE has_markets_markets)
}): Promise<BlogListResult> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(BLOG_LIST_SIZE));
  // 공개 + 게시일 도래(BO 게시상태 판정식과 동일, 설계문서 9-A) — eq_isVisible 단독 조건을 대체
  sp.set("condexpr_status", "is_visible=001,publish_dttm>=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  // page_template(blog-basicInfo) contentKey가 blogForm→blog로 변경됨. dot-notation eq_는 래퍼키 정확일치 필요(BE PageDataService.appendWhereConditions eq_ dot 경로)
  if (params.category) sp.set("eq_blog.category", params.category);
  if (params.search) sp.set("title|content", params.search);
  // month_/year_는 필드키만(래퍼키 무관, 최상위+중첩 자동탐색). 필드명이 publishDttm→publish_dttm(snake)로 변경됨
  if (params.month) sp.set("month_publish_dttm", params.month);
  if (params.year) sp.set("year_publish_dttm", params.year);
  // markets 코드가 넘어온 경우에만 필터 추가(옵션이라 기존 호출부는 그대로 전체 조회)
  if (params.market) sp.set("has_markets_markets", params.market);
  if (params.sort === "oldest") sp.set("sort", "createdAt,asc");

  const res = await fetchApi<BlogPageResponse>(
    `/api/v1/fo/page-data/blog-data?${sp.toString()}`,
  );
  return {
    rows: res.content ?? [],
    totalPages: res.totalPages ?? 0,
    page: res.page ?? params.page,
  };
}

// 상세 단건 조회(top-level id 정확일치 + 공개·게시 상태, 설계문서 9-A와 동일 조건 적용)
export async function fetchBlogDetail(
  id: string | number,
): Promise<BlogRow | null> {
  const sp = new URLSearchParams();
  sp.set("eq_id", String(id));
  sp.set("condexpr_status", "is_visible=001,publish_dttm>=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  const res = await fetchApi<BlogPageResponse>(
    `/api/v1/fo/page-data/blog-data?${sp.toString()}`,
  );
  return res.content?.[0] ?? null;
}
