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

/*
 * Azure App Service 앞단(플랫폼 프론트엔드)이 실제 접속 IP를 X-Forwarded-For의
 * 마지막 값으로 붙여준다 — 클라이언트가 헤더에 값을 미리 넣어 보내도 앞쪽에 이어붙여질
 * 뿐이므로, 마지막 값만 취하면 위조 불가능한 실제 접속 IP를 얻을 수 있다.
 * 이 값으로 헤더 전체를 덮어써서 /api/v1 rewrite 대상(API 서버)에는 검증된 단일 IP만 전달한다.
 * (ge-bo/src/middleware.ts의 withTrustedForwardedFor()와 동일 로직)
 */
function withTrustedForwardedFor(request: NextRequest): Headers {
    const headers = new Headers(request.headers);
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const realIp = forwardedFor.split(",").map((v) => v.trim()).filter(Boolean).pop();
        if (realIp) {
            headers.set("x-forwarded-for", realIp);
        }
    }
    return headers;
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

    return NextResponse.next({ request: { headers: withTrustedForwardedFor(request) } });
}

export const config = {
    matcher: ["/:path*"],
};