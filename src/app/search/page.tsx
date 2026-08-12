import { Suspense } from "react";
import type { Metadata } from "next";
import SearchAllHero from "./components/SearchAllHero";
import SearchAllTabContent from "./components/SearchAllTabContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildSimpleWebPageGraph, itemUrl, type JsonLdNode } from "@/lib/structuredData/builders";
import { fetchSearchAllProducts } from "@/data/search/searchAllProductsData";
import { fetchSearchAllDocuments } from "@/data/search/searchAllDocumentsData";
import { fetchSearchMedia } from "@/data/search/searchMediaData";
import { fetchSearchPages } from "@/data/search/searchPagesData";
import "@/assets/css/search.css";
import "@/assets/css/devices-product-detail.css";

const RESULTS_PER_TYPE = 3;

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

async function buildSearchResultsMainEntity(query: string): Promise<JsonLdNode | null> {
  if (!query.trim()) return null;

  const [products, documents, media, pages] = await Promise.all([
    fetchSearchAllProducts(query, { limit: RESULTS_PER_TYPE }),
    fetchSearchAllDocuments(query, RESULTS_PER_TYPE),
    fetchSearchMedia(query, { size: RESULTS_PER_TYPE }),
    fetchSearchPages(query, { size: RESULTS_PER_TYPE }),
  ]);

  const numberOfItems =
    products.total + documents.total + media.totalElements + pages.totalElements;
  if (numberOfItems === 0) return null;

  const itemListElement: JsonLdNode[] = [];

  products.items.forEach((item, index) => {
    const url = itemUrl(item.href);
    if (!url) return;
    itemListElement.push({
      "@type": "Product",
      "@id": `#result-item-product-${index + 1}`,
      name: item.title,
      description: item.description,
      url,
    });
  });

  documents.items.forEach((item, index) => {
    itemListElement.push({
      "@type": "DigitalDocument",
      "@id": `#result-item-doc-${index + 1}`,
      name: item.title ?? "",
      description: item.date ?? "",
      encoding: item.versions.flatMap((v) =>
        v.files.map((f) => ({
          "@type": "MediaObject",
          "@id": `#doc-file-${item.id}-${f.fileId ?? ""}`,
          name: f.fileName ?? "",
          encodingFormat: f.fileExt ?? "",
        })),
      ),
    });
  });

  media.items.forEach((item, index) => {
    const url = itemUrl(item.href);
    if (!url) return;
    itemListElement.push({
      "@type": "Article",
      "@id": `#result-item-media-${index + 1}`,
      headline: item.title,
      description: item.description ?? "",
      url,
    });
  });

  pages.items.forEach((item, index) => {
    const url = itemUrl(item.href);
    if (!url) return;
    itemListElement.push({
      "@type": "WebPage",
      "@id": `#result-item-page-${index + 1}`,
      name: item.title,
      url,
    });
  });

  return {
    "@type": "ItemList",
    "@id": "#search-results-list",
    numberOfItems,
    itemListElement,
  };
}

export default async function SearchAllRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const mainEntity = await buildSearchResultsMainEntity(query);

  const graph = buildSimpleWebPageGraph(
    "/search",
    {
      metaTitle: query.trim() ? `Search result for ${query}` : SEARCH_TITLE,
      metaDescription: SEARCH_DESCRIPTION,
    },
    {
      type: "SearchResultsPage",
      ...(mainEntity ? { extra: { mainEntity } } : {}),
    },
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
