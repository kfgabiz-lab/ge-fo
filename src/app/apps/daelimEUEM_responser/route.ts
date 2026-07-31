import { NextRequest, NextResponse } from "next/server";

/**
 * 대림 EUEM(최종사용자경험 모니터링) 클라이언트 IP/세션 조회 엔드포인트.
 * daelimEUEM_begin.js의 euem-endpoint meta 태그가 same-origin으로 호출한다.
 * 원본 daelimEUEM_responser.jsp/aspx와 동일한 응답 계약을 유지한다.
 */
export async function GET(request: NextRequest) {
  const headers = request.headers;

  const xRealIp = headers.get("x-real-ip") ?? "";

  const xOriginalForwardedFor = headers.get("x-original-forwarded-for");
  const xForwardedFor = xOriginalForwardedFor
    ? (xOriginalForwardedFor.split(",")[0]?.trim() ?? "")
    : (headers.get("x-forwarded-for") ?? "");

  // Next.js에는 원본 jsp의 request.getRemoteAddr()(TCP peer)에 대응하는 API가 없다.
  // x-forwarded-for 체인에서 서버와 가장 가까운(마지막) 홉으로 근사한다.
  const forwardedForChain = headers.get("x-forwarded-for");
  const remoteAddr = forwardedForChain
    ? (forwardedForChain.split(",").pop()?.trim() ?? "")
    : "";

  const jsessionid = request.cookies.get("JSESSIONID")?.value ?? "";

  return NextResponse.json({
    xRealIp,
    xForwardedFor,
    remoteAddr,
    JSESSIONID: jsessionid,
  });
}
