/**
 * 날짜를 원하는 형식으로 반환
 * @param dateStr - ISO 날짜 문자열
 * @param locale - 로케일 (기본: en-US)
 */
export function formatDate(dateStr: string, locale = "en-US"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

/**
 * 숫자에 천 단위 콤마 추가
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}
