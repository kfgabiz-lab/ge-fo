import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-search", request.nextUrl.search);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/services/training/course/:id/:slug",
    "/services/training/course/:id",
    "/services/training/session/:id/:slug",
    "/services/training/session/:id",
    "/product-range/:id/:slug",
    "/product/:id/:slug",
  ],
};
