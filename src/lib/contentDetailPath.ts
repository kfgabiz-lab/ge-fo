export function contentDetailPath(
  basePath: string,
  id: string | number,
  slug?: string | null,
): string {
  const base = `${basePath}/${id}`;
  return slug ? `${base}/${encodeURIComponent(slug)}` : base;
}
