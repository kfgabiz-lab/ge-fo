import { fetchData } from "@/lib/pageDataApi";
import type { FaqItem } from "./marketsContent";

export const MARKETS_FAQ_CODE = {
  dataCenter: "001",
  publicInfrastructure: "002",
  oilGasMining: "003",
  powerGrid: "004",
  industrial: "005",
  commercialResidential: "006",
} as const;

export type MarketsFaqCode =
  (typeof MARKETS_FAQ_CODE)[keyof typeof MARKETS_FAQ_CODE];

export async function fetchMarketsFaqItems(
  marketsCode: MarketsFaqCode,
): Promise<FaqItem[]> {
  try {
    const res = await fetchData({
      slug: "faq-data",
      where: {
        eq_main_category: "002",
        eq_is_visible: "001",
        eq_markets: marketsCode,
      },
      sort: "id,asc",
      size: 100,
    });

    return (res.content ?? []).map((row) => ({
      question: (row.question as string) ?? "",
      answer: (row.answer as string) ?? "",
    }));
  } catch {
    return [];
  }
}
