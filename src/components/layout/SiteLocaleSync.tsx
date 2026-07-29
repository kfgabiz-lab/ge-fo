"use client";

import { setClientSiteLocale } from "@/lib/googleMaps/clientSiteLocale";

export default function SiteLocaleSync({ locale }: { locale: string }) {
  setClientSiteLocale(locale);
  return null;
}
