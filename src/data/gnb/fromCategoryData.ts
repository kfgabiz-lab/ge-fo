// Products & Systems(devices) GNB 메가메뉴 — 신규 단일 엔드포인트로 실데이터 동적 조립.
// GET /api/v1/fo/gnb/devices-tree 를 1번 호출해 평평한(flat) 행 리스트를 받고,
// depth("1"/"2"/"3")와 parentId 기준으로 트리(depth1 대분류 → depth2 하위분류 → depth3 제품카드)를 조립한다.
// (이전엔 category-data depth1 조회 + depth2 반복 조회 + 제품코드 접두사 매칭의 3단계였음.)
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import {
  type DevicesTreeRow,
  fetchDevicesTreeRows,
} from "@/data/gnb/devicesTree";
import type {
  GnbDevicesMegaMenu,
  GnbMegaDepth2,
  GnbMegaDepth3,
  GnbMegaProduct,
} from "@/data/gnb/types";
// 제품 이미지 URL 가공은 기존 유틸을 그대로 재사용(신규 이미지 유틸 생성 금지).
import { resolveFirstImageUrl } from "@/app/()/products-systems/data/productsSystemsData";
// 카테고리 컨텍스트(?category=) 부착 — 중복 slug 해소용 공용 헬퍼.
import { withCategoryContext } from "@/lib/navigation/categoryContext";

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
    // seo.slug 가 겹치는 제품(VFD 6종)이 실제로 있어 slug 만으로는 대상이 확정되지 않는다.
    // depth3 행은 자신이 속한 Lv2 의 id(parentId)를 갖고 있으므로 그대로 컨텍스트로 실어 보낸다.
    href: withCategoryContext(
      row.productSlug ? `/product/${row.productSlug}` : "",
      row.parentId,
    ),
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
        // 중복 slug 구별용 실제 카테고리 PK(브레드크럼이 ?category= 와 대조해 조상 체인을 확정한다).
        categoryId: child.rowId,
        label: child.categoryTitle ?? "",
        panelTitle: child.categoryTitle ?? "",
        description: splitDescription(child.categoryDescription),
        // "Variable Frequency Drive" 처럼 서로 다른 Lv1 밑에 같은 seo.slug 를 가진 Lv2 가 존재한다.
        // 트리 행의 고유 id(rowId = category-data PK)를 함께 넘겨 클릭한 그 카테고리로 이동시킨다.
        href: withCategoryContext(
          child.categorySlug ? `/product-range/${child.categorySlug}` : "",
          child.rowId,
        ),
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
