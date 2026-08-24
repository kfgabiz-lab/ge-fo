
export const PHONE_MAX_DIGITS = 10;

/**
 * 한글 등 IME 조합 중인 change 이벤트인지 확인한다.
 * 조합 중에 필터(예: filterLetters)로 controlled input의 value를 강제로 바꾸면
 * 브라우저의 조합 상태가 깨지면서 입력창 전체(기존에 입력된 값 포함)가 지워질 수 있다 —
 * 조합 중에는 필터를 건너뛰고, onCompositionEnd에서 최종 값에만 필터를 적용해야 한다.
 */
export function isComposingEvent(event: { nativeEvent: Event }): boolean {
  return Boolean((event.nativeEvent as { isComposing?: boolean }).isComposing);
}

export function filterLetters(value: string, maxLength: number): string {
  return value.replace(/[^A-Za-z ]/g, "").slice(0, maxLength);
}

export function filterPhoneDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, PHONE_MAX_DIGITS);
}

export function filterEmail(value: string, maxLength: number): string {
  return value.replace(/[^A-Za-z0-9._@-]/g, "").slice(0, maxLength);
}

export function filterDigitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}
