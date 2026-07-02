import MainVisual from "@/components/main/main-visual";
import MainInfo from "@/components/main/main-info";
import WhatWeDoSwiper from "@/components/main/what-we-do-swiper";
import HighlightNewsSection from "@/components/common/content/highlight-news-section";
import { mainHighlightNewsItems } from "@/data/highlight-news";
import MainCards from "@/components/main/main-cards";
import MainProducts from "@/components/main/main-products";
import CommonBanner01 from "@/components/common/banners/common-banner01";
import CommonBanner03Link from "@/components/common/banners/common-banner03-link";
import IconCards from "@/components/main/icon-cards";
import "@/assets/css/main.css";

export default function MainPage() {
  return (
    <main className="main-page" id="Page_main">
      <MainVisual />
      <MainInfo />
      <WhatWeDoSwiper />
      <HighlightNewsSection
        variant="main"
        title="Catch up on the latest news"
        items={mainHighlightNewsItems}
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
            description: "Connect with our experts to find the right solution for your business.",
            href: "/support/contact-us",
          },
          {
            title: "Where to buy",
            description: "Find authorized retailers and partners to purchase our products.",
            href: "/support/where-to-buy",
          },
        ]}
      />
    </main>
  );
}
