// 폼 입력 필터 공통 함수.
// Training 관련 폼(Request for Training Step1/Step3, 세션 상세 등록 폼)에서
// 동일한 입력 제한 규칙을 중복 정의하던 것을 한 곳으로 모은 것.
// 최대 길이는 화면(기획서)마다 다르므로 상수로 고정하지 않고 인자로 받는다.

// 전화번호 자릿수 상한: 지역코드 3 + 국번 3 + 가입자번호 4 = 10자리
export const PHONE_MAX_DIGITS = 10;

// 영문만 입력 허용(영문 대소문자 + 공백). 그 외 문자는 입력 즉시 제거.
export function filterLetters(value: string, maxLength: number): string {
  return value.replace(/[^A-Za-z ]/g, "").slice(0, maxLength);
}

// 숫자만 입력 허용. 전화번호 자릿수(PHONE_MAX_DIGITS)까지만 유지.
export function filterPhoneDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, PHONE_MAX_DIGITS);
}

// 이메일 허용 문자(영문/숫자/. _ @ -)만 입력 허용.
export function filterEmail(value: string, maxLength: number): string {
  return value.replace(/[^A-Za-z0-9._@-]/g, "").slice(0, maxLength);
}
