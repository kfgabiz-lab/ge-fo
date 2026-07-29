
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

const SERVER_API_BASE =
  process.env.API_PROXY_TARGET || "http://localhost:8080";

export async function fetchApi<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const isServer = typeof window === "undefined";
  const url = isServer ? `${SERVER_API_BASE}${endpoint}` : endpoint;

  const headers = new Headers(init?.headers);
  if (!headers.has("X-Site-Id")) {
    headers.set("X-Site-Id", "1");
  }

  const cache = init?.cache ?? "no-store";

  const res = await fetch(url, { ...init, headers, cache });

  if (!res.ok) {
    throw new Error(
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
    headers.set("X-Site-Id", "1");
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
