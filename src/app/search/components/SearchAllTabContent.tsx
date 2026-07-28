"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchSearchAllProducts,
  type SearchAllProductsResult,
} from "@/data/search/searchAllProductsData";
import {
  fetchSearchAllDocuments,
  type SearchAllDocumentsResult,
} from "@/data/search/searchAllDocumentsData";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchProductCard from "./SearchProductCard";
import SearchDocumentsPanel from "./SearchDocumentsPanel";
import SearchMediaList from "./SearchMediaList";
import SearchMediaPanel from "./SearchMediaPanel";
import SearchPageList from "./SearchPageList";
import SearchPagesPanel from "./SearchPagesPanel";
import SearchProductsPanel from "./SearchProductsPanel";
import {
  searchAllAiSummary,
  searchAllMedia,
  searchAllPage,
  searchAllPages,
  searchAllTabs,
  searchSectionExploreLinks,
  type SearchTabId,
} from "@/data/search/searchAllContent";

// 검색 카운트 표기: 99 이하는 그대로, 100 이상은 "99+".
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
  const [activeTab, setActiveTab] = useState<SearchTabId>(initialTab);
  const [aiExpanded, setAiExpanded] = useState(false);
  const isAllTab = activeTab === "all";

  // 검색어(q)는 Hero 와 동일하게 URL ?q= 에서 읽는다.
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // Product 섹션 = 신규 검색 API 실연동(total: 탭/헤더 카운트, items: 카드). 실패 시 빈 결과.
  const [productResult, setProductResult] = useState<SearchAllProductsResult>({
    total: 0,
    items: [],
  });
  // Documents 섹션 = 신규 검색 API 실연동(total: 탭/헤더 카운트, items: 카드). 실패 시 빈 결과.
  const [documentResult, setDocumentResult] = useState<SearchAllDocumentsResult>(
    {
      total: 0,
      items: [],
    },
  );

  useEffect(() => {
    let alive = true;
    void fetchSearchAllProducts(query, { limit: 4 }).then((result) => {
      if (alive) setProductResult(result);
    });
    return () => {
      alive = false;
    };
  }, [query]);

  useEffect(() => {
    let alive = true;
    // 기획서 "최대 10개" — limit 10.
    void fetchSearchAllDocuments(query, 10).then((result) => {
      if (alive) setDocumentResult(result);
    });
    return () => {
      alive = false;
    };
  }, [query]);

  return (
    <section className="search_all" id="search-all">
      <div className="inner">
        <div className="search_all__tabs" role="tablist" aria-label="Search results">
          {searchAllTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            // All 탭/기타 탭은 목업 카운트 유지. Products/Documents 탭만 검색 API total 기반 + 99+ 임계 표기.
            const countLabel =
              tab.id === "all"
                ? `${tab.count}+`
                : tab.id === "products"
                  ? formatSearchCount(productResult.total)
                  : tab.id === "documents"
                    ? formatSearchCount(documentResult.total)
                    : String(tab.count);
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? "search_all__tab is-active" : "search_all__tab"}
                onClick={() => setActiveTab(tab.id)}
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

        {isAllTab ? (
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
              <div className="search_all__ai-body">
                <ul className="search_all__ai-list">
                  {searchAllAiSummary.map((line, index) => (
                    <li key={`ai-${index}`}>
                      <span className="search_all__ai-bullet" aria-hidden />
                      <span className="search_all__ai-list-text">{line}</span>
                    </li>
                  ))}
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

        {/* 이 화면 한정 예외: Product 검색결과 0건이면 섹션 자체 미표시(기획서 우선, 사용자 명시 결정). */}
        {isAllTab && productResult.items.length > 0 ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Product"
              count={formatSearchCount(productResult.total)}
              exploreHref={searchSectionExploreLinks.products}
            />
            <div className="search_all__products">
              {productResult.items.map((item) => (
                <SearchProductCard key={item.id} item={item} searchTerm={query} />
              ))}
            </div>
          </div>
        ) : null}

        {/* 이 화면 한정 예외: Documents 검색결과 0건이면 섹션 자체 미표시(기획서 우선, 사용자 명시 결정). */}
        {isAllTab && documentResult.items.length > 0 ? (
          <div className="search_all__section search_all__section--documents devices_product_downloads">
            <SearchSectionHead
              title="Documents"
              count={formatSearchCount(documentResult.total)}
              exploreHref={searchSectionExploreLinks.documents}
            />
            <div className="search_all__documents-grid">
              {documentResult.items.map((item) => (
                <SearchDocumentsCard key={item.id} item={item} searchTerm={query} />
              ))}
            </div>
          </div>
        ) : null}

        {isAllTab ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Media"
              count={10}
              exploreHref={searchSectionExploreLinks.media}
            />
            <SearchMediaList items={searchAllMedia} variant="card" />
          </div>
        ) : null}

        {isAllTab ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Pages"
              count={16}
              exploreHref={searchSectionExploreLinks.pages}
            />
            <SearchPageList
              items={searchAllPages}
              listClassName="search_all__pages"
              itemClassName="search_all__page-item"
              variant="pages"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
