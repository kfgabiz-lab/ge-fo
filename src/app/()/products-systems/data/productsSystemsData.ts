// Products & Systems(devices-systems) PageData 연동 헬퍼 + 타입
// - 설계: STEP4 확정(신규 BE 없음). 기존 FoPageDataController + PageDataService.search() 재사용
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - press-data/where-to-buy와 동일 패턴(fetchApi + flattenPageDataItem으로 dataJson 중첩 언랩)
// - 각 page.tsx가 자기 where로 여기 함수를 호출해 데이터를 가져오고, 공용 컴포넌트에 prop 으로 전달한다.
import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";

// 데이터 0건 / 이미지 미입력(파일ID 배열 비어있음) 시 화면이 깨지지 않도록 쓰는 공용 플레이스홀더.
// 별도 자산이 없어 기존 정적 제품 이미지를 재사용한다.
export const PRODUCTS_SYSTEMS_PLACEHOLDER = "/img/main/product_01.jpg";

// Spring Data Page 공통 형태 — content[] 안에 PageData 원본 item
interface PageDataResponse {
  content: PageDataItem[];
  totalElements?: number;
  totalPages?: number;
}

// 파일ID 배열(예: device_systems.image / product_info.image) → 첫 이미지 프록시 URL.
// 값이 없거나 배열이 비어 있으면 null(호출부에서 정적/플레이스홀더 폴백).
// bo-api FoProductGroupService.resolveFirstImageUrl() 와 동일한 형식(/api/v1/fo/page-files/{id}).
export function resolveFirstImageUrl(value: unknown): string | null {
  if (Array.isArray(value) && value.length > 0) {
    const id = value[0];
    if (id !== null && id !== undefined && id !== "") {
      return `/api/v1/fo/page-files/${id}`;
    }
  }
  return null;
}

// slug + 쿼리스트링으로 page-data 조회 → 각 item 을 flatten row 로 변환.
// flatten 후 "category.title" / "product.product_code" 같은 dot notation 키로 접근한다.
async function searchPageData(
  slug: string,
  query: string,
): Promise<Record<string, unknown>[]> {
  const res = await fetchApi<PageDataResponse>(
    `/api/v1/fo/page-data/${slug}?${query}`,
  );
  return (res.content ?? []).map((item) => flattenPageDataItem(item));
}

// ---------------- ① category-data (motor-control · lv-automation/vfd 인트로) ----------------

export interface CategoryHero {
  title: string;
  description: string;
}

// 카테고리 단건(인트로/히어로) 조회. depth 지정 시 eq_category.depth 필터 추가.
export async function fetchCategoryByCode(
  code: string,
  opts?: { depth?: number },
): Promise<CategoryHero | null> {
  try {
    const depthQuery =
      opts?.depth !== undefined ? `eq_category.depth=${opts.depth}&` : "";
    const rows = await searchPageData(
      "category-data",
      `${depthQuery}eq_category.code=${encodeURIComponent(code)}&size=1`,
    );
    const row = rows[0];
    if (!row) return null;
    return {
      title: (row["category.title"] as string) ?? "",
      description: (row["category.description"] as string) ?? "",
    };
  } catch {
    return null;
  }
}

// 카테고리 단건(seo.slug 기준) 조회. 신규 라우트(/products-category, /product-range)에서 slug → 카테고리 레코드 해석에 사용.
// depth 지정 시 eq_category.depth 필터 추가. id/code 를 함께 반환해 하위 조회(children/제품 접두사)에 활용한다.
export interface CategoryRow {
  id: number;
  code: string;
  title: string;
  description: string;
  slug: string;
}

export async function fetchCategoryBySlug(
  slug: string,
  opts?: { depth?: number },
): Promise<CategoryRow | null> {
  try {
    const depthQuery =
      opts?.depth !== undefined ? `eq_category.depth=${opts.depth}&` : "";
    const rows = await searchPageData(
      "category-data",
      `${depthQuery}eq_seo.slug=${encodeURIComponent(slug)}&size=1`,
    );
    const row = rows[0];
    if (!row) return null;
    return {
      id: Number(row._id),
      code: String(row["category.code"] ?? ""),
      title: (row["category.title"] as string) ?? "",
      description: (row["category.description"] as string) ?? "",
      slug: (row["seo.slug"] as string) ?? slug,
    };
  } catch {
    return null;
  }
}

export interface CategoryChild {
  id: number;
  title: string;
  image: string | null;
  slug: string;
}

