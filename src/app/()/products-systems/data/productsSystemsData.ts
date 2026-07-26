// Products & Systems(devices-systems) PageData 연동 헬퍼 + 타입
// - 설계: STEP4 확정(신규 BE 없음). 기존 FoPageDataController + PageDataService.search() 재사용
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - press-data/where-to-buy와 동일 패턴(fetchData + flattenPageDataItem으로 dataJson 중첩 언랩)
// - 각 page.tsx가 자기 where로 여기 함수를 호출해 데이터를 가져오고, 공용 컴포넌트에 prop 으로 전달한다.
import { fetchApi } from "@/lib/api";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem } from "@/lib/pageData";
import type { CommonFaqEntry } from "@/components/faq/CommonFaq";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
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

export async function fetchCategoryBySlug(
  slug: string,
  opts?: { depth?: number },
): Promise<CategoryRow | null> {
  try {
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
      href: row.slug ? `/product-range/${row.slug}` : "",
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
      href: row.slug ? `/product/${row.slug}` : "",
      image: resolveImageUrlFromJsonText(row.image),
      title: row.productName ?? "",
      description: row.infoDescription ?? "",
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

// seo.slug 정확일치 단건. 중복행이 있으면 첫 행 사용.
export async function fetchProductDetailBySlug(
  slug: string,
): Promise<Record<string, unknown> | null> {
  try {
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

// 현재 제품과 동일한 Lv2(category-data depth3 junction 레코드의 parentId)를 가지는 "다른" 제품 목록.
// - 소스: fetchDevicesTreeRows()(GNB 메가메뉴와 동일 엔드포인트, 신규 API 없음).
// - 현재 제품이 속한 Lv2(parentId) 전부 수집 → 그 Lv2의 다른 depth3 junction 제품 → 자기 자신 제외 → productId 중복 제거.
// - slug 없는 제품도 그대로 카드로 노출한다(href는 빈 값, 사용자 승인 정책).
// - 배지(32번): product.awards === "01"(iF Design Awards)면 badge=true → DevicesProductOtherProducts의 ProductAwardBadge 노출.
export async function fetchOtherProductsInSameLv2(
  currentProductId: number,
): Promise<ProductOtherItem[]> {
  try {
    const [rows, awardsMap] = await Promise.all([
      fetchDevicesTreeRows(),
      fetchProductAwardsMap(),
    ]);
    const depth3 = rows.filter((r) => r.depth === "3");
    // 현재 제품이 속한 Lv2(parentId) 집합
    const myLv2 = new Set(
      depth3
        .filter((r) => r.productId === currentProductId)
        .map((r) => r.parentId)
        .filter((p): p is string => p != null && p !== ""),
    );
    if (myLv2.size === 0) return [];

    const seen = new Set<number>();
    const items: ProductOtherItem[] = [];
    for (const r of depth3) {
      if (r.productId == null || r.productId === currentProductId) continue;
      if (r.parentId == null || !myLv2.has(r.parentId)) continue;
      if (seen.has(r.productId)) continue;
      seen.add(r.productId);
      items.push({
        id: r.productSlug || `product-${r.productId}`,
        href: r.productSlug ? `/product/${r.productSlug}` : "",
        // 기존 동작 유지 — ProductOtherItem.image 는 string(빈문자 허용)이라 null 을 ""로 낮춘다
        image: resolveImageUrlFromJsonText(r.productImage) ?? "",
        title: r.productTitle ?? "",
        subtitle: r.productDescription ?? "",
        badge: awardsMap.get(r.productId) === "01",
      });
    }
    return items;
  } catch {
    return [];
  }
}
