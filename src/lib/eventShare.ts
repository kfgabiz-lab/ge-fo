// 이벤트/세션 공유 링크 및 캘린더(Google/iCal) 생성 공통 유틸 (순수 함수)
// - SNS 공유 href 생성(X/LinkedIn/Email/Facebook)
// - Google 캘린더 add 링크 생성, iCal(.ics) 텍스트 생성 + 브라우저 다운로드
// - 브라우저 전용 downloadIcs 외 나머지는 순수 함수라 SSR/CSR 무관하게 호출 가능
//   (window/document 접근은 downloadIcs 안으로 한정)

// ---------------- 공유 링크 ----------------

// 공유 대상 id → 실제 공유 href. url/title 을 payload 로 주입.
// (알 수 없는 id는 원본 url 을 그대로 반환해 안전 폴백)
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

// ---------------- 캘린더 이벤트 ----------------

export interface CalendarEvent {
  title: string;
  startIso: string; // "YYYY-MM-DD" (raw). 없으면 링크 생성 불가
  timeFrom?: string; // "HH:MM" — 없으면 종일 이벤트
  timeTo?: string; // "HH:MM" — 없으면 timeFrom 과 동일 취급
  location?: string;
  description?: string;
}

// "2026-08-15" + "09:10" → "20260815T091000" / 시간 없으면 "20260815"
function toCompact(dateIso: string, time?: string): string {
  const d = dateIso.slice(0, 10).replace(/-/g, "");
  if (!time) return d;
  const [h, m] = time.split(":");
  const hh = (h ?? "00").padStart(2, "0");
  const mm = (m ?? "00").padStart(2, "0");
  return `${d}T${hh}${mm}00`;
}

// 종일 이벤트의 종료일(DTEND)은 다음날 00:00 이 규격 → 컴팩트 YYYYMMDD 를 하루 더함
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

// ics 텍스트 필드 이스케이프(백슬래시/세미콜론/콤마/개행)
function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// startIso 유효성(있어야 링크 생성 가능)
export function hasValidEventDate(ev: CalendarEvent): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(ev.startIso ?? "");
}

// Google 캘린더 add 링크
export function buildGoogleCalendarUrl(ev: CalendarEvent): string {
  const allDay = !ev.timeFrom;
  let dates: string;
  if (allDay) {
    const start = ev.startIso.slice(0, 10).replace(/-/g, "");
    dates = `${start}/${addOneDayCompact(start)}`;
  } else {
    const start = toCompact(ev.startIso, ev.timeFrom);
    const end = toCompact(ev.startIso, ev.timeTo ?? ev.timeFrom);
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

// 현재 시각 UTC 컴팩트(DTSTAMP 용)
function nowStampUtc(): string {
  const dt = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${dt.getUTCFullYear()}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}` +
    `T${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}${p(dt.getUTCSeconds())}Z`
  );
}

// iCal(.ics) 본문 생성
export function buildIcsContent(ev: CalendarEvent): string {
  const allDay = !ev.timeFrom;
  const startCompact = ev.startIso.slice(0, 10).replace(/-/g, "");
  const dtStart = allDay
    ? `DTSTART;VALUE=DATE:${startCompact}`
    : `DTSTART:${toCompact(ev.startIso, ev.timeFrom)}`;
  const dtEnd = allDay
    ? `DTEND;VALUE=DATE:${addOneDayCompact(startCompact)}`
    : `DTEND:${toCompact(ev.startIso, ev.timeTo ?? ev.timeFrom)}`;
  const uid = `${startCompact}-${Math.random().toString(36).slice(2)}@lselectric`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LS ELECTRIC//Training//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStampUtc()}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeIcs(ev.title)}`,
    ev.location ? `LOCATION:${escapeIcs(ev.location)}` : "",
    ev.description ? `DESCRIPTION:${escapeIcs(ev.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

// .ics 파일 다운로드(브라우저 전용). 파일명은 title 기반.
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
