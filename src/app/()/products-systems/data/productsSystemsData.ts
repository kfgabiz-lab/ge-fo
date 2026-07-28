// Products & Systems(devices-systems) PageData 연동 헬퍼 + 타입
// - 설계: STEP4 확정(신규 BE 없음). 기존 FoPageDataController + PageDataService.search() 재사용
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - press-data/where-to-buy와 동일 패턴(fetchData + flattenPageDataItem으로 dataJson 중첩 언랩)
// - 각 page.tsx가 자기 where로 여기 함수를 호출해 데이터를 가져오고, 공용 컴포넌트에 prop 으로 전달한다.
import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem } from "@/lib/pageData";
import type { CommonFaqEntry } from "@/components/faq/CommonFaq";
import {
  fetchDevicesTreeRows,
  type DevicesTreeRow,
} from "@/data/gnb/devicesTree";
// 카테고리 컨텍스트(?category=) 부착 — 중복 slug 해소용 공용 헬퍼(src/lib/navigation/categoryContext.ts).
import { withCategoryContext } from "@/lib/navigation/categoryContext";
import type { ProductOtherItem } from "./productDetailContent";
import type { DevicesProductItem } from "./motorControlContent";
import type { DevicesCategoryProduct } from "./vfdContent";

// 데이터 0건 / 이미지 미입력(파일ID 배열 비어있음) 시 화면이 깨지지 않도록 쓰는 공용 플레이스홀더.
// 별도 자산이 없어 기존 정적 제품 이미지를 재사용한다.
export const PRODUCTS_SYSTEMS_PLACEHOLDER = "/img/main/product_01.jpg";

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

// 파일ID 배열의 JSON "텍스트"(예: "[542]") → 첫 이미지 프록시 URL. 값/파싱 실패 시 null.
// BE 전용 엔드포인트들(devices-tree junction의 productImage, categories/{id}/lv2 의 image)이
// 배열을 파싱하지 않고 원문 텍스트 그대로 내려주기 때문에 공통으로 쓴다(내부에서 resolveFirstImageUrl 재사용).
function resolveImageUrlFromJsonText(value: string | null): string | null {
  if (!value) return null;
  try {
    return resolveFirstImageUrl(JSON.parse(value));
  } catch {
    return null;
  }
}

// ---------------- ① category-data (motor-control · lv-automation/vfd 인트로) ----------------

// 카테고리 단건(seo.slug 기준) 조회. 신규 라우트(/products-category, /product-range)에서 slug → 카테고리 레코드 해석에 사용.
// depth 지정 시 eq_category.depth 필터 추가. id/code 를 함께 반환해 하위 조회(children/제품 접두사)에 활용한다.
export interface CategoryRow {
  id: number;
  code: string;
  title: string;
  description: string;
  slug: string;
  // SEO(설계 5절) — generateMetadata 용. 미입력이면 빈 문자열이며 폴백(정적 기본 타이틀/설명)은 두지 않는다.
  // 기존 호출부 하위호환을 위해 옵셔널.
  metaTitle?: string;
  metaDescription?: string;
}

// flat row → CategoryRow 매핑. slug 조회 경로와 PK 조회 경로가 같은 규칙을 쓰도록 분리했다.
function toCategoryRow(row: Record<string, unknown>, slug: string): CategoryRow {
  return {
    id: Number(row._id),
    code: String(row["category.code"] ?? ""),
    title: (row["category.title"] as string) ?? "",
    // 관리자가 "카테고리 설명"으로 입력하는 실제 필드는 device_systems.description 이다
    // (bo 템플릿 category1-DeviceSystems / category2-DeviceSystems, contentKey=device_systems, fieldKey=description).
    // category.description 은 어떤 템플릿도 채우지 않는 값이라 폴백으로도 쓰지 않는다(빈 값이면 빈 값 그대로 노출).
    description: (row["device_systems.description"] as string) ?? "",
    slug: (row["seo.slug"] as string) ?? slug,
    // seo.meta_title / seo.meta_description 은 스네이크케이스가 실제 저장 필드명(설계 5절 실데이터 확인).
    metaTitle: (row["seo.meta_title"] as string) ?? "",
    metaDescription: (row["seo.meta_description"] as string) ?? "",
  };
}

