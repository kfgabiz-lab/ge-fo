export const EXPLORE_ALL_PRODUCTS_PATH = "/products-systems/explore-all";

export type GnbExploreProduct = {
  id: string;
  label: string;
  href: string;
  discontinued?: boolean;
  lv2Ids?: string[];
};

export type GnbExploreLetterGroup = {
  letter: string;
  items: GnbExploreProduct[];
};

function getFirstLetter(label: string): string {
  const match = label.replace(/^\s+/, "").match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

export function groupExploreProductsByLetter(
  products: GnbExploreProduct[],
): GnbExploreLetterGroup[] {
  const groups = new Map<string, GnbExploreProduct[]>();

  for (const item of products) {
    const letter = getFirstLetter(item.label);
    const bucket = groups.get(letter) ?? [];
    bucket.push(item);
    groups.set(letter, bucket);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    }));
}

export function chunkLetterGroups<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}
