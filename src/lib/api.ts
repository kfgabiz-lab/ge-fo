// fo → bo-api 공통 호출 함수
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md 4절
// - 컴포넌트에서 직접 fetch() 금지, 반드시 이 함수 경유
// - endpoint 는 항상 "/api/v1/fo/..." 로 시작 (next.config.ts rewrites 프록시 대상과 일치)
// - 브라우저 실행 시: 상대경로 그대로 (현재 origin 기준 해석, next.config.ts rewrites 로 bo-api 프록시)
// - 서버(SSR/서버 컴포넌트) 실행 시: Node fetch 는 상대경로를 해석 못 하므로
//   bo-api 서버 주소(SERVER_API_BASE)를 붙여 절대주소로 bo-api 에 직접 요청한다.
//   (fo 서버 자기 자신을 거쳐 rewrites 프록시를 다시 타는 자기참조 왕복은 하지 않음)

// 사이트 절대주소(OG 이미지 절대경로 구성 등 fo 자기 자신을 가리켜야 하는 용도에 사용)
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

// 서버사이드 API 호출 전용 base 주소 — bo-api 로 직접 요청(next.config.ts rewrites destination과 동일 패턴)
const SERVER_API_BASE =
  process.env.API_PROXY_TARGET || "http://localhost:8080";

export async function fetchApi<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const isServer = typeof window === "undefined";
  const url = isServer ? `${SERVER_API_BASE}${endpoint}` : endpoint;

  // 북미(site_id=1) 사이트 스코프 — X-Site-Id 헤더 전역 주입
  // 호출자가 명시적으로 지정한 경우는 존중(덮어쓰지 않음)
  const headers = new Headers(init?.headers);
  if (!headers.has("X-Site-Id")) {
    headers.set("X-Site-Id", "1");
  }

  // 캐시 미지정 시 항상 최신 조회(no-store), caller 지정 시 존중
  const cache = init?.cache ?? "no-store";

  const res = await fetch(url, { ...init, headers, cache });

  if (!res.ok) {
    throw new Error(
      `fetchApi 실패: ${res.status} ${res.statusText} (${endpoint})`,
    );
  }

  return (await res.json()) as T;
}
