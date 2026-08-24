
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

export const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || "1";

const SERVER_API_BASE =
  process.env.API_PROXY_TARGET || "http://localhost:8080";

/**
 * fetchApi 실패 시 던지는 에러 — GlobalExceptionHandler 응답의 status/error 코드를 그대로 담는다.
 * message는 기존 진단용 문자열을 유지(서버 message는 한국어라 화면에 그대로 노출하지 않는다) —
 * 호출부는 code로 분기해 영문 안내 문구를 직접 결정한다.
 */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function fetchApi<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const isServer = typeof window === "undefined";
  const url = isServer ? `${SERVER_API_BASE}${endpoint}` : endpoint;

  const headers = new Headers(init?.headers);
  if (!headers.has("X-Site-Id")) {
    headers.set("X-Site-Id", SITE_ID);
  }

  const cache = init?.cache ?? "no-store";

  const res = await fetch(url, { ...init, headers, cache });

  if (!res.ok) {
    let code: string | undefined;
    try {
      const body = (await res.clone().json()) as { error?: string };
      code = body?.error;
    } catch {
      // 응답 본문이 JSON이 아닌 경우(네트워크/프록시 레벨 에러 등) — code 없이 진행
    }
    throw new ApiError(
      res.status,
      code,
      `fetchApi 실패: ${res.status} ${res.statusText} (${endpoint})`,
    );
  }

  return (await res.json()) as T;
}

export async function fetchApiText(
  endpoint: string,
  init?: RequestInit,
): Promise<string> {
  const isServer = typeof window === "undefined";
  const url = isServer ? `${SERVER_API_BASE}${endpoint}` : endpoint;

  const headers = new Headers(init?.headers);
  if (!headers.has("X-Site-Id")) {
    headers.set("X-Site-Id", SITE_ID);
  }

  const cache = init?.cache ?? "no-store";

  const res = await fetch(url, { ...init, headers, cache });

  if (!res.ok) {
    throw new Error(
      `fetchApiText 실패: ${res.status} ${res.statusText} (${endpoint})`,
    );
  }

  return await res.text();
}
