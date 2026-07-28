import { cookies } from "next/headers";
import { fetchApi } from "@/lib/api";

const PREVIEW_COOKIE = "ge_preview";

// 목록형 미리보기(배너) 대상 recordId 쿠키.
// 배너는 FO에 상세 라우트가 없어 "토큰이 가리키는 1건"을 목록 조회 결과에 끼워넣는 방식이라,
// 상세 페이지처럼 URL path에서 id를 얻을 수 없다. → /preview 라우트가 이 쿠키에 id를 옮겨 담는다.
export const PREVIEW_BANNER_ID_COOKIE = "ge_preview_banner_id";

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

// 목록 화면(메인)에서 "지금 이 배너 1건을 미리보기로 끼워넣어도 되는지" 판단한다.
// 쿠키의 recordId는 신뢰 대상이 아니므로, 반드시 기존 공통 함수 isPreviewActive로
// 토큰(ge_preview) + slug + recordId 일치까지 BE에 재검증한 뒤에만 id를 돌려준다.
// 검증 실패/쿠키 없음이면 null → 호출부는 평소대로 필터링된 목록만 노출(게이트 유지).
export async function getPreviewBannerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const recordId = cookieStore.get(PREVIEW_BANNER_ID_COOKIE)?.value;
  if (!recordId) return null;

  const valid = await isPreviewActive("banner-data", recordId);
  return valid ? recordId : null;
}
