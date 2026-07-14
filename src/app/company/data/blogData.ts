// Company Blog(slug: blog-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/blog-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

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
  description: string; // seo.metaDescription 재사용(설계 6-10)
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
  // flattenPageDataItem: blogForm/seo 섹션 간 키 충돌 없음 → title/category/hashtag/publishDttm/image/metaDescription 전부 root로 flat 병합됨
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
    description: (row.metaDescription as string) ?? "",
    date: (row.publishDttm as string) ?? "",
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

// 목록 조회(공개글 고정 + 선택 카테고리 필터, 기본 정렬 created_at DESC)
export async function fetchBlogList(params: {
  page: number; // 0-based
  category?: string; // 코드값, 없으면 전체
}): Promise<BlogListResult> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(BLOG_LIST_SIZE));
  // 항상 공개글만(설계 6-11)
  sp.set("eq_blogForm.isVisible", "001");
  if (params.category) sp.set("eq_blogForm.category", params.category);

  const res = await fetchApi<BlogPageResponse>(
    `/api/v1/fo/page-data/blog-data?${sp.toString()}`,
  );
  return {
    rows: res.content ?? [],
    totalPages: res.totalPages ?? 0,
    page: res.page ?? params.page,
  };
}

// 상세 단건 조회(top-level id 정확일치 + 공개글)
export async function fetchBlogDetail(
  id: string | number,
): Promise<BlogRow | null> {
  const res = await fetchApi<BlogPageResponse>(
    `/api/v1/fo/page-data/blog-data?eq_id=${encodeURIComponent(String(id))}&eq_blogForm.isVisible=001`,
  );
  return res.content?.[0] ?? null;
}
