import { fetchApi } from "@/lib/api";
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { gnbNavItems } from "@/data/gnb/navItems";
import type {
  GnbNavItem,
  GnbSimpleMegaItem,
  GnbSimpleMegaMenu,
  GnbSimpleMegaSection,
} from "@/data/gnb/types";

/**
 * GET /api/v1/fo/menus/gnb 응답 노드(트리).
 * BE에서 menu_type='FO', parent=null, visible=true 루트만, 자식도 visible=true만 재귀 포함해 내려줌.
 */
export type FoGnbMenuApiNode = {
  id: number;
  name: string;
  nameMsgKey: string | null;
  description: string | null;
  descriptionMsgKey: string | null;
  url: string | null;
  icon: string | null;
  sortOrder: number;
  children: FoGnbMenuApiNode[];
};

/**
 * API로 연동할 최상위 nav id ↔ API 루트 노드 name 매핑.
 * devices(Products & Systems)는 정적 유지 대상이라 여기 포함하지 않음.
 * key: 정규화(trim+소문자)한 API name, value: gnbNavItems의 nav id.
 */
const API_NAME_TO_NAV_ID: Record<string, string> = {
  markets: "markets",
  services: "services",
  support: "support",
  company: "company",
};

/** msgKey(nameMsgKey/descriptionMsgKey)는 현재 fo에 i18n 해석 유틸이 없어 무시하고 원문(name/description) 사용 */
function toSimpleItem(node: FoGnbMenuApiNode): GnbSimpleMegaItem {
  const href = node.url ?? undefined;

  return {
    id: String(node.id),
    title: node.name,
    description: node.description ?? undefined,
    // DB description은 여러 줄일 경우 "\n"으로 구분해 저장(예: Public Infrastructure) → grid 레이아웃(GnbMegaItemLink descVariant="grid")은
    // descriptionLines 배열만 렌더링하므로 여기서 분리해 채워줘야 함
    descriptionLines: node.description
      ? node.description.split("\n")
      : undefined,
    href,
    // http로 시작하면 외부 링크로 처리(새 창 등 GnbMegaItemLink에서 사용)
    external: href?.startsWith("http") ?? false,
    // 비활성 항목은 BE에서 visible=false로 이미 제외되어 내려오지 않으므로 항상 false
    disabled: false,
  };
}

/**
 * 서버(레이아웃)에서 GNB 트리 조회.
 * GNB는 필수 렌더 요소라 실패해도 전체 레이아웃이 죽으면 안 되므로 try/catch로 감싸고 빈 배열 폴백.
 * (빈 배열이면 resolveGnbNavItems가 전부 정적 데이터로 폴백)
 */
export async function fetchGnbMenuData(): Promise<FoGnbMenuApiNode[]> {
  try {
    return await fetchApi<FoGnbMenuApiNode[]>("/api/v1/fo/menus/gnb");
  } catch (error) {
    // 실패 시 GNB가 비어 보이지 않도록 빈 배열 반환 → 정적 데이터로 폴백
    console.error("[GNB] menus/gnb 조회 실패, 정적 데이터로 폴백:", error);
    return [];
  }
}

/**
 * 매칭된 API 루트 노드의 children으로 GnbSimpleMegaMenu 생성.
 * - 자식들 중 하나라도 손자(children)가 있으면 "sections" (자식=섹션, 손자=item)
 * - 자식이 모두 leaf면 "grid" (자식=item)
 */
function buildSimpleMegaMenu(
  navId: string,
  node: FoGnbMenuApiNode,
): GnbSimpleMegaMenu {
  const panelId =
    GNB_MEGA_PANEL_ID[navId as keyof typeof GNB_MEGA_PANEL_ID] ??
    `gnb-mega-panel-${navId}`;
  const children = node.children ?? [];
  const hasGrandchildren = children.some(
    (child) => (child.children?.length ?? 0) > 0,
  );

  if (hasGrandchildren) {
    const sections: GnbSimpleMegaSection[] = children.map((section) => ({
      id: String(section.id),
      label: section.name,
      items: (section.children ?? []).map(toSimpleItem),
    }));

    return {
      type: "simple",
      panelId,
      layout: "sections",
      sections,
    };
  }

  return {
    type: "simple",
    panelId,
    layout: "grid",
    items: children.map(toSimpleItem),
  };
}

/**
 * API 응답(FoGnbMenuApiNode[])을 gnbNavItems에 반영해 최종 nav 목록을 만든다.
 * - devices: 항상 정적 유지(변경 없음)
 * - markets/services/support/company: 이름이 정확히(trim, 대소문자 무시) "Markets"/"Services"/"Support"/"Company"인
 *   API 루트 노드를 찾아 megaMenu를 API 기반으로 override
 * - 매칭 실패 또는 children 비어있음(운영 초기 DB 미입력 등): 기존 정적 megaMenu 그대로 폴백
 * - 위 4개에 해당하지 않는 최상위 API 노드는 매칭 대상이 없으므로 무시
 */
export function resolveGnbNavItems(
  apiNodes: FoGnbMenuApiNode[] | null | undefined,
): GnbNavItem[] {
  // 정규화한 name → API 노드 인덱싱 (매칭 안 되는 노드는 자연스럽게 사용되지 않고 무시됨)
  const nodeByNavId = new Map<string, FoGnbMenuApiNode>();
  for (const node of apiNodes ?? []) {
    const navId = API_NAME_TO_NAV_ID[node.name?.trim().toLowerCase() ?? ""];
    if (navId) {
      nodeByNavId.set(navId, node);
    }
  }

  return gnbNavItems.map((item) => {
    // devices는 정적 유지
    if (item.id === "devices") {
      return item;
    }

    const node = nodeByNavId.get(item.id);
    // API 데이터 없음/매칭 실패 → 정적 폴백
    if (!node || (node.children?.length ?? 0) === 0) {
      return item;
    }

    return {
      ...item,
      megaMenu: buildSimpleMegaMenu(item.id, node),
    };
  });
}
