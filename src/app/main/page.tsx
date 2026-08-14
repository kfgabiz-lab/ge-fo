import MainImagePopup from "./components/MainImagePopup";
import MainVisual from "./components/MainVisual";
import MainInfo from "./components/MainInfo";
import WhatWeDoSwiper from "./components/WhatWeDoSwiper";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { fetchMainHighlightNews } from "@/data/highlightNews";
import MainCards from "./components/MainCards";
import MainProducts from "./components/MainProducts";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import CommonBanner03Link from "@/components/banners/CommonBanner03Link";
import IconCards from "./components/IconCards";
import "@/assets/css/main.css";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { SITE_NAME, WEBSITE_ID } from "@/lib/structuredData/siteConfig";

const MAIN_DESCRIPTION =
  "LS ELECTRIC delivers innovative electrification, power distribution, and industrial automation solutions that help businesses build safer, smarter, and more sustainable operations.";

export const metadata: Metadata = {
  title: "LS ELECTRIC America",
  description: MAIN_DESCRIPTION,
};

export default async function MainPage() {
  const highlightNewsItems = await fetchMainHighlightNews();
  const currentUrl = pageUrl("/main");
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: SITE_NAME,
      description: MAIN_DESCRIPTION,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
    },
    breadcrumbList(currentUrl, []),
  ]);
  return (
    <main className="main-page" id="Page_main">
      <JsonLd data={jsonLdGraph} />
      <MainImagePopup />
      <MainVisual />

      <MainInfo />
      <WhatWeDoSwiper />
      <HighlightNewsSection
        variant="main"
        title="Catch up on the Latest News"
        items={highlightNewsItems}
        sectionId="main-news"
      />
      <MainCards />
      <MainProducts />
      <CommonBanner01 />
      <IconCards />
      <CommonBanner03Link
        items={[
          {
            title: "Contact Us",
            description:
              "Connect with our experts to find the right solution for your business.",
            href: "/support/contact-us",
          },
          {
            title: "Where to Buy",
            description:
              "Find authorized retailers and partners to purchase our products.",
            href: "/support/where-to-buy",
          },
        ]}
      />
    </main>
  );
}
