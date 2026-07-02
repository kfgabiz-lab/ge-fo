/**
 * 문자열이 비어있는지 확인
 */
export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === "";
}

/**
 * 문자열을 주어진 길이로 자르고 말줄임표 추가
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}
