import type { Metadata } from "next";
import CookieSettingPageClient from "../components/CookieSettingPageClient";

export const metadata: Metadata = {
  title: "Cookie Settings | LS ELECTRIC",
  description:
    "We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits.",
};

export default function CookieSettingRoutePage() {
  return <CookieSettingPageClient />;
}
