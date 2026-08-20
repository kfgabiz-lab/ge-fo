import { fetchData } from "@/lib/pageDataApi";

export function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

async function findIdBySlug(
  contentSlug: string,
  slugValue: string,
  where: Record<string, string>,
): Promise<string | null> {
  const res = await fetchData<{ id: number }>({
    slug: contentSlug,
    where: { ...where, "eq_seo.slug": slugValue },
    size: 1,
    리턴함수: (rows) => rows.map((r) => ({ id: r.id })),
  });
  return res.content[0] ? String(res.content[0].id) : null;
}

/**
 * 라우트 파라미터를 실제 page_data id로 해석한다. product의 resolveProductIdBySlug/
 * fetchProductDetailBySlug와 동일한 발상 — 새 백엔드 엔드포인트 불필요.
 *
 * "2"처럼 숫자로만 된 slug가 실제 id와 겹쳐 보이는 경우가 있어(예: 코스 slug를 "2"로 등록),
 * 값이 숫자여도 항상 slug 조회를 먼저 시도하고, 매칭되는 slug가 없을 때만 그 숫자를
 * id로 취급한다 — slug 조회는 가벼운 검색 API라 비용이 크지 않지만, 숫자 id 접근에도
 * 매번 조회가 한 번 더 붙는다는 점은 감안할 것.
 */
export async function resolveContentId(
  contentSlug: string,
  idOrSlug: string,
  where: Record<string, string> = {},
): Promise<string | null> {
  const bySlug = await findIdBySlug(contentSlug, idOrSlug, where);
  if (bySlug != null) return bySlug;
  return isNumericId(idOrSlug) ? idOrSlug : null;
}
