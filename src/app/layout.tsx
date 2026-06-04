import type { Metadata } from "next";

import HistoryReloadOnNavigate from "@/components/layout/HistoryReloadOnNavigate";
import ScrollToTopOnNavigate from "@/components/layout/ScrollToTopOnNavigate";
import "../assets/css/reset.css";
import "../assets/css/fonts.css";
import "../assets/css/globals.css";
import "../assets/css/components/product-award-badge.css";

export const metadata: Metadata = {
  title: "LS ELECTRIC | Smart Energy Global Leader",
  description:
    "LS ELECTRIC is starting a new chapter to bring smart energy to light everywhere around the world. We deliver safe, clean energy and innovative solutions for a sustainable future.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <HistoryReloadOnNavigate />
        <ScrollToTopOnNavigate />
      </body>
    </html>
  );
}
