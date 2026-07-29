import { fetchApi } from "@/lib/api";
import { flattenPageDataItem, type PageDataItem } from "@/lib/pageData";
import {
  fetchTrainingProductTree,
  type TrainingProductTreeItem,
} from "@/lib/training/trainingProductTree";
import type { TrainingFilterOption, TrainingVariant } from "./trainingContent";

export const TRAINING_SLUG = "currMgmt-data";
export const TRAINING_LIST_SIZE = 10;

export const trainingImageSrc = (mediaId: number) =>
  `/api/v1/fo/page-files/${mediaId}`;

export const trainingDetailHref = (prefix: string, id: number) =>
  `${prefix}/${id}`;

export const TRAINING_COURSE_BY_VARIANT: Record<TrainingVariant, string> = {
  engineering: "01",
  service: "02",
  sales: "03",
};

export function trainingStatusWhere(
  variant: TrainingVariant,
): Record<string, string> {
  return {
    "eq_curriculum.is_visible": "001",
    "eq_curriculum.training_course": TRAINING_COURSE_BY_VARIANT[variant],
  };
}

export type TrainingRow = PageDataItem;

export interface CodeItem {
  code: string;
  name: string;
}

export interface TrainingCardItem {
  id: number;
  categoryCode: string; 
  categoryLabel: string; 
  title: string;
  description: string;
  imageSrc: string | null; 
}

export function toCategoryMap(codes: CodeItem[]): Map<string, string> {
  return new Map((codes ?? []).map((c) => [c.code, c.name]));
}

export function toCategoryOptions(
  codes: CodeItem[],
): { value: string; label: string }[] {
  return [
    { value: "", label: "All" },
    ...(codes ?? []).map((c) => ({ value: c.code, label: c.name })),
  ];
}

export function toTrainingCard(
  item: TrainingRow,
  categoryMap: Map<string, string>,
): TrainingCardItem {
  const row = flattenPageDataItem(item);
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0
      ? (imageArr[0] as number)
      : null;
  const code = (row.product_category as string) ?? "";
  return {
    id: item.id,
    categoryCode: code,
    categoryLabel: categoryMap.get(code) ?? code,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    imageSrc: mediaId != null ? trainingImageSrc(mediaId) : null,
  };
}

export interface TrainingCategoryNode {
  id: number; 
  depth1Title: string; 
  depth2Title: string; 
  productType: string; 
  productName: string; 
}

function toCategoryNode(item: TrainingProductTreeItem): TrainingCategoryNode {
  return {
    id: Number(item.categoryId ?? 0),
    depth1Title: item.lv1Title ?? "",
    depth2Title: item.lv2Title ?? "",
    productType: item.productType ?? "",
    productName: item.productName ?? "",
  };
}

function gateNodes(
  nodes: TrainingCategoryNode[],
  productType: string,
): TrainingCategoryNode[] {
  return nodes.filter((n) => n.productType === productType);
}

function distinctOptions(values: string[]): TrainingFilterOption[] {
  const seen = new Set<string>();
  const out: TrainingFilterOption[] = [];
  for (const v of values) {
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push({ value: v, label: v });
  }
  return out;
}

export function toLvCategoryOptions(
  nodes: TrainingCategoryNode[],
  category: string,
): TrainingFilterOption[] {
  if (category === "P") {
    return distinctOptions(gateNodes(nodes, "P").map((n) => n.depth1Title));
  }
  if (category === "A") {
    return distinctOptions(gateNodes(nodes, "A").map((n) => n.depth2Title));
  }
  return [];
}

export function toSubCategoryOptions(
  nodes: TrainingCategoryNode[],
  category: string,
  lvValue: string,
): TrainingFilterOption[] {
  if (category === "P") {
    const gated = gateNodes(nodes, "P").filter(
      (n) => !lvValue || n.depth1Title === lvValue,
    );
    return distinctOptions(gated.map((n) => n.depth2Title));
  }
  if (category === "A") {
    const gated = gateNodes(nodes, "A").filter(
      (n) => !lvValue || n.depth2Title === lvValue,
    );
    return distinctOptions(gated.map((n) => n.productName));
  }
  return [];
}

export function resolveCategoryIds(
  nodes: TrainingCategoryNode[],
  category: string,
  lvValue: string,
  subValue: string,
): number[] {
  if (category !== "P" && category !== "A") return [];
  const gated = gateNodes(nodes, category);
  const matched = gated.filter((n) => {
    if (category === "P") {
      if (lvValue && n.depth1Title !== lvValue) return false;
      if (subValue && n.depth2Title !== subValue) return false;
    } else {
      if (lvValue && n.depth2Title !== lvValue) return false;
      if (subValue && n.productName !== subValue) return false;
    }
    return true;
  });
  return Array.from(new Set(matched.map((n) => n.id).filter((id) => id > 0)));
}

export async function fetchTrainingCategories(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/PRODUCTCATEGORY");
}

export async function fetchTrainingCategoryNodes(): Promise<
  TrainingCategoryNode[]
> {
  const tree = await fetchTrainingProductTree();
  return tree.items.map(toCategoryNode).filter((n) => n.id > 0);
}

export interface TrainingByCategoryResponse {
  content: TrainingRow[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export async function fetchTrainingByCategoryIds(params: {
  categoryIds: number[];
  variant: TrainingVariant;
  page: number;
  size: number;
}): Promise<{ content: TrainingRow[]; totalPages: number }> {
  const { categoryIds, variant, page, size } = params;
  const sp = new URLSearchParams();
  sp.set("categoryIds", categoryIds.join(","));
  sp.set("trainingCourse", TRAINING_COURSE_BY_VARIANT[variant]);
  sp.set("page", String(page));
  sp.set("size", String(size));
  sp.set("sort", "createdAt,desc");
  const res = await fetchApi<TrainingByCategoryResponse>(
    `/api/v1/fo/training/curriculum-by-category?${sp.toString()}`,
  );
  return { content: res.content ?? [], totalPages: res.totalPages || 1 };
}
