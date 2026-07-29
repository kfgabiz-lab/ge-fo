

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


export interface CalendarEvent {
  title: string;
  startIso: string;
  timeFrom?: string;
  timeTo?: string;
  location?: string;
  description?: string;
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

function nowStampUtc(): string {
  const dt = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${dt.getUTCFullYear()}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}` +
    `T${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}${p(dt.getUTCSeconds())}Z`
  );
}

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
