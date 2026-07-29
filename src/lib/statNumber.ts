
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

  const decimalPlaces = normalized.includes(".")
    ? normalized.split(".")[1]?.length ?? 0
    : 0;

  return { target, useComma, decimalPlaces };
}

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