// depth2 하위 카테고리 카드 목록(motor-control 그리드).
// TEXT 정렬이 깨지므로 서버 sort 대신 FE 에서 Number(sortOrder) 오름차순, 동률은 id 오름차순으로 정렬한다.
// sortOrder는 category 섹션 밖의 최상위 필드(dataJson: { category: {...}, sortOrder: N, ... })라 flatten 후 접두사 없이 접근한다(DB 실측 확인).
export async function fetchCategoryChildren(
  parentId: number,
): Promise<CategoryChild[]> {
  try {
    const rows = await searchPageData(
      "category-data",
      `eq_category.parentId=${parentId}&unpaged=true`,
    );
    const mapped = rows.map((row) => ({
      id: Number(row._id),
      title: (row["category.title"] as string) ?? "",
      image: resolveFirstImageUrl(row["device_systems.image"]),
      slug: (row["seo.slug"] as string) ?? "",
      sortOrder: Number(row["sortOrder"] ?? 0),
    }));
    mapped.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    return mapped.map(({ sortOrder: _sortOrder, ...rest }) => rest);
  } catch {
    return [];
  }
}

// ---------------- ② product-data (lv-automation/vfd 제품 카드) ----------------

export interface CategoryProductCard {
  id: number;
  title: string;
  description: string;
  image: string | null;
  slug: string;
}

// 공개 제품(is_visible=001) 중 product_code 접두사로 클라이언트 필터(eq_ 는 LIKE 미지원).
// product_code 오름차순 정렬.
export async function fetchProductsByCodePrefix(
  prefix: string,
): Promise<CategoryProductCard[]> {
  try {
    const rows = await searchPageData(
      "product-data",
      `eq_product.is_visible=001&unpaged=true`,
    );
    const filtered = rows
      .filter((row) =>
        String(row["product.product_code"] ?? "").startsWith(prefix),
      )
      .map((row) => ({
        id: Number(row._id),
        code: String(row["product.product_code"] ?? ""),
        title: (row["product.product_name"] as string) ?? "",
        description: (row["product_info.info_description"] as string) ?? "",
        image: resolveFirstImageUrl(row["product_info.image"]),
        slug: (row["seo.slug"] as string) ?? "",
      }));
    filtered.sort((a, b) => a.code.localeCompare(b.code));
    return filtered.map(({ code: _code, ...rest }) => rest);
  } catch {
    return [];
  }
}

// ---------------- ③④ product-data 단건(제품상세) ----------------

// seo.slug 정확일치 단건. 중복행이 있으면 첫 행 사용.
export async function fetchProductDetailBySlug(
  slug: string,
): Promise<Record<string, unknown> | null> {
  try {
    const rows = await searchPageData(
      "product-data",
      `eq_seo.slug=${encodeURIComponent(slug)}&size=1`,
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// 신규 라우트(/product, /product-range software 분기)에서 slug 존재 검증/조회에 쓰는 시맨틱 별칭.
// 중복 slug(VFD 6종)는 size=1 로 첫 건만 반환한다(설계 2-1).
export async function fetchProductBySlug(
  slug: string,
): Promise<Record<string, unknown> | null> {
  return fetchProductDetailBySlug(slug);
}

export interface HwProductData {
  name: string; // product.product_name
  description: string; // product.product_description
  image: string | null; // product_info.image
  specs: { title: string; content: string }[]; // product_spec.spec{1..3}_title/_content
  keyFeatures: { title: string; content: string }[]; // key_feature{1..4}.key{N}_title/_content
}

// HW 제품상세 row → 히어로/Key Features 바인딩용 구조로 가공.
export function mapHwProductData(row: Record<string, unknown>): HwProductData {
  const str = (key: string) => (row[key] as string) ?? "";
  const specs = [1, 2, 3]
    .map((n) => ({
      title: str(`product_spec.spec${n}_title`),
      content: str(`product_spec.spec${n}_content`),
    }))
    .filter((s) => s.title || s.content);
  const keyFeatures = [1, 2, 3, 4]
    .map((n) => ({
      title: str(`key_feature${n}.key${n}_title`),
      content: str(`key_feature${n}.key${n}_content`),
    }))
    .filter((f) => f.title || f.content);
  return {
    name: str("product.product_name"),
    description: str("product.product_description"),
    image: resolveFirstImageUrl(row["product_info.image"]),
    specs,
    keyFeatures,
  };
}

// ---------------- ⑤ product-data 전체(explore-all A~Z) ----------------

export interface ProductNameItem {
  id: number;
  name: string;
}

// 전 공개 제품명 목록(A~Z 인덱스용). label = product.product_name.
export async function fetchAllProductNames(): Promise<ProductNameItem[]> {
  try {
    const rows = await searchPageData(
      "product-data",
      `eq_product.is_visible=001&sort=product.product_name,asc&unpaged=true`,
    );
    return rows
      .map((row) => ({
        id: Number(row._id),
        name: (row["product.product_name"] as string) ?? "",
      }))
      .filter((p) => p.name);
  } catch {
    return [];
  }
}
