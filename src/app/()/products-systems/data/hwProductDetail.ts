import type { ProductDetail } from "./productDetailContent";
import { mapHwProductData } from "./productsSystemsData";
import { getYoutubeIdFromUrl } from "@/lib/youtubeEmbed";

export function buildHwProductDetail(
  row: Record<string, unknown> | null,
  base: ProductDetail,
): { detail: ProductDetail; productId: number | null } {
  if (!row) return { detail: base, productId: null };

  const data = mapHwProductData(row);
  const detail: ProductDetail = {
    ...base,
    series: data.name,
    description: (row["product_info.info_description"] as string) ?? "",
    image: data.image,
    specs: data.specs.map((s) => ({ label: s.title, value: s.content })),
    keyFeatures: data.keyFeatures.map((f, i) => ({
      id: `kf-${i + 1}`,
      title: f.title,
      description: f.content,
    })),
    youtubeVideoId: getYoutubeIdFromUrl(data.video),
    configuratorHref: data.connectPortal,
    connectPortal: data.connectPortal,
    lineUp: data.lineUp,
    awards: data.awards,
  };
  return { detail, productId: Number(row._id) };
}
