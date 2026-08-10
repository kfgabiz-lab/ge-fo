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

export const metadata: Metadata = {
  description:
    "LS ELECTRIC delivers innovative electrification, power distribution, and industrial automation solutions that help businesses build safer, smarter, and more sustainable operations.",
};

export default async function MainPage() {
  const highlightNewsItems = await fetchMainHighlightNews();
  return (
    <main className="main-page" id="Page_main">
      <MainImagePopup />
      <MainVisual />

      <MainInfo />
      <WhatWeDoSwiper />
      <HighlightNewsSection
        variant="main"
        title="Catch up on the latest news"
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
            title: "Where to buy",
            description:
              "Find authorized retailers and partners to purchase our products.",
            href: "/support/where-to-buy",
          },
        ]}
      />
    </main>
  );
}
