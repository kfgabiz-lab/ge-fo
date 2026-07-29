export const CATEGORY_CONTEXT_PARAM = "category";
export const PRODUCT_CONTEXT_PARAM = "product";

function normalizeContextId(value: number | string | null | undefined): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  return (value ?? "").trim();
}

function withContextParam(
  href: string,
  param: string,
  value: number | string | null | undefined,
): string {
  if (!href) return href;
  const id = normalizeContextId(value);
  if (!id) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}${param}=${encodeURIComponent(id)}`;
}

function parseContextId(
  value: string | string[] | undefined | null,
): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function withCategoryContext(
  href: string,
  categoryId: number | string | null | undefined,
): string {
  return withContextParam(href, CATEGORY_CONTEXT_PARAM, categoryId);
}

export function withProductContext(
  href: string,
  productId: number | string | null | undefined,
): string {
  return withContextParam(href, PRODUCT_CONTEXT_PARAM, productId);
}

export function withProductInquiryContext(
  href: string,
  categoryId: number | string | null | undefined,
  productId: number | string | null | undefined,
): string {
  return withProductContext(withCategoryContext(href, categoryId), productId);
}

export function parseCategoryContext(
  value: string | string[] | undefined | null,
): number | undefined {
  return parseContextId(value);
}

export function parseProductContext(
  value: string | string[] | undefined | null,
): number | undefined {
  return parseContextId(value);
}

export function hrefPathname(href: string): string {
  const queryIndex = href.indexOf("?");
  return queryIndex === -1 ? href : href.slice(0, queryIndex);
}
