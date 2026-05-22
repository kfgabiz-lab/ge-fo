import axios from 'axios';

/**
 * FO Axios 기본 인스턴스
 * - 인증 없음 (FO는 로그인 기능 없음)
 * - baseURL: NEXT_PUBLIC_API_URL 환경변수 사용
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export default api;
