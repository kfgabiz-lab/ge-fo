// 날짜 표시 포맷 공통 함수
// - bo PageData의 publish_dttm 등 "YYYY-MM-DD" 문자열을 화면 표기용 "Mon D, YYYY"로 변환
// - new Date() 파싱은 타임존에 따라 하루 밀릴 수 있어 사용하지 않고 문자열을 직접 split하여 처리
// - 파싱 불가/빈 값은 에러 없이 빈 문자열 반환(화면 깨짐 방지)

// 월 숫자(1~12) → 영문 약어 매핑(index 0 자리 placeholder)
const MONTH_ABBR = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "2026-04-17" → "Apr 17, 2026"
// 빈 문자열/undefined/형식 불일치 시 빈 문자열 반환
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  // "2026-04-17" 또는 "2026-04-17T..." 형태 모두 앞 10자리만 사용
  const datePart = dateStr.trim().slice(0, 10);
  const parts = datePart.split("-");
  if (parts.length !== 3) return "";
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  // 숫자 파싱 실패 또는 범위 이탈 시 빈 문자열
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return "";
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  // day는 항상 2자리 zero-pad("Apr 02, 2026") — 1~9일 표기 통일
  return `${MONTH_ABBR[month]} ${String(day).padStart(2, "0")}, ${year}`;
}

// "2026-02" → "Feb, 2026"
// 월/년 헤더 라벨용(월 축약 영문 3자 + 콤마 + 공백 + 4자리 연도)
// 빈 문자열/undefined/형식 불일치 시 빈 문자열 반환
export function formatMonthLabel(monthKey: string): string {
  if (!monthKey || typeof monthKey !== "string") return "";
  // "2026-02" 또는 "2026-02-17" 형태 모두 앞 7자리만 사용
  const parts = monthKey.trim().slice(0, 7).split("-");
  if (parts.length !== 2) return "";
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  // 숫자 파싱 실패 또는 범위 이탈 시 빈 문자열
  if (!Number.isInteger(year) || !Number.isInteger(month)) return "";
  if (month < 1 || month > 12) return "";
  return `${MONTH_ABBR[month]}, ${year}`;
}

// "2026-04-17", "2026-04-19" → "Apr 17, 2026 - Apr 19, 2026"
// from/to 중 한쪽이 비면 있는 쪽만 formatDisplayDate로 반환(양쪽 다 전체 표기, 축약 없음)
export function formatDisplayDateRange(from: string, to: string): string {
  const fromStr = formatDisplayDate(from);
  const toStr = formatDisplayDate(to);
  if (fromStr && toStr) return `${fromStr} - ${toStr}`;
  return fromStr || toStr;
}