// category-data 단건을 PK 로 조회(GET /api/v1/fo/page-data/category-data/{id}).
// ⚠️ 목록 where 에 eq_id 를 넣는 우회는 금지다(pageDataApi.ts 규칙).
//    실제로 category-data 는 eq_ 조건이 중첩 객체까지 훑어서, 연결행의 data_json.product.id 가
//    걸려버리는 오탐이 발생한다(BE 실측 확인) — PK 엔드포인트만 정확하다.
// 미존재/slug 불일치는 BE 가 404 → fetchData 가 null 로 변환한다.
async function fetchCategoryById(
  categoryId: number,
): Promise<Record<string, unknown> | null> {
  try {
    return await fetchData<Record<string, unknown>>({
      slug: "category-data",
      id: categoryId,
      리턴함수: (raw) => flattenPageDataItem(raw),
    });
  } catch {
    return null;
  }
}

export async function fetchCategoryBySlug(
  slug: string,
  opts?: { depth?: number; categoryId?: number },
): Promise<CategoryRow | null> {
  try {
    // ⓐ 카테고리 컨텍스트(?category={Lv2 id})가 있으면 PK 단건으로 그 카테고리를 정확히 집는다.
    //    단, 요청 slug/depth 와 실제로 일치할 때만 채택한다 — 파라미터가 조작·변질됐을 때
    //    엉뚱한 카테고리로 튀지 않게 하는 안전장치이자, 이 경로로 조회되는 대상이 항상
    //    slug 조회로도 도달 가능한 범위 안에 머물게 하는 조건이다.
    //    불일치하면 아무 일도 없었던 것처럼 ⓑ(기존 slug 조회)로 폴백한다.
    if (opts?.categoryId !== undefined) {
      const row = await fetchCategoryById(opts.categoryId);
      const slugMatched = row?.["seo.slug"] === slug;
      const depthMatched =
        opts.depth === undefined ||
        row?.["category.depth"] === String(opts.depth);
      if (row && slugMatched && depthMatched) return toCategoryRow(row, slug);
    }

    // ⓑ 기존 경로 — slug(+depth)로 단건 조회. 중복 slug 면 첫 건이 잡힌다(하위호환 유지).
    // where 조립 — depth 옵션 지정 시에만 eq_category.depth 추가(직렬화는 fetchData 내부 URLSearchParams가 담당).
    const where: Record<string, string> = { "eq_seo.slug": slug };
    if (opts?.depth !== undefined) where["eq_category.depth"] = String(opts.depth);
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where,
      size: 1,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const row = res.content[0] ?? null;
    if (!row) return null;
    return toCategoryRow(row, slug);
  } catch {
    return null;
  }
}

export interface CategoryChild {
  id: number;
  code: string;
  title: string;
  image: string | null;
  slug: string;
}

