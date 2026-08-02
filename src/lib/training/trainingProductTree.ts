import { fetchApi } from "@/lib/api";

export interface TrainingProductOption {
  id: number;
  name: string;
}

export interface TrainingProductNode {
  id: number;
  title: string;
  products: TrainingProductOption[] | null;
}

export interface TrainingProductTreeItem {
  categoryId: number;
  lv1Id: number;
  lv1Title: string;
  lv2Id: number;
  lv2Title: string;
  productId: number;
  productName: string;
  productType: string;
}

export interface TrainingProductTree {
  power: TrainingProductNode[];
  automation: TrainingProductNode[];
  items: TrainingProductTreeItem[];
}

const EMPTY_TREE: TrainingProductTree = { power: [], automation: [], items: [] };

export async function fetchTrainingProductTree(
  activeOnly = false,
): Promise<TrainingProductTree> {
  try {
    const res = await fetchApi<TrainingProductTree>(
      activeOnly
        ? "/api/v1/fo/training/product-tree?activeOnly=true"
        : "/api/v1/fo/training/product-tree",
    );
    return {
      power: res.power ?? [],
      automation: res.automation ?? [],
      items: res.items ?? [],
    };
  } catch {
    return EMPTY_TREE;
  }
}

/**
 * currDtlMgmt-data의 power_list/automation_list id 목록으로 표시명을 직접 조회한다.
 * has_training/depth 등 아무 조건도 보지 않는 category-data 직접조회 API를 그대로 사용 —
 * BO 멀티셀렉트가 category.title/product.product_name을 그대로 보여주는 것과 동일한 방식.
 */
export async function fetchProductNamesByIds(
  ids: number[],
): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map();
  const res = await fetchApi<Record<string, string>>(
    `/api/v1/fo/training/product-names?ids=${ids.join(",")}`,
  );
  return new Map(Object.entries(res).map(([id, name]) => [Number(id), name]));
}
