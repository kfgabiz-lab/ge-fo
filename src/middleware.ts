import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-search", request.nextUrl.search);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/services/sales-training/:courseId",
    "/services/engineering-training/:courseId",
    "/services/service-training/:courseId",
    "/services/sales-training/:courseId/:sessionId",
    "/services/engineering-training/:courseId/:sessionId",
    "/services/service-training/:courseId/:sessionId",
    "/product-range/:slug",
    "/product/:slug",
  ],
};
