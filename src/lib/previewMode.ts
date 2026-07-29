import { cookies } from "next/headers";
import { fetchApi } from "@/lib/api";

const PREVIEW_COOKIE = "ge_preview";

export const PREVIEW_BANNER_ID_COOKIE = "ge_preview_banner_id";

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

export async function getPreviewBannerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const recordId = cookieStore.get(PREVIEW_BANNER_ID_COOKIE)?.value;
  if (!recordId) return null;

  const valid = await isPreviewActive("banner-data", recordId);
  return valid ? recordId : null;
}
