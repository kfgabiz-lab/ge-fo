"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  fetchSearchAllProducts,
  type SearchAllProductsResult,
} from "@/data/search/searchAllProductsData";
import {
  fetchSearchAllDocuments,
  type SearchAllDocumentsResult,
} from "@/data/search/searchAllDocumentsData";
import {
  fetchDownloadCenterContentsByKeyword,
  type DownloadCenterItem,
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

import {
  buildSearchTabHref,
  searchAllPage,
  searchAllTabs,
  toSearchTabId,
  type SearchTabId,
} from "@/data/search/searchAllContent";

import {
  fetchChatbotStream,
} from "@/data/search/searchChatbotData";


function formatSearchCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}

function SearchSectionHead({
  title,
  count,
  exploreHref,
}: {
  title: string;
  count: number | string;
  exploreHref: string;
}) {
  return (
    <div className="search_all__section-head">
      <div className="search_all__section-title-wrap">
        <h2 className="search_all__section-tit">{title}</h2>
        <span className="search_all__section-count">{count}</span>
      </div>
      <Link href={exploreHref} prefetch={false} className="btn-text-30 search_all__explore">
        Explore
        <span className="btn-text-30__icon" aria-hidden="true">
          <span className="icon_arrow-18" aria-hidden="true" />
        </span>
      </Link>
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
  const [aiExpanded, setAiExpanded] = useState(false);

  const [aiAnswer, setAiAnswer] = useState("");
  const [chatbotKeyword, setChatbotKeyword] = useState("");
  const [chatbotSettled, setChatbotSettled] = useState(false);
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
    },
    [pathname, router, searchParams],
  );
  const [productResult, setProductResult] = useState<SearchAllProductsResult>({
    total: 0,
    items: [],
  });
  const [documentResult, setDocumentResult] = useState<SearchAllDocumentsResult>(
    {
      total: 0,
      items: [],
    },
  );
  /* 챗봇 keyword로 1회 받아온 전체(미필터) 문서 리스트 — Documents탭이 재요청 없이 클라이언트에서 필터/페이지네이션 */
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

  useEffect(() => {
    setLoaded({
      products: false,
      documents: false,
      media: false,
      pages: false,
    });
  }, [query]);

  const previewQueryRef = useRef<{
    products: string | null;
    documents: string | null;
    media: string | null;
    pages: string | null;
  }>({ products: null, documents: null, media: null, pages: null });

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
    if (previewQueryRef.current.products === query) return;
    let alive = true;
    void fetchSearchAllProducts(query, { limit: 4 }).then((result) => {
      if (!alive) return;
      previewQueryRef.current.products = query;
      setProductResult(result);
      setLoaded((prev) => ({ ...prev, products: true }));
    });
    return () => {
      alive = false;
    };
  }, [query, skipProductsPreview]);

  useEffect(() => {
    const useFallback = !chatbotKeyword && chatbotSettled;
    if (!chatbotKeyword && !useFallback) return;

    const cacheKey = chatbotKeyword || `__query__:${query}`;
    if (previewQueryRef.current.documents === cacheKey) return;

    let alive = true;

    if (chatbotKeyword) {
      /* 챗봇 keyword 확정 시 전체 매칭 리스트를 1회만 받아 All탭(4건)/Documents탭(클라이언트 페이지네이션)이 공유 */
      void fetchDownloadCenterContentsByKeyword(chatbotKeyword).then((result) => {
        if (!alive) return;
        previewQueryRef.current.documents = cacheKey;
        setKeywordDocuments(result.items);
        setDocumentResult({ total: result.total, items: result.items.slice(0, 4) });
        setLoaded((prev) => ({ ...prev, documents: true }));
      });
    } else {
      void fetchSearchAllDocuments(query, 4).then((result) => {
        if (!alive) return;
        previewQueryRef.current.documents = cacheKey;
        setKeywordDocuments([]);
        setDocumentResult(result);
        setLoaded((prev) => ({ ...prev, documents: true }));
      });
    }
    return () => {
      alive = false;
    };
  }, [chatbotKeyword, chatbotSettled, query]);

  useEffect(() => {
    if (skipMediaPreview) return;
    if (previewQueryRef.current.media === query) return;
    let alive = true;
    void fetchSearchMedia(query, { size: 4 }).then((result) => {
      if (!alive) return;
      previewQueryRef.current.media = query;
      setMediaResult(result);
      setLoaded((prev) => ({ ...prev, media: true }));
    });
    return () => {
      alive = false;
    };
  }, [query, skipMediaPreview]);

  useEffect(() => {
    if (skipPagesPreview) return;
    if (previewQueryRef.current.pages === query) return;
    let alive = true;
    void fetchSearchPages(query, { size: 4 }).then((result) => {
      if (!alive) return;
      previewQueryRef.current.pages = query;
      setPagesResult(result);
      setLoaded((prev) => ({ ...prev, pages: true }));
    });
    return () => {
      alive = false;
    };
  }, [query, skipPagesPreview]);

  useEffect(() => {
    setLoaded({
      products: false,
      documents: false,
      media: false,
      pages: false,
    });
  }, [query]);

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

            const relatedKeywords = Array.isArray(keywordEvent.related_keywords)
                ? keywordEvent.related_keywords.filter(Boolean)
                : [];

            setChatbotKeyword([keyword, ...relatedKeywords].join(","));
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
    <section className="search_all" id="search-all">
      <div className="inner">
        <div className="search_all__tabs" role="tablist" aria-label="Search results">
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
                aria-selected={isActive}
                className={isActive ? "search_all__tab is-active" : "search_all__tab"}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label} ({countLabel})
              </button>
            );
          })}
        </div>

        {activeTab === "products" ? (
          <SearchProductsPanel
            onTotalChange={handleProductsTotal}
            onFilteredChange={handleProductsFiltered}
          />
        ) : null}
        {documentsFilterMounted ? (
          <SearchDocumentsFilterProvider>
            {activeTab === "documents" ? (
              <SearchDocumentsPanel
                items={keywordDocuments}
                loaded={loaded.documents}
              />
            ) : null}
          </SearchDocumentsFilterProvider>
        ) : null}
        {activeTab === "media" ? (
          <SearchMediaPanel
            onTotalChange={handleMediaTotal}
            onFilteredChange={handleMediaFiltered}
          />
        ) : null}
        {activeTab === "pages" ? (
          <SearchPagesPanel
            onTotalChange={handlePagesTotal}
            onFilteredChange={handlePagesFiltered}
          />
        ) : null}

        {isAllTab && !isAllTabEmpty ? (
          <div className={aiExpanded ? "search_all__ai is-expanded" : "search_all__ai"}>
            <div className="search_all__ai-content">
              <div className="search_all__ai-head">
                <img
                  className="search_all__ai-badge"
                  src="/img/search/search_all_ai_badge.png"
                  alt=""
                  width={58}
                  height={58}
                  decoding="async"
                  aria-hidden
                />
                <h2 className="search_all__ai-tit">{searchAllPage.aiTitle}</h2>
                <p className="search_all__ai-note">{searchAllPage.aiDisclaimer}</p>
              </div>
              <div className="search_all__ai-list">
                <ul className="search_all__ai-list">
                  <li>
                {aiAnswer ? (
                    <span className="search_all__ai-list-text">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiAnswer}
                      </ReactMarkdown>
                    </span>
                ) : (
                    <span className="search_all__ai-list-text">
                      AI response waiting...
                    </span>
                )}
                  </li>
                </ul>
              </div>
            </div>
            {!aiExpanded ? <div className="search_all__ai-fade" aria-hidden /> : null}
            <div className="search_all__ai-more">
              <span className="search_all__ai-more-line" aria-hidden />
              <button
                type="button"
                className="search_all__ai-more-btn"
                aria-expanded={aiExpanded}
                onClick={() => setAiExpanded((prev) => !prev)}
              >
                Read more
                <span className="search_all__ai-more-icon" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}

        {isAllTab && productResult.items.length > 0 ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Product"
              count={formatSearchCount(productResult.total)}
              exploreHref={buildSearchTabHref(query, "products")}
            />
            <div className="search_all__products">
              {productResult.items.map((item) => (
                <SearchProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : null}

        {isAllTab && documentResult.items.length > 0 ? (
          <div className="search_all__section search_all__section--documents devices_product_downloads">
            <SearchSectionHead
              title="Documents"
              count={formatSearchCount(documentResult.total)}
              exploreHref={buildSearchTabHref(query, "documents")}
            />
            <div className="search_all__documents-grid">
              {documentResult.items.map((item) => (
                <SearchDocumentsCard key={item.id} item={item} searchTerm={query} />
              ))}
            </div>
          </div>
        ) : null}

        {isAllTab && mediaResult.items.length > 0 ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Media"
              count={formatSearchCount(mediaResult.totalElements)}
              exploreHref={buildSearchTabHref(query, "media")}
            />
            <SearchMediaList items={mediaResult.items} variant="card" />
          </div>
        ) : null}

        {isAllTab && pagesResult.items.length > 0 ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Pages"
              count={formatSearchCount(pagesResult.totalElements)}
              exploreHref={buildSearchTabHref(query, "pages")}
            />
            <SearchPageList
              items={pagesResult.items}
              listClassName="search_all__pages"
              itemClassName="search_all__page-item"
              variant="pages"
            />
          </div>
        ) : null}

        {isAllTab && isAllTabEmpty ? <SearchEmptyResult /> : null}
      </div>
    </section>
  );
}
