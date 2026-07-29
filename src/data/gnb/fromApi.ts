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

function toSimpleItem(node: FoGnbMenuApiNode): GnbSimpleMegaItem {
  const href = node.url ?? undefined;

  return {
    id: String(node.id),
    title: node.name,
    description: node.description ?? undefined,
    descriptionLines: node.description
      ? node.description.split("\n")
      : undefined,
    href,
    external: href?.startsWith("http") ?? false,
    disabled: false,
  };
}

export async function fetchGnbMenuData(): Promise<FoGnbMenuApiNode[]> {
  try {
    return await fetchApi<FoGnbMenuApiNode[]>("/api/v1/fo/menus/gnb");
  } catch (error) {
    console.error("[GNB] menus/gnb 조회 실패, 정적 데이터로 폴백:", error);
    return [];
  }
}

const SECTIONS_PANEL_IDS_BY_POSITION = [
  GNB_MEGA_PANEL_ID.services,
  GNB_MEGA_PANEL_ID.support,
  GNB_MEGA_PANEL_ID.company,
  GNB_MEGA_PANEL_ID.careers,
];

function buildGridMegaMenu(node: FoGnbMenuApiNode): GnbSimpleMegaMenu {
  return {
    type: "simple",
    panelId: GNB_MEGA_PANEL_ID.markets,
    layout: "grid",
    items: (node.children ?? []).map(toSimpleItem),
  };
}

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
