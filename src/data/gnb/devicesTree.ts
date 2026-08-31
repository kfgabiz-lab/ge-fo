import { cache } from "react";
import { fetchApi } from "@/lib/api";

export interface DevicesTreeRow {
  rowId: number | null;
  depth: string | null;
  parentId: string | null;
  categoryTitle: string | null;
  categorySlug: string | null;
  categoryDescription: string | null;
  sortOrder: string | null;
  productId: number | null;
  productSlug: string | null;
  productTitle: string | null;
  productDescription: string | null;
  productImage: string | null;
  productOrderStatus: string | null;
  productOrderMethod: string | null;
}

export const fetchDevicesTreeRows = cache(
  async (): Promise<DevicesTreeRow[]> => {
    try {
      return await fetchApi<DevicesTreeRow[]>("/api/v1/fo/gnb/devices-tree");
    } catch {
      return [];
    }
  },
);
//단종 제품 포함하여 전체 제품 리스트를 가져오기 위해 explore-all 전용 api 추가
export async function fetchDevicesExploreAll(): Promise<DevicesTreeRow[]> {
  try {
    return await fetchApi<DevicesTreeRow[]>("/api/v1/fo/gnb/devices-explore-all");
  } catch {
    return [];
  }
}

export interface DevicesCategorySelection {
  lv1: string;
  lv2: string;
  lv3: string;
}

const EMPTY_CATEGORY_SELECTION: DevicesCategorySelection = {
  lv1: "",
  lv2: "",
  lv3: "",
};

function findLv2RowById(
  rows: DevicesTreeRow[],
  categoryId: number,
): DevicesTreeRow | undefined {
  return rows.find((row) => row.depth === "2" && row.rowId === categoryId);
}

function findLv2RowByProduct(
  rows: DevicesTreeRow[],
  productId: number,
): DevicesTreeRow | undefined {
  const parentIds = new Set(
    rows
      .filter((row) => row.depth === "3" && row.productId === productId)
      .map((row) => row.parentId)
      .filter((parentId): parentId is string => Boolean(parentId)),
  );
  if (parentIds.size === 0) return undefined;
  return rows.find(
    (row) =>
      row.depth === "2" &&
      row.rowId != null &&
      parentIds.has(String(row.rowId)) &&
      (row.categoryTitle ?? "") !== "",
  );
}

function findLv1RowById(
  rows: DevicesTreeRow[],
  categoryId: number,
): DevicesTreeRow | undefined {
  return rows.find((row) => row.depth === "1" && row.rowId === categoryId);
}

export function resolveDevicesCategorySelection(
  rows: DevicesTreeRow[],
  categoryId?: number,
  productId?: number,
): DevicesCategorySelection {
  if (rows.length === 0) return EMPTY_CATEGORY_SELECTION;
  if (categoryId === undefined && productId === undefined) {
    return EMPTY_CATEGORY_SELECTION;
  }

  const lv2Row =
    (categoryId !== undefined ? findLv2RowById(rows, categoryId) : undefined) ??
    (productId !== undefined ? findLv2RowByProduct(rows, productId) : undefined);
  if (!lv2Row || lv2Row.rowId == null) {
    // Lv2/product 매칭 실패 시 categoryId가 Lv1 id인 경우를 시도한다 (Lv1 상세화면 CTA 전용 — lv1만 선택하고 lv2/lv3는 비운다)
    const lv1Row =
      categoryId !== undefined ? findLv1RowById(rows, categoryId) : undefined;
    if (!lv1Row || lv1Row.rowId == null) return EMPTY_CATEGORY_SELECTION;
    return { lv1: String(lv1Row.rowId), lv2: "", lv3: "" };
  }

  const lv1Row = rows.find(
    (row) =>
      row.depth === "1" &&
      row.rowId != null &&
      String(row.rowId) === (lv2Row.parentId ?? ""),
  );
  if (!lv1Row || lv1Row.rowId == null) return EMPTY_CATEGORY_SELECTION;

  const lv2Key = String(lv2Row.rowId);
  const lv3Row =
    productId !== undefined
      ? rows.find(
          (row) =>
            row.depth === "3" &&
            row.parentId === lv2Key &&
            row.productId === productId &&
            row.rowId != null,
        )
      : undefined;

  return {
    lv1: String(lv1Row.rowId),
    lv2: lv2Key,
    lv3: lv3Row?.rowId != null ? String(lv3Row.rowId) : "",
  };
}
