// Company Press(slug: press-data) 데이터 조회 헬퍼 + 타입
// - 설계 문서: fo/docs/dev/company/press-data.md
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - blog-data와 동일 패턴이나 press-data엔 category/hashtag 필드가 없어 관련 로직 없음
import { fetchApi } from "@/lib/api";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, type PageDataItem } from "@/lib/pageData";

// 목록 페이지당 개수(설계 4절: Featured 1건 + 리스트 9건 = 페이지당 9건 페이지네이션)
export const PRESS_LIST_SIZE = 9;

// 업로드 미디어 스트리밍 엔드포인트(pressForm.image[0] → page-files)
export const pressImageSrc = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

// 상세 페이지 라우트(id 기반 동적 라우트)
export const pressDetailHref = (id: number) => `/company/press/detail/${id}`;

// ---------------- 응답 원본 타입 ----------------

// page-data 응답 1건. flattenPageDataItem(fo/src/lib/pageData.ts)에 그대로 넘길 수 있는 형태.
// pressForm 필드(title/content/isVisible/publishDttm/image)는 flatten 후 root에서 접근한다.
export type PressRow = PageDataItem;

// Spring Data Page 공통 형태
interface PressPageResponse {
  content: PressRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ---------------- 화면 카드 바인딩용(가공 완료) ----------------

export interface PressCardItem {
  id: number;
  title: string;
  description: string; // seo.meta_description(신)/seo.metaDescription(구) 재사용(설계 2-2)
  date: string; // publishDttm → formatDisplayDate로 변환된 표시용 값("Mon D, YYYY")
  rawDate: string; // publish_dttm 원본 값("YYYY-MM-DD") — 정렬 전용(하이라이트 병합 등), 화면 표시엔 date 사용
  imageSrc: string | null; // 미디어 없으면 null → 호출부에서 정적 폴백
}

// ---------------- 순수 가공 헬퍼 ----------------

// 원본 행 → 카드 항목
export function toPressCard(item: PressRow): PressCardItem {
  // flattenPageDataItem: pressForm/seo 섹션 간 키 충돌 없음 → title/publish_dttm/image/meta_description 전부 root로 flat 병합됨
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  return {
    id: item.id,
    title: (row.title as string) ?? "",
    // 신규(meta_description)/구(metaDescription) seo 스키마 모두 지원 — 신규 우선
    description: (pickField(row, "meta_description", "metaDescription") as string) ?? "",
    // 신규(publish_dttm)/구(publishDttm) 스키마 모두 지원 — 신규 우선. 표시용 "Mon D, YYYY" 포맷 변환
    date: formatDisplayDate(publishDttm),
    rawDate: publishDttm,
    imageSrc: mediaId != null ? pressImageSrc(mediaId) : null,
  };
}

// ---------------- 조회 함수 ----------------

export interface PressListResult {
  rows: PressRow[];
  totalPages: number;
  page: number; // 0-based
}

// 목록 조회(게시 상태 고정 + 검색/정렬/월/연도 필터, 기본 정렬 created_at DESC) — press엔 category 필터 없음
export async function fetchPressList(params: {
  page: number; // 0-based
  search?: string; // 제목+본문 검색어(설계문서 9-B)
  sort?: "latest" | "oldest"; // 기본 latest(설계문서 9-C)
  month?: string; // 게시월 "01"~"12", 연도 무관(설계문서 9-D)
  year?: string; // 게시연도 "YYYY"(설계문서 9-D 확장)
  market?: string; // markets 필터(3자리 코드) — dataJson.markets CSV 토큰 포함 항목만(BE has_markets_markets)
  excludeId?: number | string; // Featured로 노출 중인 항목 id — 목록에서 제외(BE ne_id 부정일치)
}): Promise<PressListResult> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(PRESS_LIST_SIZE));
  // 공개 + 게시일 도래(BO 게시상태 판정식과 동일, 설계문서 9-A) — eq_isVisible 단독 조건을 대체
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  if (params.search) sp.set("title|content", params.search);
  // 필드명이 publishDttm→publish_dttm(snake)로 변경됨. month_/year_는 필드키만(래퍼키 무관, 최상위+중첩 자동탐색)
  if (params.month) sp.set("month_publish_dttm", params.month);
  if (params.year) sp.set("year_publish_dttm", params.year);
  // markets 코드가 넘어온 경우에만 필터 추가(옵션이라 기존 호출부는 그대로 전체 조회)
  if (params.market) sp.set("has_markets_markets", params.market);
  // Featured 항목 제외(넘어온 경우에만) — BE 신규 ne_id 부정일치 파라미터
  if (params.excludeId != null) sp.set("ne_id", String(params.excludeId));
  if (params.sort === "oldest") sp.set("sort", "createdAt,asc");

  const res = await fetchApi<PressPageResponse>(
    `/api/v1/fo/page-data/press-data?${sp.toString()}`,
  );
  return {
    rows: res.content ?? [],
    totalPages: res.totalPages ?? 0,
    page: res.page ?? params.page,
  };
}

// Featured 단건 조회(전역 최신 게시글 1건 고정) — 검색/정렬/월/연도 필터를 전혀 적용하지 않는다.
// 목록 조회(fetchPressList)와 독립적으로 마운트 시 1회만 호출해 페이지 이동/필터 변경과 무관하게 유지.
export async function fetchPressFeatured(): Promise<PressRow | null> {
  const sp = new URLSearchParams();
  sp.set("size", "1");
  sp.set("sort", "press.publish_dttm,desc");
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  const res = await fetchApi<PressPageResponse>(
    `/api/v1/fo/page-data/press-data?${sp.toString()}`,
  );
  return res.content?.[0] ?? null;
}

// 상세 단건 조회(top-level id 정확일치 + 공개·게시 상태, 설계문서 9-A와 동일 조건 적용)
export async function fetchPressDetail(
  id: string | number,
): Promise<PressRow | null> {
  const sp = new URLSearchParams();
  sp.set("eq_id", String(id));
  sp.set("condexpr_status", "is_visible=001,publish_dttm<=today()?'게시':'미게시'");
  sp.set("condval_status", "게시");
  const res = await fetchApi<PressPageResponse>(
    `/api/v1/fo/page-data/press-data?${sp.toString()}`,
  );
  return res.content?.[0] ?? null;
}
