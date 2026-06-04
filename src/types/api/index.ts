/**
 * API 공통 타입 정의
 * 사용법: import type { ApiError } from '@/types/api'
 */

/** API 에러 타입 */
export type ApiError = {
  status: number;
  message: string;
  code?: string;
};
