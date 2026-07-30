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

export interface TrainingProductNameMaps {
  power: Map<number, string>;
  automation: Map<number, string>;
}

export const EMPTY_TRAINING_PRODUCT_NAME_MAPS: TrainingProductNameMaps = {
  power: new Map<number, string>(),
  automation: new Map<number, string>(),
};

function putName(map: Map<number, string>, rawId: unknown, rawName: unknown) {
  const id = Number(rawId);
  if (!Number.isFinite(id) || id <= 0) return;
  const name = String(rawName ?? "").trim();
  if (!name) return;
  if (!map.has(id)) map.set(id, name);
}

export function toTrainingProductNameMaps(
  items: TrainingProductTreeItem[],
): TrainingProductNameMaps {
  const power = new Map<number, string>();
  const automation = new Map<number, string>();
  for (const item of items ?? []) {
    putName(power, item?.lv2Id, item?.lv2Title);
    putName(automation, item?.categoryId, item?.productName);
  }
  return { power, automation };
}

export function resolveTrainingProductNames(
  powerIds: unknown[],
  automationIds: unknown[],
  nameMaps: TrainingProductNameMaps,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const collect = (
    ids: unknown[],
    kind: "power" | "automation",
    map: Map<number, string>,
  ) => {
    for (const raw of ids ?? []) {
      const id = Number(raw);
      if (!Number.isFinite(id)) continue;
      const name = map.get(id);
      if (!name) continue;
      const key = `${kind}:${name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(name);
    }
  };
  collect(powerIds, "power", nameMaps?.power ?? new Map());
  collect(automationIds, "automation", nameMaps?.automation ?? new Map());
  return out;
}
