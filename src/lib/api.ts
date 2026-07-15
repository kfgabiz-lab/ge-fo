// fo → bo-api 공통 호출 함수
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md 4절
// - 컴포넌트에서 직접 fetch() 금지, 반드시 이 함수 경유
// - endpoint 는 항상 "/api/v1/fo/..." 로 시작 (next.config.ts rewrites 프록시 대상과 일치)
// - 브라우저 실행 시: 상대경로 그대로 (현재 origin 기준 해석)
// - 서버(SSR/서버 컴포넌트) 실행 시: Node fetch 는 상대경로를 해석 못 하므로
//   NEXT_PUBLIC_SITE_URL 을 붙여 절대주소로 호출 (내부적으로는 여전히 fo 서버 rewrites 프록시를 거침)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

export async function fetchApi<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const isServer = typeof window === "undefined";
  const url = isServer ? `${SITE_URL}${endpoint}` : endpoint;

  // 북미(site_id=1) 사이트 스코프 — X-Site-Id 헤더 전역 주입
  // 호출자가 명시적으로 지정한 경우는 존중(덮어쓰지 않음)
  const headers = new Headers(init?.headers);
  if (!headers.has("X-Site-Id")) {
    headers.set("X-Site-Id", "1");
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    throw new Error(
      `fetchApi 실패: ${res.status} ${res.statusText} (${endpoint})`,
    );
  }

  return (await res.json()) as T;
}
