import { Suspense } from "react";
import type { Metadata } from "next";
import SearchAllHero from "./components/SearchAllHero";
import SearchAllTabContent from "./components/SearchAllTabContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph } from "@/lib/structuredData/builders";
import "@/assets/css/search.css";
import "@/assets/css/devices-product-detail.css";

const SEARCH_TITLE = "Search | LS ELECTRIC";
const SEARCH_DESCRIPTION =
  "Search LS ELECTRIC America for advanced power and automation solutions, product specs, technical downloads, media resources, and AI-powered insights.";

export const metadata: Metadata = {
  title: SEARCH_TITLE,
  description: SEARCH_DESCRIPTION,
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
  const graph = buildSimpleWebPageGraph(
    "/search",
    { metaTitle: SEARCH_TITLE, metaDescription: SEARCH_DESCRIPTION },
    { type: "SearchResultsPage" },
  );
  return (
    <main className="search-page" id="Page_search_all">
      <JsonLd data={graph} />
      <Suspense fallback={<SearchAllHeroFallback />}>
        <SearchAllHero />
      </Suspense>
      <Suspense fallback={null}>
        <SearchAllTabContent />
      </Suspense>
    </main>
  );
}
