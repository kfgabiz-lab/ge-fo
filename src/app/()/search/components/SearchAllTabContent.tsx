"use client";

import Link from "next/link";
import { useState } from "react";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchDocumentsPanel from "./SearchDocumentsPanel";
import SearchMediaPanel from "./SearchMediaPanel";
import SearchPageList from "./SearchPageList";
import SearchPagesPanel from "./SearchPagesPanel";
import SearchProductsPanel from "./SearchProductsPanel";
import {
  searchAllAiSummary,
  searchAllDocuments,
  searchAllMedia,
  searchAllPage,
  searchAllPages,
  searchAllProducts,
  searchAllTabs,
  searchSectionExploreLinks,
  type SearchTabId,
} from "@/data/search/searchAllContent";

function SearchSectionHead({
  title,
  count,
  exploreHref,
}: {
  title: string;
  count: number;
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

  return (
    <section className="search_all" id="search-all">
      <div className="inner">
        <div className="search_all__tabs" role="tablist" aria-label="Search results">
          {searchAllTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const countLabel = tab.id === "all" ? `${tab.count}+` : String(tab.count);
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
            <span className="search_all__ai-badge" aria-hidden>
              AI
            </span>
            <div className="search_all__ai-head">
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
              {!aiExpanded ? <div className="search_all__ai-fade" aria-hidden /> : null}
            </div>
            <div className="search_all__ai-more">
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

        {isAllTab ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Product"
              count={60}
              exploreHref={searchSectionExploreLinks.products}
            />
            <div className="search_all__products">
              {searchAllProducts.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={false}
                  className="search_all__product"
                >
                  <div className="search_all__product-img">
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="search_all__product-body">
                    <p className="search_all__product-path">
                      <span className="search_all__product-path-label">{item.category}</span>
                      <span className="search_all__product-path-icon" aria-hidden />
                      <span className="search_all__mark">{item.highlight}</span>
                    </p>
                    <div className="search_all__product-text">
                      <h3 className="search_all__product-tit">
                        {item.title.split("\n").map((line, index) => (
                          <span key={`${item.id}-tit-${index}`}>
                            {index > 0 ? <br /> : null}
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p className="search_all__product-desc">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {isAllTab ? (
          <div className="search_all__section search_all__section--documents devices_product_downloads">
            <SearchSectionHead
              title="Documents"
              count={20}
              exploreHref={searchSectionExploreLinks.documents}
            />
            <div className="search_all__documents-grid">
              {searchAllDocuments.map((item) => (
                <SearchDocumentsCard
                  key={item.id}
                  item={item}
                  className="search_all__document"
                />
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
            <ul className="search_all__media">
              {searchAllMedia.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} prefetch={false} className="search_all__media-item">
                    <div
                      className={
                        item.variant === "video"
                          ? "search_all__media-thumb search_all__media-thumb--video"
                          : "search_all__media-thumb"
                      }
                    >
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="search_all__media-body">
                      <p className="search_all__media-cat">{item.category}</p>
                      <h3 className="search_all__media-tit">{item.title}</h3>
                      {item.description ? (
                        <p className="search_all__media-desc">
                          {item.description.split("\n").map((line, index) => (
                            <span key={`${item.id}-${index}`}>
                              {index > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
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
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
