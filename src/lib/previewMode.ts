import { cookies } from "next/headers";
import { fetchApi } from "@/lib/api";

const PREVIEW_COOKIE = "ge_preview";

export const PREVIEW_BANNER_ID_COOKIE = "ge_preview_banner_id";

/**
 * 미리보기 토큰을 검증하고, 유효하면 토큰 원문을 반환한다(무효/없음이면 null).
 * 이 토큰은 이후 page-data 상세 조회 요청에 previewToken 파라미터로 그대로 실어 보내서,
 * bo-api가 자체적으로 다시 한번 검증한 뒤에만 게시상태 게이트를 풀어주도록 한다.
 */
export async function getPreviewToken(
  slug: string,
  recordId: string | number,
): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PREVIEW_COOKIE)?.value;
  if (!token) return null;

  try {
    const params = new URLSearchParams({
      token,
      slug,
      recordId: String(recordId),
    });
    const res = await fetchApi<{ valid: boolean }>(
      `/api/v1/fo/preview-tokens/verify?${params.toString()}`,
    );
    return res.valid === true ? token : null;
  } catch {
    return null;
  }
}

export async function isPreviewActive(
  slug: string,
  recordId: string | number,
): Promise<boolean> {
  return (await getPreviewToken(slug, recordId)) !== null;
}

export async function getPreviewBannerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const recordId = cookieStore.get(PREVIEW_BANNER_ID_COOKIE)?.value;
  if (!recordId) return null;

  const valid = await isPreviewActive("banner-data", recordId);
  return valid ? recordId : null;
}