// depth2 하위 카테고리 카드 목록(motor-control 그리드) — GNB devices 메가메뉴 depth2에도 재사용.
// TEXT 정렬이 깨지므로 서버 sort 대신 FE 에서 Number(sortOrder) 오름차순, 동률은 id 오름차순으로 정렬한다.
// sortOrder는 category 섹션 밖의 최상위 필드(dataJson: { category: {...}, sortOrder: N, ... })라 flatten 후 접두사 없이 접근한다(DB 실측 확인).
export async function fetchCategoryChildren(
  parentId: number,
): Promise<CategoryChild[]> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "eq_category.parentId": String(parentId) },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const mapped = res.content.map((row) => ({
      id: Number(row._id),
      code: String(row["category.code"] ?? ""),
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

// Lv1 랜딩(products-category/[slug])의 "노출가능 Lv2" 카드 목록 — 서버 필터(BE 전용 엔드포인트).
// BE `GET /api/v1/fo/categories/{categoryId}/lv2`가 아래를 전부 서버에서 처리한다(설계 3·4절):
//  - category.parentId={categoryId} AND depth=2 AND is_visible='001'
//  - EXISTS: 하위 depth3 junction이 가리키는 product-data 가 is_visible='001' AND order_status='01'
//  - sortOrder 숫자 오름차순(NULLS LAST), 동률 시 id 오름차순
// 위 4조건/숫자정렬은 제네릭 page-data search()로 표현할 수 없어(다른 slug 레코드 조인) 전용 API를 쓴다.
// 기존 fetchCategoryChildren(parentId 단일조건)은 techHubData.ts가 계속 쓰므로 그대로 둔다.
// 실패 시 빈 배열 → 카드 0개(그리드 컨테이너는 유지, 정적 폴백 금지).
interface CategoryLv2Row {
  id: number;
  title: string;
  slug: string;
  image: string | null; // 파일ID 배열의 JSON 텍스트("[542]") 또는 null
}

export async function fetchVisibleLv2Categories(
  categoryId: number,
): Promise<DevicesProductItem[]> {
  try {
    const rows = await fetchApi<CategoryLv2Row[]>(
      `/api/v1/fo/categories/${categoryId}/lv2`,
    );
    return rows.map((row) => ({
      id: String(row.id),
      // slug 없으면 링크 비활성("") — 카드 자체는 노출한다.
      // 중복 slug 대비로 이 카드가 가리키는 Lv2 의 고유 id 를 컨텍스트로 실어 보낸다(row.id = category-data PK).
      href: withCategoryContext(row.slug ? `/product-range/${row.slug}` : "", row.id),
      image: resolveImageUrlFromJsonText(row.image),
      title: row.title ?? "",
    }));
  } catch {
    return [];
  }
}

// Lv2 랜딩(product-range/[slug])의 제품 카드 목록 — 서버 필터(BE 전용 엔드포인트).
// BE `GET /api/v1/fo/categories/{categoryId}/products`가 아래를 전부 서버에서 처리한다(설계 3·4절):
//  - 해당 Lv2 하위 depth3 연결행(category-data)이 가리키는 product-data 만 대상
//    (구 방식이던 product_code 접두사 매칭은 폐기 — 코드 체계와 무관하게 맵핑 관계로만 판정)
//  - product-data 가 is_visible='001' AND order_status='01'
//  - 연결행 sortOrder 숫자 오름차순(NULLS LAST), 동률 시 제품 id 오름차순
// 실패 시 빈 배열 → 카드 0개(리스트 컨테이너/인트로는 그대로 유지, 정적 폴백 금지).
interface CategoryProductRow {
  id: number;
  productName: string | null;
  image: string | null; // 파일ID 배열의 JSON 텍스트("[506]") 또는 null
  infoDescription: string | null;
  slug: string | null;
  awards: string | null; // product.awards ("01"=iF Design Awards, ""/null=미수상) — 카드 배지 판정용(기획서 9번)
}

export async function fetchCategoryLv2Products(
  categoryId: number,
): Promise<DevicesCategoryProduct[]> {
  try {
    const rows = await fetchApi<CategoryProductRow[]>(
      `/api/v1/fo/categories/${categoryId}/products`,
    );
    return rows.map((row) => ({
      id: String(row.id),
      // slug 없으면 링크 비활성("") — 카드 자체는 노출한다(fetchVisibleLv2Categories와 동일 정책).
      // 이 목록은 categoryId(Lv2) 소속 제품이므로 그 id 를 컨텍스트로 실어 중복 slug 제품을 확정한다.
      href: withCategoryContext(row.slug ? `/product/${row.slug}` : "", categoryId),
      image: resolveImageUrlFromJsonText(row.image),
      title: row.productName ?? "",
      description: row.infoDescription ?? "",
      // 배지(기획서 9번): product.awards === "01"(iF Design Awards)이면 type2(정사각 sm) 배지 노출.
      // fetchProductLv2Context와 동일하게 데이터 계층에서 awards 코드값을 퍼블리싱 배지 레벨로 변환한다.
      badges: row.awards === "01" ? (2 as const) : undefined,
    }));
  } catch {
    return [];
  }
}

export interface TopCategory {
  id: number;
  code: string;
  title: string;
  slug: string;
}

// depth1 전체(대분류 목록) — GNB devices 메가메뉴 depth1 조립에 사용.
// depth2(fetchCategoryChildren)와 동일하게 FE에서 sortOrder ASC(동률 id ASC) 정렬한다(서버 sort 파라미터로는 TEXT/숫자 정렬이 깨짐).
export async function fetchTopCategories(): Promise<TopCategory[]> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "category-data",
      where: { "eq_category.depth": "1" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const mapped = res.content.map((row) => ({
      id: Number(row._id),
      code: String(row["category.code"] ?? ""),
      title: (row["category.title"] as string) ?? "",
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

interface CategoryProductCardWithCode extends CategoryProductCard {
  code: string;
}

// 공개 제품(is_visible=001) 전체 1회 조회(product_code 접두사 필터 없음, DB 왕복 최소화용).
// GNB 메가메뉴처럼 여러 prefix로 반복 필터링해야 하는 호출부는 이 함수를 1번만 불러서
// filterProductsByCodePrefix로 메모리에서 나눠 써야 한다(반복 fetch 금지).
export async function fetchAllVisibleProducts(): Promise<
  CategoryProductCardWithCode[]
> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "product-data",
      where: { "eq_product.is_visible": "001" },
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    const products = res.content.map((row) => ({
      id: Number(row._id),
      code: String(row["product.product_code"] ?? ""),
      title: (row["product.product_name"] as string) ?? "",
      description: (row["product_info.info_description"] as string) ?? "",
      image: resolveFirstImageUrl(row["product_info.image"]),
      slug: (row["seo.slug"] as string) ?? "",
    }));
    products.sort((a, b) => a.code.localeCompare(b.code));
    return products;
  } catch {
    return [];
  }
}

// 이미 조회된 제품 목록(fetchAllVisibleProducts 결과)을 product_code 접두사로 메모리 필터(eq_ 는 LIKE 미지원).
export function filterProductsByCodePrefix(
  products: CategoryProductCardWithCode[],
  prefix: string,
): CategoryProductCard[] {
  return products
    .filter((p) => p.code.startsWith(prefix))
    .map(({ code: _code, ...rest }) => rest);
}

// 단일 prefix만 필요한 호출부용 — 내부적으로 fetchAllVisibleProducts 1회 + 메모리 필터.
// 여러 prefix를 반복 조회해야 하면(예: GNB 메가메뉴) 이 함수 대신 fetchAllVisibleProducts를
// 1번만 불러서 filterProductsByCodePrefix로 나눠 쓸 것 — 반복 호출 시 그때마다 전체 재조회됨.
export async function fetchProductsByCodePrefix(
  prefix: string,
): Promise<CategoryProductCard[]> {
  const all = await fetchAllVisibleProducts();
  return filterProductsByCodePrefix(all, prefix);
}

// ---------------- ③④ product-data 단건(제품상세) ----------------

// page_type === "SW" 이면서 전용 구성을 가진 제품 slug 목록(SW 4종).
// 렌더러(SwProductDetail)와 조회(fetchProductDetailBySlug)가 같은 목록을 봐야 해서 데이터 계층에 둔다.
// (컴포넌트 파일에 두고 여기서 import 하면 순환 참조 + CSS/컴포넌트가 데이터 모듈 그래프에 끌려온다.)
// SwProductDetail.tsx 가 이 상수를 재수출하므로 기존 import 경로도 그대로 유효하다.
export const SW_PRODUCT_SLUGS = [
  "scada",
  "xems",
  "micro-grid",
  "smart-factory",
] as const;

function isSwProductSlug(slug: string): boolean {
  return (SW_PRODUCT_SLUGS as readonly string[]).includes(slug);
}

// seo.slug 정확일치 단건. 중복행이 있으면 첫 행 사용.
// ⚠️ SW 4종 slug 한정 예외: 같은 slug 로 page_type 이 없는 행이 함께 존재할 때
//    기본 정렬(created_at DESC)상 나중에 만들어진 비-SW 행이 먼저 잡혀
//    ProductDetailRouter 가 SW 렌더러 대신 HW 제네릭으로 빠지는 문제가 있다.
//    → 이 4개 slug 는 eq_page_type=SW 를 함께 걸어 SW 행을 우선 조회하고,
//      없을 때만 기존 조회로 폴백한다(HW 66종 경로는 그대로, 조건 자체가 붙지 않는다).
export async function fetchProductDetailBySlug(
  slug: string,
): Promise<Record<string, unknown> | null> {
  try {
    if (isSwProductSlug(slug)) {
      const swRes = await fetchData<Record<string, unknown>>({
        slug: "product-data",
        // eq_ 는 AND 결합(BE PageDataService.appendWhereConditions) → slug 일치 + page_type=SW
        where: { "eq_seo.slug": slug, eq_page_type: "SW" },
        size: 1,
        리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
      });
      const swRow = swRes.content[0];
      if (swRow) return swRow;
    }

    const res = await fetchData<Record<string, unknown>>({
      slug: "product-data",
      where: { "eq_seo.slug": slug },
      size: 1,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    return res.content[0] ?? null;
  } catch {
    return null;
  }
}

// product-data 단건을 PK 로 조회(GET /api/v1/fo/page-data/product-data/{id}).
// BE 가 data_slug 와 id 를 함께 검증하므로 짝이 안 맞으면 404 → null.
async function fetchProductDetailById(
  productId: number,
): Promise<Record<string, unknown> | null> {
  try {
    return await fetchData<Record<string, unknown>>({
      slug: "product-data",
      id: productId,
      리턴함수: (raw) => flattenPageDataItem(raw),
    });
  } catch {
    return null;
  }
}

// (Lv2 카테고리 id + 제품 slug) → 제품 id. 소스는 devices-tree(GNB 메가메뉴·Other Products와 동일 엔드포인트).
// 제품↔카테고리 연결은 별도 junction 테이블이 아니라 category-data 의 depth3 "연결행"으로 표현되고,
// devices-tree 의 depth3 행이 그 연결행을 그대로 펼쳐 parentId(=Lv2 category-data id) ·
// productId(=product-data id) · productSlug 를 한 행에 담아준다(BE 쿼리 실측 확인).
// → 링크를 만든 세 지점(GNB · 카테고리 제품카드 · Other Products)이 전부 이 트리에서 파생되므로
//   해석 소스를 하나로 통일한다(신규 BE 엔드포인트 불필요).
// 같은 Lv2 안에 같은 slug 제품이 둘 이상이면 카테고리 컨텍스트로도 구분이 불가능하므로 첫 행을 쓴다
// (기존 "첫 건" 정책과 동일. 현재 데이터에선 비공개 테스트 카테고리 1건만 해당).
async function resolveProductIdInCategory(
  slug: string,
  categoryId: number,
): Promise<number | null> {
  const rows = await fetchDevicesTreeRows(); // 실패 시 [] (내부에서 catch)
  const matched = rows.find(
    (row) =>
      row.depth === "3" &&
      row.parentId === String(categoryId) &&
      row.productSlug === slug &&
      row.productId != null,
  );
  return matched?.productId ?? null;
}

// 신규 라우트(/product, /product-range software 분기)에서 slug 존재 검증/조회에 쓰는 진입점.
// - categoryId(카테고리 컨텍스트)가 있으면 그 Lv2 에 실제로 맵핑된 제품을 정확히 집는다.
// - 컨텍스트가 없거나 해석에 실패하면 기존과 동일하게 slug 첫 건을 반환한다(설계 2-1, 하위호환).
export async function fetchProductBySlug(
  slug: string,
  opts?: { categoryId?: number },
): Promise<Record<string, unknown> | null> {
  if (opts?.categoryId !== undefined) {
    const productId = await resolveProductIdInCategory(slug, opts.categoryId);
    if (productId != null) {
      const row = await fetchProductDetailById(productId);
      // slug 재확인 — 트리 조회와 단건 조회 사이의 데이터 변경 등으로 어긋나면 폴백한다.
      if (row && row["seo.slug"] === slug) return row;
    }
  }
  return fetchProductDetailBySlug(slug);
}

// 제품 slug → 그 제품이 속한 Lv2 category-data id.
// 제품 단건은 "컨텍스트 없을 때 본문이 고르는 그 레코드"(slug 첫 건)를 그대로 쓰고,
// 소속 Lv2 는 devices-tree depth3 연결행의 parentId 로 얻는다(복수 소속이면 트리 정렬상 첫 번째).
async function resolveLv2IdOfProductSlug(slug: string): Promise<number | null> {
  const row = await fetchProductDetailBySlug(slug);
  const productId = row ? Number(row._id) : Number.NaN;
  if (!Number.isInteger(productId)) return null;
  const rows = await fetchDevicesTreeRows();
  const matched = rows.find(
    (r) => r.depth === "3" && r.productId === productId && r.parentId,
  );
  const parentId = Number(matched?.parentId);
  return Number.isInteger(parentId) && parentId > 0 ? parentId : null;
}

// 컨텍스트 없는 진입(?category= 없음)에서 "본문이 실제로 렌더한 레코드"가 속한 Lv2 category-data id.
//
// 왜 필요한가: 브레드크럼은 레이아웃(헤더)에 있어 페이지가 조회한 결과를 받을 수 없고, GNB 트리에서
//   slug 로 독립적으로 첫 매칭을 찾는다. 그런데 트리의 "첫 번째"(sortOrder 순)와 데이터 조회의
//   "첫 건"(API 반환 순)이 서로 달라, 같은 slug 가 중복된 항목에서 본문과 브레드크럼이 서로 다른
//   카테고리를 가리켰다(예: /product/s100 본문은 607 소속 1725 인데 브레드크럼은 587 LV).
//   → 레이아웃이 본문과 "동일한 조회"를 수행해 같은 레코드를 고르고, 그 소속 Lv2 를 브레드크럼에 넘긴다.
//
// 비용: 페이지가 부르는 함수/인자와 완전히 동일하므로 요청당 fetch memoization 으로 재사용된다(추가 왕복 없음).
// 해석 불가(미존재 slug, Lv2 연결 없음)면 null → 브레드크럼은 기존 slug 첫 매칭으로 동작(하위호환).
export async function resolveFallbackCategoryId(
  pathname: string,
): Promise<number | null> {
  try {
    const rangeMatch = pathname.match(/^\/product-range\/([^/]+)$/);
    if (rangeMatch) {
      const slug = decodeURIComponent(rangeMatch[1]);
      // 라우트와 동일한 우선순위: depth2 카테고리 우선, 없으면 제품(SW 상세) 폴백.
      const category = await fetchCategoryBySlug(slug, { depth: 2 });
      if (category) return category.id;
      return await resolveLv2IdOfProductSlug(slug);
    }

    const productMatch = pathname.match(/^\/product\/([^/]+)$/);
    if (productMatch) {
      return await resolveLv2IdOfProductSlug(decodeURIComponent(productMatch[1]));
    }

    return null;
  } catch {
    return null;
  }
}

export interface HwProductData {
  name: string; // product.product_name
  description: string; // product.product_description
  image: string | null; // product_info.image
  specs: { title: string; content: string }[]; // product_spec.spec{1..3}_title/_content
  keyFeatures: { title: string; content: string }[]; // key_feature{1..4}.key{N}_title/_content
  video: string; // product_etc.video (YouTube URL) — 상세 병합 시 id로 변환
  connectPortal: string; // product_etc.connect_portal (Configurator 링크)
  lineUp: string; // product_etc.line_up (리치텍스트 HTML, 그대로 렌더)
  awards: string; // product.awards ("01"=iF Design Awards, ""=미수상) — 히어로 로고/문구(8번) + 카드 배지(32번)
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
    video: str("product_etc.video"),
    connectPortal: str("product_etc.connect_portal"),
    lineUp: str("product_etc.line_up"),
    awards: str("product.awards"),
  };
}

// ---------------- ⑥ faq-data (제품상세 FAQ) ----------------

// 제품상세 FAQ 목록 조회. main_category=001(제품) + product={productId} + is_visible=001(공개).
// 신규 BE 없음 — 공통 fetchData(목록 브랜치) 재사용. markets faq 매핑 패턴과 동일.
// 조회 실패/빈 응답 시 빈 배열 → 호출부(GenericProductDetail)에서 정적 템플릿 FAQ로 폴백.
export async function fetchProductFaqItems(
  productId: number,
): Promise<CommonFaqEntry[]> {
  try {
    const res = await fetchData<CommonFaqEntry>({
      slug: "faq-data",
      where: {
        eq_main_category: "001",
        eq_product: String(productId),
        eq_is_visible: "001",
      },
      sort: "id,asc",
      size: 100,
      // fetchData 목록 브랜치는 raw PageDataItem[]을 넘기므로 flatten 후 root 필드 접근(markets 패턴 동일)
      리턴함수: (rows) =>
        rows.map((item) => {
          const row = flattenPageDataItem(item);
          return {
            question: (row.question as string) ?? "",
            answer: (row.answer as string) ?? "",
          };
        }),
    });
    return res.content;
  } catch {
    return [];
  }
}

// ---------------- ⑤ product-data 전체(explore-all A~Z) ----------------

export interface ProductNameItem {
  id: number;
  name: string;
  // 주문 상태 원본값(product.order_status). "99"=단종(Discontinued) 판정용.
  // where 필터에는 쓰지 않는다(단종 제품도 목록엔 나오되 표기만 달라짐) — is_visible='001'만 서버 필터.
  orderStatus: string;
}

// 전 공개 제품명 목록(A~Z 인덱스용). label = product.product_name.
// order_status는 필터가 아닌 파생 표기(단종)용 필드로만 함께 반환한다.
export async function fetchAllProductNames(): Promise<ProductNameItem[]> {
  try {
    const res = await fetchData<Record<string, unknown>>({
      slug: "product-data",
      where: { "eq_product.is_visible": "001" },
      sort: "product.product_name,asc",
      unpaged: true,
      리턴함수: (rows) => rows.map((item) => flattenPageDataItem(item)),
    });
    return res.content
      .map((row) => ({
        id: Number(row._id),
        name: (row["product.product_name"] as string) ?? "",
        orderStatus: (row["product.order_status"] as string) ?? "",
      }))
      .filter((p) => p.name);
  } catch {
    return [];
  }
}

// ---------------- ⑦ Other Products(동일 Lv2 소속 다른 제품) — devices-tree(GNB와 동일 소스) 재사용 ----------------

// 공개 제품 id→awards 맵(Other Products 카드 Design Awards 배지 판정용, 32번).
// devices-tree 응답에는 awards 필드가 없어(name/desc/slug/image만 내려옴) product-data를 1회 조회해 보강한다.
async function fetchProductAwardsMap(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const res = await fetchData<{ id: number; awards: string }>({
      slug: "product-data",
      where: { "eq_product.is_visible": "001" },
      unpaged: true,
      리턴함수: (rows) =>
        rows.map((item) => {
          const row = flattenPageDataItem(item);
          return {
            id: Number(row._id),
            awards: (row["product.awards"] as string) ?? "",
          };
        }),
    });
    for (const p of res.content) map.set(p.id, p.awards);
  } catch {
    // 조회 실패 시 배지 없이 진행(빈 맵)
  }
  return map;
}

// ---------------- ⑧ 제품 담당자 이메일(제품 담당 배너, 11~13) — 서버 필터(BE) ----------------

// 제품에 맵핑된 담당자 이메일 조회. BE `GET /api/v1/fo/products/{id}/manager-email`가
// productManager-data.ms 배열에 productId 포함 + is_visible=001로 서버 필터(전량조회 금지).
// 매칭 담당자 없으면 "" 반환 → 호출부에서 CommonBanner02 expert에 contactEmail=""로 넘겨
// 축약형 배너(이메일/복사 미노출, "Send an Inquiry"만) 처리(공용 컴포넌트 수정 없이 기존 조건부 활용).
export async function fetchProductManagerEmail(productId: number): Promise<string> {
  try {
    const res = await fetchApi<{ email: string | null }>(
      `/api/v1/fo/products/${productId}/manager-email`,
    );
    return res.email ?? "";
  } catch {
    return "";
  }
}

// 제품상세(/product/[slug])에서 "현재 제품이 속한 Lv2" 한 번의 devices-tree 조회로 파생되는 값 묶음.
// - lv2Name: 히어로 카테고리 라벨(기획서 4번) + Other Products 섹션 제목(기획서 3번)에 공통으로 쓰인다.
//            같은 값을 두 곳에서 각각 계산하면 devices-tree 를 중복 조회하게 되므로 한 번에 묶어서 반환한다.
// - otherProducts: 동일 Lv2 소속 다른 제품 카드 목록(31번).
// 현재 제품이 속한 Lv2(page_data id) 집합 — devices-tree 의 depth3 junction 행에서 parentId 수집.
function collectProductLv2Ids(
  rows: DevicesTreeRow[],
  currentProductId: number,
): Set<string> {
  return new Set(
    rows
      .filter((r) => r.depth === "3" && r.productId === currentProductId)
      .map((r) => r.parentId)
      .filter((p): p is string => p != null && p !== ""),
  );
}

// Lv2 이름 1개 추출 — depth2 행에서 rowId 매칭(BE 가 depth·sortOrder·id ASC 로 내려주므로 첫 매칭이 곧 상위 노출 Lv2).
// ⚠️ 트리에 depth2 행으로 내려오지 않는 parentId(메뉴 미노출 카테고리 등)는 자연히 건너뛴다.
//    junction 만 남아 있는 카테고리가 대표 이름으로 잡히지 않게 하는 것이 이 방식의 핵심이다.
function pickLv2NameFromTreeRows(
  rows: DevicesTreeRow[],
  myLv2: Set<string>,
): string {
  return (
    rows.find(
      (r) =>
        r.depth === "2" &&
        r.rowId != null &&
        myLv2.has(String(r.rowId)) &&
        (r.categoryTitle ?? "") !== "",
    )?.categoryTitle ?? ""
  );
}

// 제품 → 소속 Lv2 이름만 필요한 화면용 경량 조회(devices-tree 1회, 추가 API 없음).
// Other Products/수상 배지까지 필요하면 fetchProductLv2Context 를 쓴다(같은 판정 로직 공유).
// 연결 Lv2가 없거나 조회 실패면 "".
export async function fetchProductLv2Name(
  currentProductId: number,
): Promise<string> {
  try {
    const rows = await fetchDevicesTreeRows();
    const myLv2 = collectProductLv2Ids(rows, currentProductId);
    if (myLv2.size === 0) return "";
    return pickLv2NameFromTreeRows(rows, myLv2);
  } catch {
    return "";
  }
}

export interface ProductLv2Context {
  // 복수 Lv2 소속이면 devices-tree 정렬 순서상 첫 번째 Lv2 이름. 연결 Lv2가 없으면 "".
  lv2Name: string;
  otherProducts: ProductOtherItem[];
}

// 현재 제품과 동일한 Lv2(category-data depth3 junction 레코드의 parentId) 기준 파생 데이터.
// - 소스: fetchDevicesTreeRows()(GNB 메가메뉴와 동일 엔드포인트, 신규 API 없음).
// - 현재 제품이 속한 Lv2(parentId) 전부 수집 → 그 Lv2의 다른 depth3 junction 제품 → 자기 자신 제외 → productId 중복 제거.
// - Lv2 이름은 같은 응답의 depth2 행(String(rowId) === depth3.parentId)의 categoryTitle 에서 얻는다(추가 조회 없음).
//   ※ 기획서상 라벨은 "Lv2 약어(abbr) 우선, 없으면 Lv2 이름"이나 abbr 필드는 fo/bo/bo-api 어디에도 존재하지 않아
//     이름 폴백만 사용한다(필드가 생기면 이 지점만 바꾸면 된다).
// - slug 없는 제품도 그대로 카드로 노출한다(href는 빈 값, 사용자 승인 정책).
// - 배지(32번): product.awards === "01"(iF Design Awards)면 badge=true → DevicesProductOtherProducts의 ProductAwardBadge 노출.
export async function fetchProductLv2Context(
  currentProductId: number,
): Promise<ProductLv2Context> {
  const empty: ProductLv2Context = { lv2Name: "", otherProducts: [] };
  try {
    const [rows, awardsMap] = await Promise.all([
      fetchDevicesTreeRows(),
      fetchProductAwardsMap(),
    ]);
    const depth3 = rows.filter((r) => r.depth === "3");
    // 현재 제품이 속한 Lv2(parentId) 집합
    const myLv2 = collectProductLv2Ids(rows, currentProductId);
    if (myLv2.size === 0) return empty;

    const lv2Name = pickLv2NameFromTreeRows(rows, myLv2);

    const seen = new Set<number>();
    const otherProducts: ProductOtherItem[] = [];
    for (const r of depth3) {
      if (r.productId == null || r.productId === currentProductId) continue;
      if (r.parentId == null || !myLv2.has(r.parentId)) continue;
      if (seen.has(r.productId)) continue;
      seen.add(r.productId);
      otherProducts.push({
        id: r.productSlug || `product-${r.productId}`,
        // 이 카드가 속한 Lv2(r.parentId)를 컨텍스트로 실어 중복 slug 제품이 엉뚱하게 열리지 않게 한다.
        href: withCategoryContext(
          r.productSlug ? `/product/${r.productSlug}` : "",
          r.parentId,
        ),
        // 기존 동작 유지 — ProductOtherItem.image 는 string(빈문자 허용)이라 null 을 ""로 낮춘다
        image: resolveImageUrlFromJsonText(r.productImage) ?? "",
        title: r.productTitle ?? "",
        subtitle: r.productDescription ?? "",
        badge: awardsMap.get(r.productId) === "01",
      });
    }
    return { lv2Name, otherProducts };
  } catch {
    return empty;
  }
}
