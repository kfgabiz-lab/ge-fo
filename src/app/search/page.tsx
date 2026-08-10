import { Suspense } from "react";
import type { Metadata } from "next";
import SearchAllHero from "./components/SearchAllHero";
import SearchAllTabContent from "./components/SearchAllTabContent";
import "@/assets/css/search.css";
import "@/assets/css/devices-product-detail.css";

export const metadata: Metadata = {
  title: "Search | LS ELECTRIC",
  description:
    "Search LS ELECTRIC America for advanced power and automation solutions, product specs, technical downloads, media resources, and AI-powered insights.",
};

function SearchAllHeroFallback() {
  return (
    <section
      className="search_all_hero search_all_hero--pending"
      id="search-all-hero"
      aria-busy="true"
    >
      <div className="inner search_all_hero__inner">
        <div className="search_all_hero__form" />
        <div className="search_all_hero__popular" />
      </div>
    </section>
  );
}

export default function SearchAllRoutePage() {
  return (
    <main className="search-page" id="Page_search_all">
      <Suspense fallback={<SearchAllHeroFallback />}>
        <SearchAllHero />
      </Suspense>
      <Suspense fallback={null}>
        <SearchAllTabContent />
      </Suspense>
    </main>
  );
}
