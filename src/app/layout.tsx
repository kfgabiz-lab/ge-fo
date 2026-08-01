import type { Metadata, Viewport } from "next";
import Script from "next/script";

import HistoryReloadOnNavigate from "@/components/layout/HistoryReloadOnNavigate";
import LenisScrollProvider from "@/components/layout/LenisScrollProvider";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import ScrollToTopOnNavigate from "@/components/layout/ScrollToTopOnNavigate";
import SiteLocaleSync from "@/components/layout/SiteLocaleSync";
import { loadSiteSettings, SITE_LOCALE } from "@/lib/siteTime";
import "../assets/css/reset.css";
import "../assets/css/fonts.css";
import "../assets/css/globals.css";
import "../assets/css/components/product-award-badge.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "LS ELECTRIC | Smart Energy Global Leader",
  description:
    "LS ELECTRIC is starting a new chapter to bring smart energy to light everywhere around the world. We deliver safe, clean energy and innovative solutions for a sustainable future.",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: "LS ELECTRIC | Smart Energy Global Leader",
    description:
      "LS ELECTRIC is starting a new chapter to bring smart energy to light everywhere around the world. We deliver safe, clean energy and innovative solutions for a sustainable future.",
    url: "https://www.ls-electric.com/",
    siteName: "LS ELECTRIC",
    images: [
      {
        url: "https://www.ls-electric.com/assets/img/common/logo3.png",
        width: 400,
        height: 80,
        alt: "LS ELECTRIC Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LS ELECTRIC | Smart Energy Global Leader",
    description:
      "LS ELECTRIC is starting a new chapter to bring smart energy to light everywhere around the world. We deliver safe, clean energy and innovative solutions for a sustainable future.",
    images: ["https://www.ls-electric.com/assets/img/common/logo3.png"],
    site: "@lselectricglobal",
  },
  other: {
    // 대림 EUEM(최종사용자경험 모니터링) same-origin 클라이언트 IP/세션 조회 엔드포인트
    "euem-endpoint": "/apps/daelimEUEM_responser",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await loadSiteSettings();

  return (
    <html lang="en">
      <body>
        <Script src="/apps/daelimEUEM_begin.js" strategy="beforeInteractive" />
        <Script src="/js/daelimEUEM_run.js" strategy="beforeInteractive" />
        <LenisScrollProvider>
          {children}
          <SiteLocaleSync locale={SITE_LOCALE} />
          <HistoryReloadOnNavigate />
          <ScrollToTopOnNavigate />
          <ScrollToTopButton />
        </LenisScrollProvider>
      </body>
    </html>
  );
}
