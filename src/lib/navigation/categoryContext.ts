export const CATEGORY_CONTEXT_PARAM = "category";

export function withCategoryContext(
  href: string,
  categoryId: number | string | null | undefined,
): string {
  if (!href) return href;
  const id =
    typeof categoryId === "number"
      ? Number.isFinite(categoryId)
        ? String(categoryId)
        : ""
      : (categoryId ?? "").trim();
  if (!id) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${CATEGORY_CONTEXT_PARAM}=${encodeURIComponent(id)}`;
}

export function parseCategoryContext(
  value: string | string[] | undefined | null,
): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function hrefPathname(href: string): string {
  const queryIndex = href.indexOf("?");
  return queryIndex === -1 ? href : href.slice(0, queryIndex);
}
