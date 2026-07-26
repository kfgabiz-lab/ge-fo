import { NextResponse, type NextRequest } from "next/server";

// 트레이닝 코스 상세(1뎁스)·세션 상세(2뎁스) 요청에 한해 현재 경로를 x-pathname 요청 헤더로 실어 서버로 전달한다.
// - 목적: services 레이아웃(서버 컴포넌트)이 현재 경로/courseId 를 알아야 헤더 브레드크럼을 SSR 시점에
//   실 코스 제목으로 바로 렌더할 수 있다(코스상세=마지막 current, 세션상세=중간 "코스로 돌아가기" 크럼 라벨).
//   App Router 는 부모 레이아웃에 하위 동적 세그먼트 params/pathname 을 주지 않으므로(services 레이아웃은
//   [courseId]/[sessionId] 를 알 수 없음) 이 헤더로 전달한다.
// - matcher 로 트레이닝 상세/세션 경로에만 동작 → 그 외 요청엔 미실행(전역 오버헤드 없음).
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // 코스 상세(1뎁스): 단일 courseId 세그먼트
    "/services/sales-training/:courseId",
    "/services/engineering-training/:courseId",
    "/services/service-training/:courseId",
    // 세션 상세(2뎁스): courseId/sessionId 세그먼트
    "/services/sales-training/:courseId/:sessionId",
    "/services/engineering-training/:courseId/:sessionId",
    "/services/service-training/:courseId/:sessionId",
  ],
};
