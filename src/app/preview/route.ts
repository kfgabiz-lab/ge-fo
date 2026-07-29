import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { PREVIEW_BANNER_ID_COOKIE } from "@/lib/previewMode";

const PREVIEW_COOKIE = "ge_preview";
const PREVIEW_COOKIE_MAX_AGE = 5 * 60;

const MAIN_LIST_PREVIEW_PATH = /^\/main\/(\d+)$/;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirectParam = request.nextUrl.searchParams.get("redirect");

  const isSafeRedirect =
    !!redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//");

  if (!token || !isSafeRedirect) {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: PREVIEW_COOKIE_MAX_AGE,
  });

  const listPreviewMatch = MAIN_LIST_PREVIEW_PATH.exec(redirectParam);
  if (listPreviewMatch) {
    cookieStore.set(PREVIEW_BANNER_ID_COOKIE, listPreviewMatch[1], {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: PREVIEW_COOKIE_MAX_AGE,
    });
    return NextResponse.redirect(new URL("/main", request.url));
  }

  cookieStore.delete(PREVIEW_BANNER_ID_COOKIE);
  return NextResponse.redirect(new URL(redirectParam, request.url));
}
