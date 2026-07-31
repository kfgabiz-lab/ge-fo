"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  fetchSearchAllProducts,
  type SearchAllProductsResult,
} from "@/data/search/searchAllProductsData";
import {
  fetchSearchAllDocuments,
  type SearchAllDocumentsResult,
} from "@/data/search/searchAllDocumentsData";
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
import SearchMediaList from "./SearchMediaList";
import SearchMediaPanel from "./SearchMediaPanel";
import SearchPageList from "./SearchPageList";
import SearchPagesPanel from "./SearchPagesPanel";
import SearchProductsPanel from "./SearchProductsPanel";
// import {
//   buildSearchTabHref,
//   // searchAllAiSummary,
//   searchAllPage,
//   searchAllTabs,
//   toSearchTabId,
//   type SearchTabId,
// } from "@/data/search/searchAllContent";

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

import {
  fetchIntegratedSearch,
} from "@/data/search/searchIntegratedData";


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
  const isAllTab = activeTab === "all";



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

  useEffect(() => {
    let alive = true;
    void fetchSearchAllProducts(query, { limit: 4 }).then((result) => {
      if (!alive) return;
      setProductResult(result);
      setLoaded((prev) => ({ ...prev, products: true }));
    });
    return () => {
      alive = false;
    };
  }, [query]);

  useEffect(() => {
    let alive = true;
    void fetchSearchAllDocuments(query, 4).then((result) => {
      if (!alive) return;
      setDocumentResult(result);
      setLoaded((prev) => ({ ...prev, documents: true }));
    });
    return () => {
      alive = false;
    };
  }, [query]);

  useEffect(() => {
    let alive = true;
    void fetchSearchMedia(query, { size: 4 }).then((result) => {
      if (!alive) return;
      setMediaResult(result);
      setLoaded((prev) => ({ ...prev, media: true }));
    });
    return () => {
      alive = false;
    };
  }, [query]);

  useEffect(() => {
    let alive = true;
    void fetchSearchPages(query, { size: 4 }).then((result) => {
      if (!alive) return;
      setPagesResult(result);
      setLoaded((prev) => ({ ...prev, pages: true }));
    });
    return () => {
      alive = false;
    };
  }, [query]);

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
      return;
    }

    const controller = new AbortController();

    setAiAnswer("");
    setChatbotKeyword("");

    void fetchChatbotStream(
        trimmedQuery,
        {
          /*
           * 첫 번째 response.keyword 이벤트
           */
          onKeyword: (keywordEvent) => {
            const keyword =
                keywordEvent.keyword?.trim();

            if (!keyword) {
              console.warn(
                  "[CHATBOT KEYWORD EMPTY]",
                  keywordEvent,
              );

              return;
            }

            console.log(
                "[CHATBOT KEYWORD RECEIVED]",
                keyword,
                new Date().toISOString(),
                performance.now(),
            );

            setChatbotKeyword(keyword);

            console.log(
                "[INTEGRATION SEARCH START]",
                keyword,
                new Date().toISOString(),
                performance.now(),
            );

            /*
             * keyword를 받으면 통합검색 API 별도 호출
             */
            void fetchIntegratedSearch(
                keyword,
                "all",
                "1",
                controller.signal,
            )
                .then((result) => {
                  console.log(
                      "[INTEGRATION SEARCH RESPONSE]",
                      result,
                      new Date().toISOString(),
                      performance.now(),
                  );
                })
                .catch((error: unknown) => {
                  /*
                   * query가 바뀌어 요청을 취소한 경우는 오류로 출력하지 않음
                   */
                  if (
                      error instanceof DOMException &&
                      error.name === "AbortError"
                  ) {
                    return;
                  }

                  console.error(
                      "[INTEGRATION SEARCH ERROR]",
                      error,
                  );
                });
          },

          /*
           * 챗봇 AI 답변 누적
           */
          onChunk: (chunkEvent) => {
            if (!chunkEvent.chunk) {
              return;
            }
            console.log(
                "[CHATBOT CHUNK RECEIVED]",
                chunkEvent.chunk,
                new Date().toISOString(),
                performance.now(),
            );

            setAiAnswer(
                previous =>
                    previous + chunkEvent.chunk,
            );
          },

          onCompleted: (completedEvent) => {
            console.log(
                "[CHATBOT COMPLETED]",
                completedEvent,
                new Date().toISOString(),
                performance.now(),
            );
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

      console.error(
          "[CHATBOT STREAM ERROR]",
          error,
      );
    });

    /*
     * q가 바뀌거나 컴포넌트가 사라지면
     * 이전 SSE와 통합검색 요청을 취소한다.
     */
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
                  : "–"
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

        {activeTab === "products" ? <SearchProductsPanel /> : null}
        {activeTab === "documents" ? <SearchDocumentsPanel /> : null}
        {activeTab === "media" ? <SearchMediaPanel /> : null}
        {activeTab === "pages" ? <SearchPagesPanel /> : null}

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
              {/*<div className="search_all__ai-body">*/}
              {/*  <ul className="search_all__ai-list">*/}
              {/*    {searchAllAiSummary.map((line, index) => (*/}
              {/*      <li key={`ai-${index}`}>*/}
              {/*        <span className="search_all__ai-bullet" aria-hidden />*/}
              {/*        <span className="search_all__ai-list-text">{line}</span>*/}
              {/*      </li>*/}
              {/*    ))}*/}
              {/*  </ul>*/}
              {/*</div>*/}
              <div className="search_all__ai-list">
                <ul className="search_all__ai-list">
                  <li>
                {aiAnswer ? (
                    <span className="search_all__ai-list-text">
                      {aiAnswer}
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
                <SearchProductCard key={item.id} item={item} searchTerm={query} />
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
