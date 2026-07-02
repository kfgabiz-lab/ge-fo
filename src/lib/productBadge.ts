export type ProductBadgeLevel = 1 | 2;

export type ProductBadgeSource = {
  badge?: boolean;
  badges?: ProductBadgeLevel;
};

export function getProductBadgeType(
  item: ProductBadgeSource,
): "type1" | "type2" | null {
  if (item.badges === 2) return "type2";
  if (item.badges === 1 || item.badge) return "type1";
  return null;
}
