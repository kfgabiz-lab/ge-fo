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

/**
 * 같은 조회 결과의 평면 행 1건 — Lv1 > Lv2 > (depth3 연결행) > 제품.
 * - categoryId 는 category-data depth3 연결행 PK 로, 커리큘럼 상세(currDtlMgmt-data)의
 *   power_list / automation_list 에 저장되는 값과 동일하다.
 * - Training 커리큘럼 목록의 Lv/Sub Category 옵션 파생과 PRODUCTS COVERED(연결제품 id → 제품명)에 사용한다.
 */
export interface TrainingProductTreeItem {
  categoryId: number;
  lv1Id: number;
  lv1Title: string;
  lv2Id: number;
  lv2Title: string;
  productId: number;
  productName: string;
  productType: string; // "P"=Power / "A"=Automation
}

export interface TrainingProductTree {
  power: TrainingProductNode[];
  automation: TrainingProductNode[];
  items: TrainingProductTreeItem[];
}

const EMPTY_TREE: TrainingProductTree = { power: [], automation: [], items: [] };

// 실패 시 빈 트리 반환(호출부는 빈 배열이면 선택 UI를 비워둔다).
// - items 는 BE 응답에 없을 경우(구버전) undefined 가 될 수 있어 빈 배열로 보정한다.
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

/**
 * 연결제품 id(category-data depth3 PK) → 제품명 맵.
 * currDtlMgmt-data 의 power_list / automation_list 값을 제품명으로 해석할 때 사용한다.
 * (관계설정 _fetchedRel22/23 의존을 제거하기 위한 대체 경로)
 */
export function toTrainingProductNameMap(
  items: TrainingProductTreeItem[],
): Map<number, string> {
  const map = new Map<number, string>();
  for (const item of items ?? []) {
    if (item?.categoryId == null) continue;
    const name = (item.productName ?? "").trim();
    if (!name) continue;
    // 같은 연결행이 중복 등장하면 첫 값 유지(정렬은 BE ORDER BY 결과 순서)
    if (!map.has(item.categoryId)) map.set(item.categoryId, name);
  }
  return map;
}

/**
 * 연결제품 id 목록 → 제품명 목록. 미해석 id(삭제된 연결행/트레이닝 미사용 제품)는 제외한다.
 * 중복 제품명은 1회만 남긴다(입력 순서 유지).
 */
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
