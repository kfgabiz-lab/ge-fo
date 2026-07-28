// 통합검색(/search) All 탭 "Product" 섹션 실검색 헬퍼.
// - 검색 결과: 신규 BE 엔드포인트 GET /api/v1/fo/products/search?q=&limit= (STEP5 구현). page_data slug 아님.
//   응답 { total, items:[{ id, productName, productDescription, image, slug }] }
//   · image = 이미 프록시 URL(/api/v1/fo/page-files/{id}) 또는 null
//   · slug  = seo.slug 또는 null
// - 카테고리 라벨(Lv1>Lv2): 기존 devices-tree(fetchDevicesTreeRows) 재사용해 제품→카테고리 경로를 역방향 조립.
//   (productsSystemsData.ts 의 fetchOtherProductsInSameLv2 와 동일 원천/패턴)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";
import { fetchDevicesTreeRows, type DevicesTreeRow } from "@/data/gnb/devicesTree";
import type { SearchProductItem } from "@/data/search/searchAllContent";
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";

// 신규 제품검색 API 응답 아이템(= bo-api ProductSearchItemResponse)
interface ProductSearchApiItem {
  id: number;
  productName: string | null;
  productDescription: string | null;
  image: string | null;
  slug: string | null;
}

// 신규 제품검색 API 응답 본문
interface ProductSearchApiResponse {
  total: number;
  items: ProductSearchApiItem[];
}

// 화면 사용 결과: total(탭 카운트/섹션 헤더용) + 카드 매핑된 items
export interface SearchAllProductsResult {
  total: number;
  items: SearchProductItem[];
}

// devices-tree 평면 행에서 productId → { category(Lv1), highlight(Lv2) } 경로 조립.
// - depth3 행(productId 보유)의 parentId = Lv2 rowId → depth2 행(categoryTitle=Lv2, parentId=Lv1 rowId)
//   → depth1 행(categoryTitle=Lv1).
// - 다중 매칭(제품이 여러 depth3 junction) 시 첫 번째 매칭 경로 사용.
// - 트리에 없는 제품은 빈 문자열로 안전 처리(에러 없이).
function buildCategoryPath(
  rows: DevicesTreeRow[],
  productId: number,
): { category: string; highlight: string } {
  const depth3 = rows.find((r) => r.depth === "3" && r.productId === productId);
  if (!depth3 || depth3.parentId == null) return { category: "", highlight: "" };

  const lv2 = rows.find(
    (r) => r.depth === "2" && r.rowId != null && String(r.rowId) === depth3.parentId,
  );
  if (!lv2) return { category: "", highlight: "" };

  const highlight = lv2.categoryTitle ?? ""; // Lv2 명칭

  let category = ""; // Lv1 명칭
  if (lv2.parentId != null) {
    const lv1 = rows.find(
      (r) => r.depth === "1" && r.rowId != null && String(r.rowId) === lv2.parentId,
    );
    category = lv1?.categoryTitle ?? "";
  }

  return { category, highlight };
}

// 제품검색 옵션. All 탭은 limit 만, Products 탭은 categories(depth2 rowId)+offset+limit 를 넘긴다.
export interface SearchProductsQueryOptions {
  // 콤마 전송용 depth2 category-data row_id 문자열 배열. 빈 배열이면 카테고리 필터 없음.
  categories?: string[];
  // 페이징 시작 오프셋(Products 탭: 0/10/20…). 기본 0.
  offset?: number;
  // 조회 개수(All 탭 4, Products 탭 10). 기본 4.
  limit?: number;
}

// 제품 검색 공통 헬퍼. All 탭(카테고리 없음, limit 4)과 Products 탭(카테고리 있음, limit 10, offset)이 공유.
// - q 도 categories 도 없으면 호출 없이 빈 결과(BE 도 빈결과지만 불필요 호출 방지).
// - 실패/에러 시 빈 결과 반환(화면 방어). 섹션 자체 미표시는 호출부에서 판단.
export async function fetchSearchAllProducts(
  query: string,
  options: SearchProductsQueryOptions = {},
): Promise<SearchAllProductsResult> {
  const { categories = [], offset = 0, limit = 4 } = options;
  const q = query.trim();
  if (!q && categories.length === 0) return { total: 0, items: [] };

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categories.length > 0) params.set("categories", categories.join(","));
    params.set("offset", String(offset));
    params.set("limit", String(limit));

    const [res, rows] = await Promise.all([
      fetchApi<ProductSearchApiResponse>(
        `/api/v1/fo/products/search?${params.toString()}`,
      ),
      fetchDevicesTreeRows(),
    ]);

    const apiItems = Array.isArray(res?.items) ? res.items : [];
    const items: SearchProductItem[] = apiItems.map((it) => {
      const { category, highlight } = buildCategoryPath(rows, it.id);
      return {
        id: String(it.id),
        href: it.slug ? `/product/${it.slug}` : "",
        image: it.image ?? "",
        category,
        highlight,
        title: it.productName ?? "",
        description: it.productDescription ?? "",
      };
    });

    return { total: typeof res?.total === "number" ? res.total : 0, items };
  } catch {
    return { total: 0, items: [] };
  }
}

// ---------------- Products 탭 필터 트리(devices-tree 재사용, Lv1>Lv2) ----------------

// devices-tree 평면 행 → 필터 아코디언용 Lv1>Lv2 카테고리 옵션.
// - Lv1 = depth1 행, Lv2(nested) = depth2 행(parentId 로 Lv1 매칭). sortOrder 오름차순.
// - option.id = category-data row_id 문자열. Lv2 리프 id 가 API categories 로 전송됨.
// - count(제품 건수)는 devices-tree 로 제공되지 않아 미지정(라벨만 표시).
function buildProductCategoryTree(rows: DevicesTreeRow[]): DownloadCategoryOption[] {
  const toSort = (v: string | null) => (v == null ? 0 : Number(v) || 0);

  const lv1Rows = rows
    .filter((r) => r.depth === "1" && r.rowId != null)
    .sort((a, b) => toSort(a.sortOrder) - toSort(b.sortOrder));

  return lv1Rows.map((lv1) => {
    const nested = rows
      .filter(
        (r) =>
          r.depth === "2" &&
          r.rowId != null &&
          r.parentId === String(lv1.rowId),
      )
      .sort((a, b) => toSort(a.sortOrder) - toSort(b.sortOrder))
      .map((lv2) => ({
        id: String(lv2.rowId),
        label: lv2.categoryTitle ?? "",
      }));

    return {
      id: String(lv1.rowId),
      label: lv1.categoryTitle ?? "",
      hasArrow: nested.length > 0,
      nested,
    } satisfies DownloadCategoryOption;
  });
}

// Products 탭 카테고리 필터 트리 조회. 실패 시 빈 배열(fetchDevicesTreeRows 내부에서 방어).
export async function fetchSearchProductCategoryTree(): Promise<
  DownloadCategoryOption[]
> {
  const rows = await fetchDevicesTreeRows();
  return buildProductCategoryTree(rows);
}
