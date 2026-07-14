// 통계 수치 문자열(카운트업 대상) 파싱/포맷 공통 유틸
// markets / company 등 카운트업 통계 UI에서 공통 사용

// 콤마/플러스 기호가 섞인 통계 문자열을 카운트업 가능한 숫자로 파싱한다.
// 숫자로 해석할 수 없으면 null 반환 → 호출부는 원본 문자열을 그대로 표시
export function parseNumericStatValue(value: string) {
  const trimmed = value.trim();
  const useComma = trimmed.includes(",");
  const normalized = trimmed.replace(/,/g, "").replace(/\+$/, "");

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const target = Number(normalized);
  if (!Number.isFinite(target)) {
    return null;
  }

  // 소수점 이하 자릿수 계산 (예: "12.5" → 1)
  const decimalPlaces = normalized.includes(".")
    ? normalized.split(".")[1]?.length ?? 0
    : 0;

  return { target, useComma, decimalPlaces };
}

// 카운트업 진행 중인 숫자를 표시 형식으로 변환한다.
// 소수 자릿수가 있으면 자릿수 유지, 없으면 콤마 포맷 여부에 따라 표시
export function formatStatNumber(
  value: number,
  useComma: boolean,
  decimalPlaces: number,
) {
  if (decimalPlaces > 0) {
    return value.toFixed(decimalPlaces);
  }

  return useComma ? value.toLocaleString("en-US") : String(value);
}
