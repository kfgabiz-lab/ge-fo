import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

export const MARKETS_GNB_HREF_ORDER = [
  "/markets/data-center",
  "/markets/power-grid",
  "/markets/oil-gas-mining",
  "/markets/public-infrastructure",
  "/markets/industrial",
  "/markets/commercial-residential",
] as const;

export const MARKETS_GNB_ID_ORDER = [
  "data-center",
  "power-grid",
  "oil-gas-mining",
  "public-infrastructure",
  "industrial",
  "commercial-residential",
] as const;

export function sortMarketsGnbItems<T extends { id: string; href?: string }>(
  items: T[],
): T[] {
  const orderByHref = new Map(
    MARKETS_GNB_HREF_ORDER.map((href, index) => [href, index]),
  );
  const orderById = new Map(
    MARKETS_GNB_ID_ORDER.map((id, index) => [id, index]),
  );

  return [...items].sort((a, b) => {
    const aOrder =
      (a.href ? orderByHref.get(a.href as (typeof MARKETS_GNB_HREF_ORDER)[number]) : undefined) ??
      orderById.get(a.id as (typeof MARKETS_GNB_ID_ORDER)[number]) ??
      Number.MAX_SAFE_INTEGER;
    const bOrder =
      (b.href ? orderByHref.get(b.href as (typeof MARKETS_GNB_HREF_ORDER)[number]) : undefined) ??
      orderById.get(b.id as (typeof MARKETS_GNB_ID_ORDER)[number]) ??
      Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
}

export const marketsMegaMenu: GnbSimpleMegaMenu = {
  type: "simple",
  panelId: GNB_MEGA_PANEL_ID.markets,
  layout: "grid",
  items: sortMarketsGnbItems([
    {
      id: "data-center",
      title: "Data Center",
      descriptionLines: [
        "Hyperscale / Colocation / Edge Computing /",
        "Telecom",
      ],
      href: "/markets/data-center",
    },
    {
      id: "power-grid",
      title: "Power Grid",
      descriptionLines: [
        "Power Generation, Transmission and Distribution / ",
        "Microgrids / BESS / Utilities / Renewables",
      ],
      href: "/markets/power-grid",
    },
    {
      id: "oil-gas-mining",
      title: "Oil & Gas, Mining Industries",
      descriptionLines: [
        "Petroleum, Chemical Refineries / Metals & Mining / ",
        "Marine",
      ],
      href: "/markets/oil-gas-mining",
    },
    {
      id: "public-infrastructure",
      title: "Public Infrastructure",
      descriptionLines: [
        "Federal, State, and Municipal Government / Airports / ",
        "Water and Wastewater / Healthcare",
      ],
      href: "/markets/public-infrastructure",
    },
    {
      id: "industrial",
      title: "Industrial",
      descriptionLines: [
        "Automotive / Semiconductor / Machinery /",
        "Food & Beverage",
      ],
      href: "/markets/industrial",
    },
    {
      id: "commercial-residential",
      title: "Commercial & Residential",
      descriptionLines: [
        "Hotels / Retail Stores / Logistics /",
        "Commercial Buildings / Residential",
      ],
      href: "/markets/commercial-residential",
    },
  ]),
};
