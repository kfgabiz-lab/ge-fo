export let SITE_TIME_ZONE = "America/New_York";
export let SITE_LOCALE = "en-US";

let siteSettingsLoaded = false;

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
  }
}

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

export function siteTodayStr(): string {
  const { year, month, day } = siteTodayParts();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function siteToday(): Date {
  const { year, month, day } = siteTodayParts();
  return new Date(year, month - 1, day);
}
