
const SEPARATOR = "-";

export function formatPhoneDisplay(phone: string | null | undefined): string {
  const raw = (phone ?? "").trim();
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");
  const local =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (local.length !== 10) return raw;

  return [local.slice(0, 3), local.slice(3, 6), local.slice(6)].join(SEPARATOR);
}
