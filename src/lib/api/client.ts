import type { ApiError } from '@/types/api';

/**
 * FO API 공통 fetch 함수
 * 사용법: const data = await fetchApi<GnbMenuResponse[]>('/fo/menus/gnb')
 * - NEXT_PUBLIC_API_URL(/api/v1) + endpoint 조합
 * - next.config.ts의 rewrites가 localhost:8080으로 프록시
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
  const url = `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let message = '요청에 실패했습니다.';
    let code: string | undefined;

    try {
      const body = await res.json();
      message = body.message ?? message;
      code = body.code;
    } catch {
      // 응답 바디 파싱 실패 시 기본 메시지 사용
    }

    const error: ApiError = { status: res.status, message, code };
    throw error;
  }

  return res.json() as Promise<T>;
}
