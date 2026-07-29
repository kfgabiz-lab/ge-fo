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

export async function fetchTrainingProductTree(): Promise<TrainingProductTree> {
  try {
    const res = await fetchApi<TrainingProductTree>(
      "/api/v1/fo/training/product-tree",
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

export function toTrainingProductNameMap(
  items: TrainingProductTreeItem[],
): Map<number, string> {
  const map = new Map<number, string>();
  for (const item of items ?? []) {
    if (item?.categoryId == null) continue;
    const name = (item.productName ?? "").trim();
    if (!name) continue;
    if (!map.has(item.categoryId)) map.set(item.categoryId, name);
  }
  return map;
}

export function resolveTrainingProductNames(
  ids: unknown[],
  nameMap: Map<number, string>,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of ids ?? []) {
    const id = Number(raw);
    if (!Number.isFinite(id)) continue;
    const name = nameMap.get(id);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
