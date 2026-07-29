import GenericProductDetail from "./GenericProductDetail";
import SwProductDetail from "./SwProductDetail";

export default function ProductDetailRouter({
  slug,
  row,
  categoryId,
}: {
  slug: string;
  row: Record<string, unknown> | null;
  categoryId?: number;
}) {
  const isSw = row?.["page_type"] === "SW";

  if (isSw) {
    return <SwProductDetail slug={slug} row={row} categoryId={categoryId} />;
  }
  return <GenericProductDetail row={row} categoryId={categoryId} />;
}
