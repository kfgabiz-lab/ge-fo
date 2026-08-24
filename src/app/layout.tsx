import type { Metadata, Viewport } from "next";
import Script from "next/script";

import HistoryReloadOnNavigate from "@/components/layout/HistoryReloadOnNavigate";
import LenisScrollProvider from "@/components/layout/LenisScrollProvider";
import ScrollPositionManager from "@/components/layout/ScrollPositionManager";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import SiteLocaleSync from "@/components/layout/SiteLocaleSync";
import SkipToMainContent from "@/components/layout/SkipToMainContent";
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
  title: {
    template: "%s | LS ELECTRIC America",
    default: "LS ELECTRIC America",
  },
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
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NZSF98NV');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NZSF98NV"
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script src="/apps/daelimEUEM_begin.js" strategy="beforeInteractive" />
        <Script src="/js/daelimEUEM_run.js" strategy="beforeInteractive" />
        <LenisScrollProvider>
          <SkipToMainContent />
          {children}
          <SiteLocaleSync locale={SITE_LOCALE} />
          <HistoryReloadOnNavigate />
          <ScrollPositionManager />
          <ScrollToTopButton />
        </LenisScrollProvider>
      </body>
    </html>
  );
}
