import type { Metadata } from "next";
import CookiePreferencesPageClient from "./CookiePreferencesPageClient";

export const metadata: Metadata = {
  title: "Cookie Preferences | LS ELECTRIC",
  description:
    "Choose which optional cookies LS ELECTRIC may use while you browse the website.",
};

/** P-FO-COMMON-040000M — Figma 7334:130670 · Cookie Settings detail */
export default function CookiePreferencesRoutePage() {
  return <CookiePreferencesPageClient />;
}
