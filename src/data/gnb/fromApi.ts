import { fetchApi } from "@/lib/api";
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import { gnbNavItems } from "@/data/gnb/navItems";
import type {
  GnbDevicesMegaMenu,
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
 * gnb.css는 #gnb-mega-panel-markets/services/support/company 등 "고정 문자열 id"를
 * 셀렉터로 그리드 컬럼 수·간격·hover 등을 지정한다(수백 줄 규모, 이번 작업에서 안 건드림).
 * panelId를 node.id로 동적 생성하면 이 CSS가 전혀 매칭되지 않으므로,
 * sortOrder 3번째부터는 기존 고정 문자열을 순서대로 그대로 재사용한다.
 * (careers까지 4슬롯 소진 후에는 대응 CSS가 없어 동적 id로 폴백 — 현재 데이터 범위 밖)
 */
const SECTIONS_PANEL_IDS_BY_POSITION = [
  GNB_MEGA_PANEL_ID.services,
  GNB_MEGA_PANEL_ID.support,
  GNB_MEGA_PANEL_ID.company,
  GNB_MEGA_PANEL_ID.careers,
];

/** sortOrder 2번째(grid) 전용 — children을 그대로 grid 항목으로 사용 */
function buildGridMegaMenu(node: FoGnbMenuApiNode): GnbSimpleMegaMenu {
  return {
    type: "simple",
    panelId: GNB_MEGA_PANEL_ID.markets,
    layout: "grid",
    items: (node.children ?? []).map(toSimpleItem),
  };
}

/** sortOrder 3번째 이후(sections) 전용 — children=섹션, 손자=항목 */
function buildSectionsMegaMenu(
  node: FoGnbMenuApiNode,
  sectionsPosition: number,
): GnbSimpleMegaMenu {
  const sections: GnbSimpleMegaSection[] = (node.children ?? []).map(
    (section) => ({
      id: String(section.id),
      label: section.name,
      items: (section.children ?? []).map(toSimpleItem),
    }),
  );

  return {
    type: "simple",
    panelId:
      SECTIONS_PANEL_IDS_BY_POSITION[sectionsPosition] ??
      `gnb-mega-panel-${node.id}`,
    layout: "sections",
    sections,
  };
}

/**
 * API 응답(FoGnbMenuApiNode[], BE에서 이미 sortOrder ASC로 정렬돼 옴)을 최종 nav 목록으로 변환.
 * name 매칭이나 children depth 추론을 쓰지 않고 "응답 순번"만으로 3가지 형태를 고정 결정한다
 * (admin이 메뉴명을 바꾸거나 트리 깊이가 아직 안 채워져 있어도 항상 같은 형태로 렌더됨):
 *   1번째: devices — label만 DB(node.name), children은 사용하지 않고 기존처럼
 *          category-data 기반 devicesMegaMenu(fetchDevicesMegaMenu)로 렌더
 *   2번째: grid — label/드롭다운 모두 DB(children을 항목으로)
 *   3번째 이후(개수 무관): sections — label/드롭다운 모두 DB(children=섹션, 손자=항목)
 * API 응답이 완전히 비어있으면(조회 실패 등) 기존 정적 gnbNavItems 그대로 폴백.
 */
export function resolveGnbNavItems(
  apiNodes: FoGnbMenuApiNode[] | null | undefined,
  devicesMegaMenu?: GnbDevicesMegaMenu | null,
): GnbNavItem[] {
  const nodes = apiNodes ?? [];
  if (nodes.length === 0) {
    return gnbNavItems;
  }

  return nodes.map((node, index) => {
    const order = index + 1;

    if (order === 1) {
      const fallback = gnbNavItems.find((item) => item.id === "devices");
      return {
        id: "devices",
        label: node.name,
        href: fallback?.href ?? "",
        megaMenu:
          devicesMegaMenu && devicesMegaMenu.categories.length > 0
            ? devicesMegaMenu
            : fallback?.megaMenu,
      };
    }

    const hasChildren = (node.children?.length ?? 0) > 0;

    return {
      id: String(node.id),
      label: node.name,
      href: node.url ?? "",
      megaMenu: !hasChildren
        ? undefined
        : order === 2
          ? buildGridMegaMenu(node)
          : buildSectionsMegaMenu(node, order - 3),
    };
  });
}
