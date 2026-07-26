/** Figma 8086:102342 — Main image popup (promo) */
// imageSrc/href 는 BE API(GET /api/v1/fo/popup) 응답(imageFileId/url)으로 대체됨.
// 아래 값들은 API 로 내려오지 않는 정적 텍스트(alt/버튼 라벨 등)만 남겨둔다.
export const mainImagePopupContent = {
  imageAlt: "Grid-Forming Technology White Paper — New Release",
  hideTodayLabel: "Don’t show again today",
  closeLabel: "Close",
  dialogLabel: "Promotion",
} as const;

// "Don't show again today" 저장 키(COOKIE_CONSENT_STORAGE_KEY 네이밍 관례 따름 — "ls-" 프리픽스 + kebab-case).
// 저장 값은 오늘 날짜 문자열 "YYYY-MM-DD"(브라우저 로컬 시간 기준).
export const MAIN_POPUP_HIDE_STORAGE_KEY = "ls-main-popup-hide";
