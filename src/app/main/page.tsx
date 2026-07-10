import MainVisual from "./components/MainVisual";
import MainInfo from "./components/MainInfo";
import WhatWeDoSwiper from "./components/WhatWeDoSwiper";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { mainHighlightNewsItems } from "@/data/highlightNews";
import MainCards from "./components/MainCards";
import MainProducts from "./components/MainProducts";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import CommonBanner03Link from "@/components/banners/CommonBanner03Link";
import IconCards from "./components/IconCards";
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
