// page-data slug 조회 공통 fetch 함수(fetchData)
// - company 섹션(blog/press/articles/events)의 "조회+매핑" 레이어를 단일 함수로 통합.
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - pageData.ts는 "bo util 순수 포팅"이라 네트워크 코드를 넣지 않는 원칙 → 네트워크 조회는 이 파일에 둔다.
// - BE 변경 없음. 기존 엔드포인트 3종을 그대로 재사용:
//   목록 GET /api/v1/fo/page-data/{slug}
//   단건 GET /api/v1/fo/page-data/{slug}/{id}          ← id는 반드시 PK 엔드포인트로(FO-RULE.md 핵심원칙 7)
//   인접 GET /api/v1/fo/page-data/{slug}/{id}/adjacent
import { fetchApi } from "@/lib/api";
import { commonData, commonEachData, type PageDataItem } from "@/lib/pageData";

// ---------------- 반환 타입 ----------------

// 인접(이전/다음) 이웃 1건 — BE가 이미 {id,title} 경량 형태로 내려줌(flatten 미적용)
export interface AdjacentNeighbor {
  id: number;
  title: string;
}

// 인접 엔드포인트 응답 {prev, next}
export interface AdjacentResult {
  prev: AdjacentNeighbor | null;
  next: AdjacentNeighbor | null;
}

