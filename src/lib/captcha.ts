import { fetchApi } from "@/lib/api";

/**
 * GET /api/v1/public/captcha-image 응답 — 자체 구현 캡차(reCAPTCHA 대체).
 * 서버 상태 없이 정답+발급시각을 암호화한 captchaToken을 그대로 왕복시키는 stateless 방식이라
 * 제출 시 captchaCode와 함께 captchaToken도 반드시 같이 보내야 한다.
 */
export interface Captcha {
  captchaImage: string;
  captchaToken: string;
}

export function fetchCaptcha(): Promise<Captcha> {
  return fetchApi<Captcha>("/api/v1/public/captcha-image");
}
