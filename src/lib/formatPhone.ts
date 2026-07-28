// 전화번호 "표시용" 포맷 공통 함수 (미국식 3-3-4)
// - href 용 변환(tel:+1...)은 별도 관심사라 여기서 다루지 않는다.
// - BO 관리자 입력값은 "8008912941" / "800-891-2941" / "(800) 891 2941" 등 형식이 섞일 수 있어
//   화면에서는 항상 이 함수를 통해 동일한 3-3-4 표기로 정규화한다.

// 미국식 표시 구분자
const SEPARATOR = "-";

/**
 * 표시용 전화번호 포맷(미국식 3-3-4).
 *
 * - 숫자 10자리        → "800-891-2941"
 * - 숫자 11자리(1 시작) → 국가번호 1 을 떼고 "800-891-2941"
 * - 그 외 자리수/빈값   → 원본 문자열을 그대로 반환(정보 손실 방지)
 *   · 내선번호/국제번호 등 예외 형식을 임의로 잘라내지 않는다.
 */
export function formatPhoneDisplay(phone: string | null | undefined): string {
  const raw = (phone ?? "").trim();
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");
  // 11자리 + 선행 1 은 미국 국가번호 → 제거 후 10자리로 취급
  const local =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (local.length !== 10) return raw;

  return [local.slice(0, 3), local.slice(3, 6), local.slice(6)].join(SEPARATOR);
}
