import { fetchData } from "@/lib/pageDataApi";

export function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * 라우트 파라미터가 숫자 id면 그대로 사용하고, 아니면 seo.slug로 검색해 실제 id를 찾는다.
 * product의 resolveProductIdBySlug/fetchProductDetailBySlug와 동일한 발상 — 새 백엔드 엔드포인트 불필요.
 */
export async function resolveContentId(
  contentSlug: string,
  idOrSlug: string,
  where: Record<string, string> = {},
): Promise<string | null> {
  if (isNumericId(idOrSlug)) return idOrSlug;
  const res = await fetchData<{ id: number }>({
    slug: contentSlug,
    where: { ...where, "eq_seo.slug": idOrSlug },
    size: 1,
    리턴함수: (rows) => rows.map((r) => ({ id: r.id })),
  });
  return res.content[0] ? String(res.content[0].id) : null;
}
