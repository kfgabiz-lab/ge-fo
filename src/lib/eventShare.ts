

export function buildShareHref(id: string, url: string, title: string): string {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (id) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case "email":
      return `mailto:?subject=${t}&body=${u}`;
    default:
      return url;
  }
}


export interface CalendarEventDay {
  /** 교육일 (YYYY-MM-DD) */
  date: string;
  timeFrom?: string;
  timeTo?: string;
}

export interface CalendarEvent {
  title: string;
  startIso: string;
  /** 다중 일 교육의 마지막 교육일(YYYY-MM-DD). 없으면 startIso와 동일한 하루 일정으로 처리 */
  endIso?: string;
  timeFrom?: string;
  timeTo?: string;
  /**
   * 교육일별 개별 이벤트 목록. 지정하면 캘린더 공유 시 각 날짜를
   * 그 날의 시작/종료 시각을 가진 별도 이벤트로 생성한다.
   */
  days?: CalendarEventDay[];
  location?: string;
  description?: string;
  url?: string;
  organizerName?: string;
  organizerEmail?: string;
  categories?: string;
  attachUrl?: string;
}

/** 캘린더 이벤트 하나에 대응하는 날짜/시간 구간 */
interface EventSpan {
  startIso: string;
  endIso: string;
  timeFrom?: string;
  timeTo?: string;
}

function toCompact(dateIso: string, time?: string): string {
  const d = dateIso.slice(0, 10).replace(/-/g, "");
  if (!time) return d;
  const [h, m] = time.split(":");
  const hh = (h ?? "00").padStart(2, "0");
  const mm = (m ?? "00").padStart(2, "0");
  return `${d}T${hh}${mm}00`;
}

function addOneDayCompact(compact: string): string {
  const y = Number(compact.slice(0, 4));
  const m = Number(compact.slice(4, 6));
  const d = Number(compact.slice(6, 8));
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function hasValidEventDate(ev: CalendarEvent): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(ev.startIso ?? "");
}

/** endIso가 없거나 startIso보다 앞서면 startIso를 종료일로 사용 (ISO 날짜는 문자열 비교로 대소 판별 가능) */
function resolveEndIso(ev: CalendarEvent): string {
  const end = (ev.endIso ?? "").slice(0, 10);
  const start = ev.startIso.slice(0, 10);
  return end && end >= start ? end : start;
}

/**
 * 이벤트를 생성할 날짜/시간 구간 목록.
 * days가 있으면 교육일별 개별 구간, 없으면 startIso~endIso 단일 구간.
 */
function resolveEventSpans(ev: CalendarEvent): EventSpan[] {
  if (ev.days && ev.days.length > 0) {
    return ev.days.map((d) => ({
      startIso: d.date.slice(0, 10),
      endIso: d.date.slice(0, 10),
      timeFrom: d.timeFrom,
      timeTo: d.timeTo,
    }));
  }
  return [
    {
      startIso: ev.startIso.slice(0, 10),
      endIso: resolveEndIso(ev),
      timeFrom: ev.timeFrom,
      timeTo: ev.timeTo,
    },
  ];
}

function buildGoogleCalendarUrlForSpan(ev: CalendarEvent, span: EventSpan): string {
  const allDay = !span.timeFrom;
  let dates: string;
  if (allDay) {
    const start = span.startIso.replace(/-/g, "");
    const end = span.endIso.replace(/-/g, "");
    dates = `${start}/${addOneDayCompact(end)}`;
  } else {
    const start = toCompact(span.startIso, span.timeFrom);
    const end = toCompact(span.endIso, span.timeTo ?? span.timeFrom);
    dates = `${start}/${end}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates,
  });
  if (ev.location) params.set("location", ev.location);
  if (ev.description) params.set("details", ev.description);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * 교육일별 Google 캘린더 등록 URL 목록.
 * Google은 URL 하나당 이벤트 하나만 만들 수 있어 days가 여러 개면
 * URL도 여러 개가 되며, 호출부에서 각각 새 창으로 열어야 한다.
 */
export function buildGoogleCalendarUrls(ev: CalendarEvent): string[] {
  return resolveEventSpans(ev).map((span) => buildGoogleCalendarUrlForSpan(ev, span));
}

/** 단일 이벤트용 Google 캘린더 URL (days가 있으면 첫 교육일 기준) */
export function buildGoogleCalendarUrl(ev: CalendarEvent): string {
  return buildGoogleCalendarUrls(ev)[0];
}

function nowStampUtc(): string {
  const dt = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${dt.getUTCFullYear()}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}` +
    `T${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}${p(dt.getUTCSeconds())}Z`
  );
}

function buildVeventLines(ev: CalendarEvent, span: EventSpan): string[] {
  const allDay = !span.timeFrom;
  const startCompact = span.startIso.replace(/-/g, "");
  const endCompact = span.endIso.replace(/-/g, "");
  const dtStart = allDay
    ? `DTSTART;VALUE=DATE:${startCompact}`
    : `DTSTART:${toCompact(span.startIso, span.timeFrom)}`;
  const dtEnd = allDay
    ? `DTEND;VALUE=DATE:${addOneDayCompact(endCompact)}`
    : `DTEND:${toCompact(span.endIso, span.timeTo ?? span.timeFrom)}`;
  const uid = `${startCompact}-${Math.random().toString(36).slice(2)}@lselectric`;

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStampUtc()}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeIcs(ev.title)}`,
    ev.location ? `LOCATION:${escapeIcs(ev.location)}` : "",
    ev.description ? `DESCRIPTION:${escapeIcs(ev.description)}` : "",
    ev.url ? `URL:${ev.url}` : "",
    ev.organizerEmail
      ? `ORGANIZER${ev.organizerName ? `;CN=${escapeIcs(ev.organizerName)}` : ""}:MAILTO:${ev.organizerEmail}`
      : "",
    ev.categories ? `CATEGORIES:${escapeIcs(ev.categories)}` : "",
    ev.attachUrl ? `ATTACH:${ev.attachUrl}` : "",
    "END:VEVENT",
  ].filter(Boolean);
}

export function buildIcsContent(ev: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LS ELECTRIC//Training//EN",
    "CALSCALE:GREGORIAN",
    ...resolveEventSpans(ev).flatMap((span) => buildVeventLines(ev, span)),
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export function downloadIcs(ev: CalendarEvent, filename?: string): void {
  if (typeof document === "undefined") return;
  const content = buildIcsContent(ev);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${ev.title || "event"}.ics`.replace(/[\\/:*?"<>|]/g, "_");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
