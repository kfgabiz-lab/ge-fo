"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getLenisInstance, getWindowScrollY, scrollWindowTo } from "@/lib/lenisScroll";
import {
  fetchSearchAllProducts,
  type SearchAllProductsResult,
} from "@/data/search/searchAllProductsData";
import {
  fetchDownloadCenterContentsByKeyword,
  type DownloadCenterItem,
  type DownloadCenterKeywordResult,
} from "@/data/support/downloadCenterData";
import {
  EMPTY_SEARCH_MEDIA_RESULT,
  fetchSearchMedia,
  type SearchMediaResult,
} from "@/data/search/searchMediaData";
import {
  EMPTY_SEARCH_PAGES_RESULT,
  fetchSearchPages,
  type SearchPagesResult,
} from "@/data/search/searchPagesData";
import SearchAllAi from "./SearchAllAi";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchEmptyResult from "./SearchEmptyResult";
import SearchProductCard from "./SearchProductCard";
import SearchDocumentsPanel from "./SearchDocumentsPanel";
import { SearchDocumentsFilterProvider } from "./SearchDocumentsFilterProvider";
import SearchMediaList from "./SearchMediaList";
import SearchMediaPanel from "./SearchMediaPanel";
import SearchPageList from "./SearchPageList";
import SearchPagesPanel from "./SearchPagesPanel";
import SearchProductsPanel from "./SearchProductsPanel";
import { SearchQueryProvider } from "./SearchQueryContext";
import { handleHorizontalTabListKeyDown } from "@/lib/tabKeyboardNav";

import {
  searchAllTabs,
  toSearchTabId,
  type SearchTabId,
} from "@/data/search/searchAllContent";

import {
  fetchChatbotStream,
} from "@/data/search/searchChatbotData";
import { logSearchKeyword } from "@/data/search/searchKeywordData";


function formatSearchCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}

const SEARCH_TABS_SCROLL_OFFSET_PX = 120;

function scrollToSearchTabs(tabsEl: HTMLElement | null) {
  if (!tabsEl) return;
  const targetTop = Math.max(
    0,
    tabsEl.getBoundingClientRect().top + getWindowScrollY() - SEARCH_TABS_SCROLL_OFFSET_PX,
  );
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(targetTop, { programmatic: true, force: true });
    return;
  }
  scrollWindowTo(targetTop, { behavior: "smooth" });
}

