import { fetchApi } from "@/lib/api";

export interface FoProductGroupItem {
  id: number;
  productNm: string;
  prdSubDesc: string;
  awards: string;
  image: string | null;
  slug: string | null;
  sortOrder: string;
}

export interface FoProductGroupResponse {
  id: number;
  prdGrpNm: string;
  prdGrpOrd: string;
  ms: FoProductGroupItem[];
}

export async function fetchProductGroups(): Promise<FoProductGroupResponse[]> {
  const res = await fetchApi<FoProductGroupResponse[]>(
    "/api/v1/fo/product-groups",
  );
  return res ?? [];
}
