// Products & Systems(devices) GNB 메가메뉴 — 신규 단일 엔드포인트로 실데이터 동적 조립.
// GET /api/v1/fo/gnb/devices-tree 를 1번 호출해 평평한(flat) 행 리스트를 받고,
// depth("1"/"2"/"3")와 parentId 기준으로 트리(depth1 대분류 → depth2 하위분류 → depth3 제품카드)를 조립한다.
// (이전엔 category-data depth1 조회 + depth2 반복 조회 + 제품코드 접두사 매칭의 3단계였음.)
import { fetchApi } from "@/lib/api";
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type {
  GnbDevicesMegaMenu,
  GnbMegaDepth2,
  GnbMegaDepth3,
  GnbMegaProduct,
} from "@/data/gnb/types";
// 제품 이미지 URL 가공은 기존 유틸을 그대로 재사용(신규 이미지 유틸 생성 금지).
import { resolveFirstImageUrl } from "@/app/()/products-systems/data/productsSystemsData";

// devices-tree 엔드포인트 응답의 평평한 행 1개(= bo-api DevicesTreeRowResponse).
// depth1/2 행: category* 필드 + sortOrder 채워짐, product* 필드 null.
// depth3 행: product* 필드 채워짐, categoryTitle/categorySlug null. parentId 는 depth 공통.
interface DevicesTreeRow {
  rowId: number | null;
  depth: string | null;
  parentId: string | null;
  categoryTitle: string | null;
  categorySlug: string | null;
  // 카테고리 설명 원본. "\n" 으로 줄바꿈된 일반 텍스트이며 값이 없으면 null.
  categoryDescription: string | null;
  sortOrder: string | null;
  productId: number | null;
  productSlug: string | null;
  productTitle: string | null;
  productDescription: string | null;
  productImage: string | null;
}

// devices-tree 단일 조회. X-Site-Id 헤더는 fetchApi 가 전역 주입(site_id=1)하므로 별도 지정 불필요.
// 실패 시 [] 반환(호출부가 정적 폴백 여부를 판단).
async function fetchDevicesTreeRows(): Promise<DevicesTreeRow[]> {
  try {
    return await fetchApi<DevicesTreeRow[]>("/api/v1/fo/gnb/devices-tree");
  } catch {
    return [];
  }
}

// productImage 는 BE 가 JSONB(product_info.image)를 ->> 연산자로 뽑아 JSON 배열이 텍스트 문자열("[123]")로 온다.
// resolveFirstImageUrl 은 배열을 기대하므로 문자열을 배열로 파싱한 뒤 그대로 재사용한다.
// (확인 필요: 실제 응답에서 productImage 가 "[123]" 형태 문자열인지 런타임 검증 필요 — SQL ->> 연산자 기준 추정)
function resolveProductImage(productImage: string | null): string | null {
  if (!productImage) return null;
  try {
    const parsed = JSON.parse(productImage);
    return resolveFirstImageUrl(parsed);
  } catch {
    // 파싱 불가(문자열이 배열 JSON 이 아님) → 폴백 없이 null
    return null;
  }
}

// parentId(문자열) 기준으로 행을 그룹핑. 입력 배열 순서(BE 가 depth·sortOrder·id ASC 정렬)를 그대로 보존한다.
function groupByParent(rows: DevicesTreeRow[]): Map<string, DevicesTreeRow[]> {
  const map = new Map<string, DevicesTreeRow[]>();
  for (const row of rows) {
    const key = row.parentId ?? "";
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(row);
    } else {
      map.set(key, [row]);
    }
  }
  return map;
}

// rowId(number) → parentId 매칭용 문자열 키.
function rowKey(row: DevicesTreeRow): string {
  return row.rowId != null ? String(row.rowId) : "";
}

// 카테고리 설명 원본("\n" 줄바꿈 포함 일반 텍스트)을 줄 단위 string[]로 변환(빈 줄 제외).
function splitDescription(raw: string | null): string[] | undefined {
  return raw
    ?.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// depth3(제품) 행 → 메가메뉴 제품 카드.
function toMegaProduct(row: DevicesTreeRow): GnbMegaProduct {
  const fallbackId =
    row.productId != null ? `product-${row.productId}` : `product-${row.rowId ?? ""}`;
  return {
    id: row.productSlug || fallbackId,
    title: row.productTitle ?? "",
    subtitle: row.productDescription ?? "",
    image: resolveProductImage(row.productImage),
    href: row.productSlug ? `/product/${row.productSlug}` : "",
  };
}

// devices 메가메뉴 전체 트리 — 서버(레이아웃)에서 조회해 GnbMenu에 prop으로 내려준다.
// 실패/0건 시 categories: [] 반환(호출부가 정적 폴백 여부를 판단). 시그니처/반환 타입은 기존과 동일 유지.
export async function fetchDevicesMegaMenu(): Promise<GnbDevicesMegaMenu> {
  const rows = await fetchDevicesTreeRows();

  // depth별 분리 — depth1은 순서대로, depth2/3은 parentId 기준 그룹핑.
  const depth1Rows = rows.filter((row) => row.depth === "1");
  const depth2ByParent = groupByParent(rows.filter((row) => row.depth === "2"));
  const depth3ByParent = groupByParent(rows.filter((row) => row.depth === "3"));

  const categories: GnbMegaDepth2[] = depth1Rows.map((top) => {
    const childRows = depth2ByParent.get(rowKey(top)) ?? [];

    const children: GnbMegaDepth3[] = childRows.map((child) => {
      const productRows = depth3ByParent.get(rowKey(child)) ?? [];
      return {
        id: child.categorySlug || rowKey(child),
        label: child.categoryTitle ?? "",
        panelTitle: child.categoryTitle ?? "",
        description: splitDescription(child.categoryDescription),
        href: child.categorySlug ? `/product-range/${child.categorySlug}` : "",
        product: productRows.map(toMegaProduct),
      };
    });

    return {
      id: top.categorySlug || rowKey(top),
      label: top.categoryTitle ?? "",
      href: top.categorySlug ? `/products-category/${top.categorySlug}` : "",
      children,
    };
  });

  return {
    type: "devices",
    panelId: GNB_MEGA_PANEL_ID.devices,
    categories,
  };
}