function SearchSectionHead({
  title,
  count,
  onExplore,
}: {
  title: string;
  count: number | string;
  onExplore: () => void;
}) {
  return (
    <div className="search_all__section-head">
      <div className="search_all__section-title-wrap">
        <h2 className="search_all__section-tit">{title}</h2>
        <span className="search_all__section-count">{count}</span>
      </div>
      <button
        type="button"
        onClick={onExplore}
        className="btn-text-30 search_all__explore"
      >
        Explore
        <span className="btn-text-30__icon" aria-hidden="true">
          <span className="icon_arrow-14" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}

type SearchAllTabContentProps = {
  initialTab?: SearchTabId;
};

export default function SearchAllTabContent({
  initialTab = "all",
}: SearchAllTabContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<SearchTabId>(
    () => toSearchTabId(tabParam) ?? initialTab,
  );
  const [aiAnswer, setAiAnswer] = useState("");
  const [chatbotKeyword, setChatbotKeyword] = useState("");
  const [chatbotSettled, setChatbotSettled] = useState(false);
  const [chatbotQuery, setChatbotQuery] = useState(query);

  if (chatbotQuery !== query) {
    setChatbotQuery(query);
    setAiAnswer("");
    setChatbotKeyword("");
    setChatbotSettled(false);
  }

  const effectiveQuery = (chatbotKeyword || query).trim();
  const searchReady = Boolean(chatbotKeyword) || chatbotSettled;
  const searchCacheKey = chatbotKeyword || `__query__:${query}`;

  const isAllTab = activeTab === "all";
  const [documentsFilterMounted, setDocumentsFilterMounted] = useState(
    () => activeTab === "documents",
  );

  useEffect(() => {
    if (activeTab === "documents") setDocumentsFilterMounted(true);
  }, [activeTab]);



  useEffect(() => {
    const next = toSearchTabId(tabParam);
    if (next) setActiveTab(next);
  }, [tabParam]);

  const router = useRouter();
  const pathname = usePathname();
  const tabsRef = useRef<HTMLDivElement>(null);
  const handleTabClick = useCallback(
    (tabId: SearchTabId) => {
      setActiveTab(tabId);
      const params = new URLSearchParams(searchParams.toString());
      if (tabId === "all") params.delete("tab");
      else params.set("tab", tabId);
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
      scrollToSearchTabs(tabsRef.current);
    },
    [pathname, router, searchParams],
  );
  const [productResult, setProductResult] = useState<SearchAllProductsResult>({
    total: 0,
    items: [],
  });
  const [documentResult, setDocumentResult] =
    useState<DownloadCenterKeywordResult>({
      total: 0,
      items: [],
    });
  const [keywordDocuments, setKeywordDocuments] = useState<DownloadCenterItem[]>([]);
  const [mediaResult, setMediaResult] = useState<SearchMediaResult>(
    EMPTY_SEARCH_MEDIA_RESULT,
  );
  const [pagesResult, setPagesResult] = useState<SearchPagesResult>(
    EMPTY_SEARCH_PAGES_RESULT,
  );
  const [loaded, setLoaded] = useState({
    products: false,
    documents: false,
    media: false,
    pages: false,
  });

  const previewQueryRef = useRef<{
    products: string | null;
    documents: string | null;
    media: string | null;
    pages: string | null;
  }>({ products: null, documents: null, media: null, pages: null });

  useEffect(() => {
    previewQueryRef.current = {
      products: null,
      documents: null,
      media: null,
      pages: null,
    };
    setLoaded({
      products: false,
      documents: false,
      media: false,
      pages: false,
    });
  }, [query]);

  const [panelFiltered, setPanelFiltered] = useState({
    products: false,
    media: false,
    pages: false,
  });

  const skipProductsPreview = activeTab === "products" && !panelFiltered.products;
  const skipMediaPreview = activeTab === "media" && !panelFiltered.media;
  const skipPagesPreview = activeTab === "pages" && !panelFiltered.pages;

  const handleProductsFiltered = useCallback((filtered: boolean) => {
    setPanelFiltered((prev) =>
      prev.products === filtered ? prev : { ...prev, products: filtered },
    );
  }, []);

  const handleMediaFiltered = useCallback((filtered: boolean) => {
    setPanelFiltered((prev) =>
      prev.media === filtered ? prev : { ...prev, media: filtered },
    );
  }, []);

  const handlePagesFiltered = useCallback((filtered: boolean) => {
    setPanelFiltered((prev) =>
      prev.pages === filtered ? prev : { ...prev, pages: filtered },
    );
  }, []);

  const handleProductsTotal = useCallback((total: number, filtered: boolean) => {
    if (filtered) return;
    setProductResult((prev) => (prev.total === total ? prev : { ...prev, total }));
    setLoaded((prev) => (prev.products ? prev : { ...prev, products: true }));
  }, []);

  const handleMediaTotal = useCallback((total: number, filtered: boolean) => {
    if (filtered) return;
    setMediaResult((prev) =>
      prev.totalElements === total ? prev : { ...prev, totalElements: total },
    );
    setLoaded((prev) => (prev.media ? prev : { ...prev, media: true }));
  }, []);

  const handlePagesTotal = useCallback((total: number, filtered: boolean) => {
    if (filtered) return;
    setPagesResult((prev) =>
      prev.totalElements === total ? prev : { ...prev, totalElements: total },
    );
    setLoaded((prev) => (prev.pages ? prev : { ...prev, pages: true }));
  }, []);

  useEffect(() => {
    if (skipProductsPreview) return;
    if (!searchReady) return;
    if (previewQueryRef.current.products === searchCacheKey) return;
    let alive = true;
    void fetchSearchAllProducts(effectiveQuery, { limit: 4 }).then((result) => {
      if (!alive) return;
      previewQueryRef.current.products = searchCacheKey;
      setProductResult(result);
      setLoaded((prev) => ({ ...prev, products: true }));
    });
    return () => {
      alive = false;
    };
  }, [effectiveQuery, searchCacheKey, searchReady, skipProductsPreview]);

  useEffect(() => {
    if (!searchReady) return;
    if (previewQueryRef.current.documents === searchCacheKey) return;

    let alive = true;

    void fetchDownloadCenterContentsByKeyword(chatbotKeyword, query).then(
      (result) => {
        if (!alive) return;
        previewQueryRef.current.documents = searchCacheKey;
        setKeywordDocuments(result.items);
        setDocumentResult({
          total: result.total,
          items: result.items.slice(0, 4),
        });
        setLoaded((prev) => ({ ...prev, documents: true }));
      },
    );
    return () => {
      alive = false;
    };
  }, [chatbotKeyword, query, searchCacheKey, searchReady]);

  useEffect(() => {
    if (skipMediaPreview) return;
    if (!searchReady) return;
    if (previewQueryRef.current.media === searchCacheKey) return;
    let alive = true;
    void fetchSearchMedia(effectiveQuery, {
      size: 4,
      highlightTerm: query,
    }).then((result) => {
      if (!alive) return;
      previewQueryRef.current.media = searchCacheKey;
      setMediaResult(result);
      setLoaded((prev) => ({ ...prev, media: true }));
    });
    return () => {
      alive = false;
    };
  }, [effectiveQuery, query, searchCacheKey, searchReady, skipMediaPreview]);

  useEffect(() => {
    if (skipPagesPreview) return;
    if (!searchReady) return;
    if (previewQueryRef.current.pages === searchCacheKey) return;
    let alive = true;
    void fetchSearchPages(effectiveQuery, {
      size: 4,
      highlightTerm: query,
    }).then((result) => {
      if (!alive) return;
      previewQueryRef.current.pages = searchCacheKey;
      setPagesResult(result);
      setLoaded((prev) => ({ ...prev, pages: true }));
    });
    return () => {
      alive = false;
    };
  }, [effectiveQuery, query, searchCacheKey, searchReady, skipPagesPreview]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setAiAnswer("");
      setChatbotKeyword("");
      setChatbotSettled(true);
      return;
    }

    const controller = new AbortController();

    setAiAnswer("");
    setChatbotKeyword("");
    setChatbotSettled(false);

    void fetchChatbotStream(
        trimmedQuery,
        {
          onKeyword: (keywordEvent) => {
            const keyword =
                keywordEvent.keyword?.trim();

            if (!keyword) {
              return;
            }

            setChatbotKeyword(keyword);
            void logSearchKeyword("UNIFIED_SEARCH", keyword);
          },

          onChunk: (chunkEvent) => {
            if (!chunkEvent.chunk) {
              return;
            }

            setAiAnswer(
                previous =>
                    previous + chunkEvent.chunk,
            );
          },

          onCompleted: () => {
            setChatbotSettled(true);
          },
        },
        controller.signal,
    ).catch((error: unknown) => {
      if (
          error instanceof DOMException &&
          error.name === "AbortError"
      ) {
        return;
      }
      setChatbotSettled(true);
    });

    return () => {
      controller.abort();
    };
  }, [query]);

  const isAllLoaded =
    loaded.products && loaded.documents && loaded.media && loaded.pages;

  const allTotal =
    productResult.total +
    documentResult.total +
    mediaResult.totalElements +
    pagesResult.totalElements;

  const isAllTabEmpty =
    isAllLoaded &&
    productResult.items.length === 0 &&
    documentResult.items.length === 0 &&
    mediaResult.items.length === 0 &&
    pagesResult.items.length === 0;

  return (
    <SearchQueryProvider
      query={query}
      effectiveQuery={effectiveQuery}
      ready={searchReady}
    >
      <section className="search_all" id="search-all">
        <div className="inner">
          <div
            ref={tabsRef}
            className="search_all__tabs"
            role="tablist"
            aria-label="Search results"
            onKeyDown={handleHorizontalTabListKeyDown}
          >
            {searchAllTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const countLabel =
                tab.id === "all"
                  ? isAllLoaded
                    ? formatSearchCount(allTotal)
                    : "0"
                  : tab.id === "products"
                    ? formatSearchCount(productResult.total)
                    : tab.id === "documents"
                      ? formatSearchCount(documentResult.total)
                      : tab.id === "media"
                        ? formatSearchCount(mediaResult.totalElements)
                        : tab.id === "pages"
                          ? formatSearchCount(pagesResult.totalElements)
                          : "";
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`search-tab-${tab.id}`}
                  aria-controls={`search-panel-${tab.id}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={isActive ? "search_all__tab is-active" : "search_all__tab"}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label} ({countLabel})
                </button>
              );
            })}
          </div>

          {activeTab === "products" ? (
            <div
              role="tabpanel"
              id="search-panel-products"
              aria-labelledby="search-tab-products"
            >
              <SearchProductsPanel
                onTotalChange={handleProductsTotal}
                onFilteredChange={handleProductsFiltered}
              />
            </div>
          ) : null}
          {documentsFilterMounted ? (
            <SearchDocumentsFilterProvider items={keywordDocuments}>
              {activeTab === "documents" ? (
                <div
                  role="tabpanel"
                  id="search-panel-documents"
                  aria-labelledby="search-tab-documents"
                >
                  <SearchDocumentsPanel
                    items={keywordDocuments}
                    loaded={loaded.documents}
                  />
                </div>
              ) : null}
            </SearchDocumentsFilterProvider>
          ) : null}
          {activeTab === "media" ? (
            <div
              role="tabpanel"
              id="search-panel-media"
              aria-labelledby="search-tab-media"
            >
              <SearchMediaPanel
                onTotalChange={handleMediaTotal}
                onFilteredChange={handleMediaFiltered}
              />
            </div>
          ) : null}
          {activeTab === "pages" ? (
            <div
              role="tabpanel"
              id="search-panel-pages"
              aria-labelledby="search-tab-pages"
            >
              <SearchPagesPanel
                onTotalChange={handlePagesTotal}
                onFilteredChange={handlePagesFiltered}
              />
            </div>
          ) : null}

          {isAllTab ? (
            <div
              role="tabpanel"
              id="search-panel-all"
              aria-labelledby="search-tab-all"
            >
              {!isAllTabEmpty ? (
                <SearchAllAi
                  loading={!chatbotKeyword && !chatbotSettled}
                  settled={chatbotSettled}
                >
                  {aiAnswer ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiAnswer}</ReactMarkdown>
                  ) : (
                    "AI response waiting..."
                  )}
                </SearchAllAi>
              ) : null}

              {productResult.items.length > 0 ? (
                <div className="search_all__section">
                  <SearchSectionHead
                    title="Product"
                    count={formatSearchCount(productResult.total)}
                    onExplore={() => handleTabClick("products")}
                  />
                  <div className="search_all__products">
                    {productResult.items.map((item) => (
                      <SearchProductCard
                        key={item.id}
                        item={item}
                        searchTerm={query}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {documentResult.items.length > 0 ? (
                <div className="search_all__section search_all__section--documents devices_product_downloads">
                  <SearchSectionHead
                    title="Documents"
                    count={formatSearchCount(documentResult.total)}
                    onExplore={() => handleTabClick("documents")}
                  />
                  <div className="search_all__documents-grid">
                    {documentResult.items.map((item) => (
                      <SearchDocumentsCard key={item.id} item={item} searchTerm={query} />
                    ))}
                  </div>
                </div>
              ) : null}

              {mediaResult.items.length > 0 ? (
                <div className="search_all__section">
                  <SearchSectionHead
                    title="Media"
                    count={formatSearchCount(mediaResult.totalElements)}
                    onExplore={() => handleTabClick("media")}
                  />
                  <SearchMediaList items={mediaResult.items} variant="card" />
                </div>
              ) : null}

              {pagesResult.items.length > 0 ? (
                <div className="search_all__section">
                  <SearchSectionHead
                    title="Pages"
                    count={formatSearchCount(pagesResult.totalElements)}
                    onExplore={() => handleTabClick("pages")}
                  />
                  <SearchPageList
                    items={pagesResult.items}
                    listClassName="search_all__pages"
                    itemClassName="search_all__page-item"
                    variant="pages"
                  />
                </div>
              ) : null}

              {isAllTabEmpty ? <SearchEmptyResult /> : null}
            </div>
          ) : null}
        </div>
      </section>
    </SearchQueryProvider>
  );
}
