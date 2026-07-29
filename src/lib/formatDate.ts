
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

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const datePart = dateStr.trim().slice(0, 10);
  const parts = datePart.split("-");
  if (parts.length !== 3) return "";
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return "";
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  return `${MONTH_ABBR[month]} ${String(day).padStart(2, "0")}, ${year}`;
}

export function formatMonthLabel(monthKey: string): string {
  if (!monthKey || typeof monthKey !== "string") return "";
  const parts = monthKey.trim().slice(0, 7).split("-");
  if (parts.length !== 2) return "";
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return "";
  if (month < 1 || month > 12) return "";
  return `${MONTH_ABBR[month]}, ${year}`;
}

export function formatDisplayDateRange(from: string, to: string): string {
  const fromStr = formatDisplayDate(from);
  const toStr = formatDisplayDate(to);
  if (fromStr && toStr) return `${fromStr} - ${toStr}`;
  return fromStr || toStr;
}
