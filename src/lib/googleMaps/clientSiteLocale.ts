
let clientSiteLocale = "en-US";

export function setClientSiteLocale(locale: string): void {
  if (locale) clientSiteLocale = locale;
}

export function getClientSiteLocale(): string {
  return clientSiteLocale;
}
