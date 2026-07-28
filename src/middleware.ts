import { NextResponse, type NextRequest } from "next/server";

// 일부 요청에 한해 현재 경로/쿼리를 x-pathname·x-search 요청 헤더로 실어 서버로 전달한다.
// - 목적(트레이닝): services 레이아웃(서버 컴포넌트)이 현재 경로/courseId 를 알아야 헤더 브레드크럼을 SSR 시점에
//   실 코스 제목으로 바로 렌더할 수 있다(코스상세=마지막 current, 세션상세=중간 "코스로 돌아가기" 크럼 라벨).
// - 목적(제품/카테고리): () 레이아웃이 현재 slug 를 알아야, 컨텍스트(?category=) 없이 들어온 요청에서
//   "본문이 고른 레코드와 같은 카테고리"를 산출해 브레드크럼에 넘길 수 있다(중복 slug 시 본문↔크럼 불일치 방지).
//   App Router 는 부모 레이아웃에 하위 동적 세그먼트 params/pathname/searchParams 를 주지 않으므로 이 헤더로 전달한다.
// - matcher 로 해당 경로에만 동작 → 그 외 요청엔 미실행(전역 오버헤드 없음).
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  // 쿼리까지 넘겨야 레이아웃이 "카테고리 컨텍스트가 이미 있는지"를 보고 불필요한 조회를 건너뛸 수 있다.
  requestHeaders.set("x-search", request.nextUrl.search);
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
    // Lv2 카테고리 / 제품 상세: 중복 slug 대비 브레드크럼 카테고리 폴백 산출용
    "/product-range/:slug",
    "/product/:slug",
  ],
};
