import { NextRequest, NextResponse } from "next/server";

/*
 * AppScan에서 주로 사용하는 단순 XSS 테스트 패턴을 차단합니다.
 *
 * 주의:
 * 이것은 XSS의 보조 방어 수단입니다.
 * 실제 출력값에 대한 HTML escaping 및 안전한 React 렌더링은 별도로 필요합니다.
 */
const suspiciousPattern =
    /[<>"'`;]|javascript:|alert\s*\(|onerror\s*=|onload\s*=/i;

/*
 * proxy.ts가 직접 생성하는 오류 응답에는 next.config.ts의 headers가
 * 기대한 방식으로 적용되지 않을 가능성에 대비해 동일한 헤더를 직접 설정합니다.
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set("X-Content-Type-Options", "nosniff");

    response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
    );

    response.headers.set(
        "Cross-Origin-Resource-Policy",
        "same-origin"
    );

    response.headers.set(
        "Cross-Origin-Opener-Policy",
        "same-origin"
    );

    /*
     * Google Maps와 YouTube 연동을 차단하므로 적용하지 않습니다.
     *
     * response.headers.set(
     *   "Cross-Origin-Embedder-Policy",
     *   "require-corp"
     * );
     */

    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );

    return response;
}

function badRequest(): NextResponse {
    return applySecurityHeaders(
        new NextResponse("Bad Request", {
            status: 400,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-store",
            },
        })
    );
}

export function proxy(request: NextRequest): NextResponse {
    const { pathname, searchParams } = request.nextUrl;

    /*
     * AppScan XSS 테스트 대응:
     * 루트 경로에 허용되지 않은 HTTP Method가 들어오면 차단합니다.
     */
    if (pathname === "/") {
        if (request.method !== "GET" && request.method !== "HEAD") {
            return badRequest();
        }

        /*
         * 루트 경로의 query parameter 이름과 값을 검사합니다.
         */
        for (const [key, value] of searchParams.entries()) {
            if (
                suspiciousPattern.test(key) ||
                suspiciousPattern.test(value)
            ) {
                return badRequest();
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};