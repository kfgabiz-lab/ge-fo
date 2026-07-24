// 사이트(NAHP) 고정 timezone 기준의 "오늘"을 구하는 공통 유틸
// - 게시기간/노출 판정(지난 이벤트 제외·과거 교육회차 제외 등)에서 "오늘"의 기준을,
//   방문자 브라우저나 FO 서버의 로컬 타임존이 아니라 사이트가 서비스되는 지역 기준으로 통일한다.
// - 외부 날짜 라이브러리 없이 네이티브 Intl.DateTimeFormat 의 timeZone 옵션만 사용.
//
// ⚠️ SITE_TIME_ZONE 값은 BO 사이트관리 > NAHP 사이트의 timezone 설정과 일치해야 한다.
//    현재 FO 는 site_id="1"(북미) 단일 서비스라 상수로 고정한다. 향후 사이트별 동적 조회가
//    필요해지면 이 상수를 BO site.timezone 조회 값으로 대체한다.
export const SITE_TIME_ZONE = "America/New_York";

// 사이트 타임존 기준 "오늘"의 연/월/일(월은 1~12).
// Intl 로 해당 타임존의 벽시계(wall-clock) 날짜를 구한다.
function siteTodayParts(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

// 사이트 타임존 기준 "오늘" "YYYY-MM-DD" 문자열.
export function siteTodayStr(): string {
  const { year, month, day } = siteTodayParts();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// 사이트 타임존 기준 "오늘"을 (로컬 자정) Date 로 반환.
// - 반환 Date 의 getFullYear()/getMonth()/getDate() 는 사이트 타임존의 오늘 연/월/일과 일치한다.
//   (기존 코드가 이 로컬 접근자로 날짜 계산을 하므로 별도 리팩토링 없이 그대로 재사용 가능)
export function siteToday(): Date {
  const { year, month, day } = siteTodayParts();
  return new Date(year, month - 1, day);
}
