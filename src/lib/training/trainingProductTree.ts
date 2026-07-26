// Training Request(Step4) 제품 선택 트리 — GET /api/v1/fo/training/product-tree
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";

export interface TrainingProductOption {
  id: number;
  name: string;
}

export interface TrainingProductNode {
  id: number;
  title: string;
  /** 하위 카테고리가 있으면 값, 없으면 null(이 경우 products에 제품이 있음) */
  children: TrainingProductNode[] | null;
  /** 하위 카테고리 없이 제품만 있는 리프 노드일 때만 값 */
  products: TrainingProductOption[] | null;
}

export interface TrainingProductTree {
  power: TrainingProductNode[];
  automation: TrainingProductNode[];
}

const EMPTY_TREE: TrainingProductTree = { power: [], automation: [] };

// 실패 시 빈 트리 반환(호출부는 빈 배열이면 선택 UI를 비워둔다).
export async function fetchTrainingProductTree(): Promise<TrainingProductTree> {
  try {
    return await fetchApi<TrainingProductTree>("/api/v1/fo/training/product-tree");
  } catch {
    return EMPTY_TREE;
  }
}
