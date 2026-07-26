// Training Request(Step4) 제품 선택 트리 — GET /api/v1/fo/training/product-tree
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";

export interface TrainingProductOption {
  id: number;
  name: string;
}

/**
 * 두 번째 드롭다운의 옵션 1개(= 하위 제품 목록을 가진 그룹).
 * power/automation 모두 평평한 배열이라 FE는 계층 없이 "title + products" 로만 다룬다.
 */
export interface TrainingProductNode {
  id: number;
  title: string;
  /** 이 그룹에서 체크박스로 노출할 항목들(Power는 Lv2 카테고리명, Automation은 제품명) */
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
