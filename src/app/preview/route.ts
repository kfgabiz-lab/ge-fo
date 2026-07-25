import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PREVIEW_COOKIE = "ge_preview";
const PREVIEW_COOKIE_MAX_AGE = 5 * 60; // 5분 — BE 토큰 TTL과 동일

// BO 미리보기 버튼 클릭 시 최종 진입점. 토큰을 httpOnly 쿠키로 심고 실제 상세 페이지로 리다이렉트한다.
// 실제 토큰 유효성 검증은 각 상세 페이지가 쿠키를 읽어 매번 재검증한다(lib/previewMode.ts) — 이 라우트는 세팅만 담당.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirectParam = request.nextUrl.searchParams.get("redirect");

  // 오픈 리다이렉트 차단 — "/"로 시작하는 내부 경로만 허용, "//"(프로토콜 상대 URL)는 거부
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

  return NextResponse.redirect(new URL(redirectParam, request.url));
}
