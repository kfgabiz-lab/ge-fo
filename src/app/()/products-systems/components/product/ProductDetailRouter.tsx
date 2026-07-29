import GenericProductDetail from "./GenericProductDetail";
import SwProductDetail from "./SwProductDetail";

export default function ProductDetailRouter({
  slug,
  row,
}: {
  slug: string;
  row: Record<string, unknown> | null;
}) {
  const isSw = row?.["page_type"] === "SW";

  if (isSw) {
    return <SwProductDetail slug={slug} row={row} />;
  }
  return <GenericProductDetail row={row} />;
}
