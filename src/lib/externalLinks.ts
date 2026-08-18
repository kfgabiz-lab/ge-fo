/* 배포 프로필 — ge-api(SPRING_PROFILES_ACTIVE)와 동일한 값을 공유한다(next.config.ts가
   NEXT_PUBLIC_PROFILE로 클라이언트 번들에도 노출).
   ge-api 기준 값: local / developer / dev(개발서버) / prod(운영) — 미설정 시 developer.
   운영으로 취급하려면 "prod"가 명시적으로 와야 한다 — 그 외(미설정 포함)는 전부 개발로 간주해서,
   운영 전용 값(예: 실제 도메인)을 프로필 설정을 깜빡해서 잘못 타는 사고를 막는다. */
const IS_PROD_DEPLOYMENT = process.env.NEXT_PUBLIC_PROFILE === "prod";

/* G-ICS / CTP(Connect Portal) 연결링크 — 위 배포 프로필에 따라 개발/운영 도메인 자동 분기.
   특정 값을 강제로 쓰고 싶을 때만 NEXT_PUBLIC_GICS_BASE_URL / NEXT_PUBLIC_CONNECT_PORTAL_BASE_URL 로 override. */

function resolveExternalBaseUrl(
  override: string | undefined,
  devUrl: string,
  prodUrl: string,
): string {
  return override || (IS_PROD_DEPLOYMENT ? prodUrl : devUrl);
}

export const GICS_BASE_URL = resolveExternalBaseUrl(
  process.env.NEXT_PUBLIC_GICS_BASE_URL,
  "https://gicstest.ls-electric.com",
  "https://gics.ls-electric.com",
);

export const CONNECT_PORTAL_BASE_URL = resolveExternalBaseUrl(
  process.env.NEXT_PUBLIC_CONNECT_PORTAL_BASE_URL,
  "https://connectdev.ls-electric.com",
  "https://connect.ls-electric.com",
);

// G-ICS index.do 진입 URL — 사용하는 곳(siteConfig/motorControl/contactUs) 전부 이 값 하나로 통일
export const GICS_INDEX_URL = `${GICS_BASE_URL}/public/index.do?lang=en&nation=US`;
