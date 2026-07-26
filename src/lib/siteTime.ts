// 사이트(NAHP) timezone/locale 기준 공통 유틸
// - 게시기간/노출 판정(지난 이벤트 제외·과거 교육회차 제외 등)에서 "오늘"의 기준을,
//   방문자 브라우저나 FO 서버의 로컬 타임존이 아니라 사이트가 서비스되는 지역 기준으로 통일한다.
// - 외부 날짜 라이브러리 없이 네이티브 Intl.DateTimeFormat 의 timeZone 옵션만 사용.
//
// SITE_TIME_ZONE/SITE_LOCALE 은 BO 사이트관리(FoSiteController, GET /api/v1/fo/site-settings)에서
// 서버 기동 후 최초 1회 조회해 채워진다(loadSiteSettings). 조회 전/실패 시에는 아래 기본값을 그대로 쓴다.
// ⚠️ fetch 옵션은 반드시 no-store — force-cache를 쓰면 Next.js가 이 fetch 결과 자체를 영속 캐시해
// 버려서, 아래 siteSettingsLoaded 플래그로 만든 "서버 프로세스당 1회"가 아니라 "영구 고정"이 되고
// 서버를 재기동해도 BO에서 바꾼 값이 반영되지 않는다(실측으로 확인됨). "1회만 조회"는 아래
// siteSettingsLoaded 플래그가 이미 보장하므로 fetch 자체의 캐시는 필요 없다.
export let SITE_TIME_ZONE = "America/New_York";
export let SITE_LOCALE = "en-US";

let siteSettingsLoaded = false;

// 서버 프로세스 생애주기 동안 1회만 조회(모듈 전역 캐싱) — 루트 레이아웃에서 최초 렌더 시 await로 호출한다.
// 성공했을 때만 완료 플래그를 세운다 — 조회 자체가 실패(예: bo-api 미기동)하면 플래그를 세우지 않아
// 다음 요청에서 재시도한다(실패를 프로세스 수명 내내 기본값으로 고정하지 않음).
// 실패해도 위 기본값을 그대로 유지하고 조용히 넘어간다(사이트 노출 자체를 막지 않음).
export async function loadSiteSettings(): Promise<void> {
  if (siteSettingsLoaded) return;
  try {
    const { fetchApi } = await import("@/lib/api");
    const settings = await fetchApi<{ timezone: string | null; locale: string | null }>(
      "/api/v1/fo/site-settings",
      { cache: "no-store" },
    );
    if (settings.timezone) SITE_TIME_ZONE = settings.timezone;
    if (settings.locale) SITE_LOCALE = settings.locale;
    siteSettingsLoaded = true;
  } catch {
    // 조회 실패 시 기본값(America/New_York, en-US) 유지, 플래그는 세우지 않아 다음 요청에 재시도
  }
}

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
