import { fetchData } from "@/lib/pageDataApi";
import { pickField } from "@/lib/pageData";

export interface WarrantyCoverageRow {
  id: string;
  product: string;
  category: string;
  warranty: string;
}

const PRODUCT_TYPE_LABEL: Record<string, string> = {
  "001": "Power Production",
  "002": "Power Orders",
  "003": "Automation",
};

export async function fetchWarrantyCoverageRows(): Promise<WarrantyCoverageRow[]> {
  let content: Record<string, unknown>[];
  try {
    const res = await fetchData({ slug: "warrantyPolicy-data", size: 100 });
    content = res.content;
  } catch {
    return [];
  }

  return content
    .map((row) => ({
      id: row._id as number,
      productName: (pickField(row, "product_name", "productNm") as string) ?? "",
      productType: (pickField(row, "product_type", "productType") as string) ?? "",
      warranty: (pickField(row, "warranty_period", "warrantyPeriod") as string) ?? "",
      isVisible: (pickField(row, "is_visible", "isVisible") as string) ?? "",
      createdAt: (row.createdAt as string | null) ?? "",
    }))
    .filter((row) => row.isVisible === "001")
    .sort((a, b) => {
      if (a.productType !== b.productType) {
        return a.productType < b.productType ? -1 : 1;
      }
      if (a.productName !== b.productName) {
        return a.productName.localeCompare(b.productName);
      }
      return b.id - a.id;
    })
    .map((row) => ({
      id: String(row.id),
      product: row.productName,
      category: PRODUCT_TYPE_LABEL[row.productType] ?? row.productType,
      warranty: row.warranty,
    }));
}
