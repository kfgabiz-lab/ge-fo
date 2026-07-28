import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { PREVIEW_BANNER_ID_COOKIE } from "@/lib/previewMode";

const PREVIEW_COOKIE = "ge_preview";
const PREVIEW_COOKIE_MAX_AGE = 5 * 60; // 5분 — BE 토큰 TTL과 동일

// 목록형 미리보기(배너) 진입 패턴.
// BO 렌더러(WidgetRenderer)는 redirect를 항상 "{externalUrl}/{recordId}" 로 조립하는데,
// 배너는 상세 라우트가 없어 "/main/{recordId}" 라는 실존하지 않는 경로로 들어온다.
// → 이 패턴일 때만 recordId를 쿠키로 옮기고 실제 존재하는 "/main" 으로 보낸다.
// articles/blog/events/press 의 "/company/{메뉴}/detail/{id}" 는 이 패턴에 걸리지 않으므로
// 기존과 동일하게 상세 경로로 그대로 리다이렉트된다.
const MAIN_LIST_PREVIEW_PATH = /^\/main\/(\d+)$/;

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

  // 배너(목록형) 미리보기 — recordId를 별도 쿠키로 옮기고 메인으로 보낸다.
  // 유효성 검증은 여기서 하지 않는다(토큰 쿠키와 동일 원칙) — 메인 렌더 시 getPreviewBannerId가 매번 재검증.
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

  // 상세 라우트 미리보기(articles/blog/events/press) — 기존 동작 그대로.
  // 이전 배너 미리보기 잔여 쿠키는 정리한다(메인에 엉뚱한 배너가 남아 보이지 않도록).
  cookieStore.delete(PREVIEW_BANNER_ID_COOKIE);
  return NextResponse.redirect(new URL(redirectParam, request.url));
}
