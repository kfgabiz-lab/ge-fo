
export const PHONE_MAX_DIGITS = 10;

export function filterLetters(value: string, maxLength: number): string {
  return value.replace(/[^A-Za-z ]/g, "").slice(0, maxLength);
}

export function filterPhoneDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, PHONE_MAX_DIGITS);
}

export function filterEmail(value: string, maxLength: number): string {
  return value.replace(/[^A-Za-z0-9._@-]/g, "").slice(0, maxLength);
}

export function filterDigitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}
