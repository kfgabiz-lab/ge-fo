import { cache } from "react";
import { fetchApi } from "@/lib/api";
import { GNB_MEGA_PANEL_ID, getGnbMegaPanelId } from "@/data/gnb/panelIds";
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
  gnbTemplate: string | null;
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

export const fetchGnbMenuData = cache(
  async (): Promise<FoGnbMenuApiNode[]> => {
    try {
      return await fetchApi<FoGnbMenuApiNode[]>("/api/v1/fo/menus/gnb");
    } catch (error) {
      console.error("[GNB] menus/gnb 조회 실패, 정적 데이터로 폴백:", error);
      return [];
    }
  },
);

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
  gnbTemplate: string,
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
    panelId: getGnbMegaPanelId(gnbTemplate),
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
    return [];
  }

  return nodes.map((node) => {
    if (node.gnbTemplate === "devices") {
      return {
        id: "devices",
        label: node.name,
        href: node.url ?? "",
        megaMenu: devicesMegaMenu ?? undefined,
      };
    }

    const hasChildren = (node.children?.length ?? 0) > 0;
    const megaMenu = !hasChildren
      ? undefined
      : node.gnbTemplate === "markets"
        ? buildGridMegaMenu(node)
        : node.gnbTemplate
          ? buildSectionsMegaMenu(node, node.gnbTemplate)
          : undefined;

    return {
      id: String(node.id),
      label: node.name,
      href: node.url ?? "",
      megaMenu,
    };
  });
}
