import { NextRequest, NextResponse } from "next/server";

import { PREVIEW_BANNER_ID_COOKIE } from "@/lib/previewMode";

const PREVIEW_COOKIE = "ge_preview";
const PREVIEW_COOKIE_MAX_AGE = 5 * 60;

const MAIN_LIST_PREVIEW_PATH = /^\/main\/(\d+)$/;

/**
 * 상대 경로 Location으로 리다이렉트한다.
 * 리버스 프록시(IIS / Azure Front Door) 뒤에서 request.url이 내부 주소(localhost)로 잡히는
 * 환경이 있어, new URL(path, request.url)로 절대 URL을 만들면 Location이 localhost가 된다.
 * redirect 대상은 항상 "/"로 시작하는 검증된 경로이므로 상대 Location으로 보내면
 * 브라우저가 실제 접속 origin 기준으로 해석해 프록시 설정과 무관하게 동작한다.
 */
function redirectTo(path: string): NextResponse {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirectParam = request.nextUrl.searchParams.get("redirect");

  const isSafeRedirect =
    !!redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//");

  if (!token || !isSafeRedirect) {
    return redirectTo("/main");
  }

  const safePath = redirectParam as string;
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: PREVIEW_COOKIE_MAX_AGE,
  };

  const listPreviewMatch = MAIN_LIST_PREVIEW_PATH.exec(safePath);
  const res = redirectTo(listPreviewMatch ? "/main" : safePath);

  res.cookies.set(PREVIEW_COOKIE, token, cookieOpts);
  if (listPreviewMatch) {
    res.cookies.set(PREVIEW_BANNER_ID_COOKIE, listPreviewMatch[1], cookieOpts);
  } else {
    res.cookies.delete(PREVIEW_BANNER_ID_COOKIE);
  }
  return res;
}