// 목록(Spring Data Page) 응답 — content만 제네릭 변환, 나머지 메타는 응답 그대로
export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// BE 목록 원본 응답
interface RawPageResponse {
  content: PageDataItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ---------------- 파라미터 타입(브랜치별) ----------------

// 세 브랜치 공통 — slug와 where(BE PageDataService.appendWhereConditions 인식 키/값 그대로)
interface FetchDataCommonParams {
  slug: string;
  // BE가 인식하는 URLSearchParams 키/값을 그대로 직렬화(임의 변형/새 문법 금지).
  where?: Record<string, string>;
}

// A) 인접(이전/다음): id + adjacent:true
interface FetchDataAdjacentParams extends FetchDataCommonParams {
  id: string | number;
  adjacent: true;
  sortField?: string; // 이웃 정렬 기준 필드
  titleField?: string; // 이웃 title로 쓸 필드
}

// B) 단건 상세: id(adjacent 아님)
interface FetchDataDetailParams<T> extends FetchDataCommonParams {
  id: string | number;
  adjacent?: false;
  // 후처리 콜백(단건 raw → T). 없으면 commonData(raw) 적용.
  리턴함수?: (raw: PageDataItem) => T;
}

// C) 목록: id 없음
interface FetchDataListParams<T> extends FetchDataCommonParams {
  id?: undefined;
  adjacent?: false;
  page?: number; // 0-based
  size?: number;
  unpaged?: boolean; // 전체조회
  sort?: string; // "field,asc|desc" 문자열 그대로. 없으면 BE 기본 정렬.
  // 후처리 콜백(content 배열 "전체" → 배열). 없으면 commonEachData(content) 적용.
  // ⚠️ 원소별 map이 아니라 배열→배열(events 캘린더 그룹핑 등 전체 변환도 이 안에서).
  리턴함수?: (rows: PageDataItem[]) => T[];
}

// ---------------- fetchData 오버로드 ----------------

// A) 인접(이전/다음) — {prev,next}, 404는 {prev:null,next:null}
export function fetchData(params: FetchDataAdjacentParams): Promise<AdjacentResult>;
// B) 단건 상세 — T|null, 404는 null
export function fetchData<T = Record<string, unknown>>(
  params: FetchDataDetailParams<T>,
): Promise<T | null>;
// C) 목록 — PageResult<T>(에러 삼키지 않고 throw 전파)
export function fetchData<T = Record<string, unknown>>(
  params: FetchDataListParams<T>,
): Promise<PageResult<T>>;

// 구현부(오버로드 union을 런타임 분기)
export async function fetchData(params: {
  slug: string;
  id?: string | number;
  adjacent?: boolean;
  page?: number;
  size?: number;
  unpaged?: boolean;
  where?: Record<string, string>;
  sort?: string;
  sortField?: string;
  titleField?: string;
  리턴함수?:
    | ((raw: PageDataItem) => unknown)
    | ((rows: PageDataItem[]) => unknown[]);
}): Promise<unknown> {
  const {
    slug,
    id,
    adjacent,
    page,
    size,
    unpaged,
    where,
    sort,
    sortField,
    titleField,
    리턴함수,
  } = params;
  const sp = new URLSearchParams();

  // where 직렬화 — 세 브랜치 공통. 임의 변형 없이 그대로 set.
  const appendWhere = () => {
    if (!where) return;
    for (const [k, v] of Object.entries(where)) {
      sp.set(k, v);
    }
  };

  // A) 인접(이전/다음)
  if (id != null && adjacent) {
    if (sortField) sp.set("sortField", sortField);
    if (titleField) sp.set("titleField", titleField);
    appendWhere();
    try {
      // {prev,next}는 이미 {id,title} 경량 형태 → flatten/리턴함수 미적용, 그대로 반환
      return await fetchApi<AdjacentResult>(
        `/api/v1/fo/page-data/${slug}/${id}/adjacent?${sp.toString()}`,
      );
    } catch (e) {
      // 404(미존재/게이트 탈락) 시 pager 미표시, 그 외 오류는 전파
      if (e instanceof Error && e.message.includes("실패: 404")) {
        return { prev: null, next: null };
      }
      throw e;
    }
  }

  // B) 단건 상세 — id는 반드시 PK 엔드포인트로(where에 eq_id 우회 금지)
  if (id != null) {
    appendWhere();
    try {
      const raw = await fetchApi<PageDataItem>(
        `/api/v1/fo/page-data/${slug}/${id}?${sp.toString()}`,
      );
      return 리턴함수
        ? (리턴함수 as (raw: PageDataItem) => unknown)(raw)
        : commonData(raw);
    } catch (e) {
      // 404(미존재/게이트 탈락)만 null 반환, 그 외 오류는 전파
      if (e instanceof Error && e.message.includes("실패: 404")) return null;
      throw e;
    }
  }

  // C) 목록 — page/size/unpaged는 제공된 것만, where 전부, sort 있으면.
  //    에러는 삼키지 않고 throw 전파(404 swallow는 A/B 브랜치만).
  if (page != null) sp.set("page", String(page));
  if (size != null) sp.set("size", String(size));
  if (unpaged != null) sp.set("unpaged", String(unpaged));
  appendWhere();
  if (sort) sp.set("sort", sort);

  const res = await fetchApi<RawPageResponse>(
    `/api/v1/fo/page-data/${slug}?${sp.toString()}`,
  );
  const rawContent = res.content ?? [];
  // 리턴함수는 content 배열 "전체"를 받아 배열을 반환(원소별 map 아님)
  const content = 리턴함수
    ? (리턴함수 as (rows: PageDataItem[]) => unknown[])(rawContent)
    : commonEachData(rawContent);
  return {
    content,
    totalElements: res.totalElements,
    totalPages: res.totalPages,
    page: res.page,
    size: res.size,
  };
}

// ---------------- 조회수(count) 증가 ----------------

// page_data.count 를 +1 하는 write 전용 호출(fire-and-forget).
// - 스펙: docs/pages/page-data/be_page-data_view-count.md
//   POST /api/v1/fo/page-data/{slug}/{id}/view-count → 204 No Content(요청 바디 없음)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지 → fetchApi 경유)
// - fire-and-forget: 결과(204)를 화면에 쓰지 않으며, 실패해도 화면 흐름에 영향 없어야 한다.
//   · 204는 바디가 없어 fetchApi 내부 res.json() 에서 파싱 예외가 나지만, 서버측 +1 은
//     응답 전에 이미 커밋되므로 파싱 예외는 무해 → 아래 catch 로 조용히 삼킨다.
//   · 네트워크/4xx/5xx 실패도 동일하게 catch 로 무시(에러 UI/토스트 없음).
export async function incrementViewCount(
  slug: string,
  id: string | number,
): Promise<void> {
  try {
    await fetchApi<void>(`/api/v1/fo/page-data/${slug}/${id}/view-count`, {
      method: "POST",
    });
  } catch {
    // fire-and-forget: 조회수 증가 실패는 무시
  }
}
