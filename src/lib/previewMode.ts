import { cookies } from "next/headers";
import { fetchApi } from "@/lib/api";

const PREVIEW_COOKIE = "ge_preview";

// 미리보기 쿠키를 읽어 BE에 재검증한다. 이 slug+recordId 조합에 대해서만 유효한지 확인.
// 쿠키 없음/검증 실패/네트워크 에러 등 모든 실패 케이스는 false로 처리(게이트 유지) — 실패를 "열림"으로 취급하지 않는다.
export async function isPreviewActive(
  slug: string,
  recordId: string | number,
): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PREVIEW_COOKIE)?.value;
  if (!token) return false;

  try {
    const params = new URLSearchParams({
      token,
      slug,
      recordId: String(recordId),
    });
    const res = await fetchApi<{ valid: boolean }>(
      `/api/v1/fo/preview-tokens/verify?${params.toString()}`,
    );
    return res.valid === true;
  } catch {
    return false;
  }
}
