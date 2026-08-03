import { fetchApi } from "@/lib/api";
import { resolveImageUrlFromJsonText } from "@/app/()/products-systems/data/productsSystemsData";
import type { ProductItem } from "./marketsContent";

export const MARKETS_PRODUCTS_NAME = {
  dataCenter: "data-center",
  powerGrid: "power-grid",
  publicInfrastructure: "public-infrastructure",
  industrial: "industrial",
  oilGasMining: "oil-gas-mining",
  commercialResidential: "commercial-residential",
} as const;

export type MarketsProductsName =
  (typeof MARKETS_PRODUCTS_NAME)[keyof typeof MARKETS_PRODUCTS_NAME];

interface MarketProductRow {
  id: number;
  type: string | null;
  code: string | null;
  title: string | null;
  categoryTitle: string | null;
  slug: string | null;
  image: string | null;
  awards: string | null;
}

function resolveHref(type: string | null, slug: string | null): string {
  if (!slug) return "";
  if (type === "product") return `/product/${slug}`;
  if (type === "category") return `/product-range/${slug}`;
  return "";
}

export async function fetchMarketProducts(
  name: MarketsProductsName,
): Promise<ProductItem[]> {
  try {
    const rows = await fetchApi<MarketProductRow[]>(
      `/api/v1/fo/markets/${name}/products`,
    );
    return rows.map((row) => ({
      id: `${row.type ?? "item"}-${row.id}`,
      href: resolveHref(row.type, row.slug),
      image: resolveImageUrlFromJsonText(row.image) ?? "",
      title: row.title ?? "",
      category: row.categoryTitle ?? "",
      badges: row.awards === "01" ? (2 as const) : undefined,
    }));
  } catch {
    return [];
  }
}
