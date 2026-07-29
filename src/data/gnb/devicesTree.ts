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
}

export async function fetchDevicesTreeRows(): Promise<DevicesTreeRow[]> {
  try {
    return await fetchApi<DevicesTreeRow[]>("/api/v1/fo/gnb/devices-tree");
  } catch {
    return [];
  }
}
