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
import SearchProductCard from "./SearchProductCard";
import SearchDocumentsPanel from "./SearchDocumentsPanel";
import SearchMediaList from "./SearchMediaList";
import SearchMediaPanel from "./SearchMediaPanel";
import SearchPageList from "./SearchPageList";
import SearchPagesPanel from "./SearchPagesPanel";
import SearchProductsPanel from "./SearchProductsPanel";
import {
  buildSearchTabHref,
  searchAllAiSummary,
  searchAllPage,
  searchAllTabs,
  searchSectionExploreLinks,
  toSearchTabId,
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
  // 검색어(q)는 Hero 와 동일하게 URL ?q= 에서 읽는다.
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // 상단 탭은 URL ?tab= 으로도 지정할 수 있다(All 탭 Media 섹션의 Explore 이동 등).
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<SearchTabId>(
    () => toSearchTabId(tabParam) ?? initialTab,
  );
  const [aiExpanded, setAiExpanded] = useState(false);
  const isAllTab = activeTab === "all";

  // 같은 /search 라우트 내 이동(?tab= 변경)은 컴포넌트를 재마운트하지 않으므로 파라미터 변화를 반영한다.
  useEffect(() => {
    const next = toSearchTabId(tabParam);
    if (next) setActiveTab(next);
  }, [tabParam]);

  // 탭 버튼 클릭 시 상태와 URL(?tab=)을 함께 맞춘다(All 은 기본값이므로 파라미터 제거).
  // URL 을 갱신하지 않으면 "?tab=media 상태 → All 탭 버튼 클릭 → Media 섹션 Explore 클릭" 순서에서
  // 이동 대상 href 가 현재 URL 과 같아져(?tab=media) 탭이 전환되지 않는다.
  // 히스토리를 늘리지 않도록 replace + 스크롤 유지.
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
  // Media 섹션 = media-search API 실연동. 한 번의 호출 결과로 탭 라벨 카운트/섹션 헤더 카운트/카드를 모두 채운다.
  const [mediaResult, setMediaResult] = useState<SearchMediaResult>(
    EMPTY_SEARCH_MEDIA_RESULT,
  );
  // Pages 섹션 = page-search API 실연동. 한 번의 호출 결과로 탭 라벨 카운트/섹션 헤더 카운트/목록을 모두 채운다.
  const [pagesResult, setPagesResult] = useState<SearchPagesResult>(
    EMPTY_SEARCH_PAGES_RESULT,
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

  useEffect(() => {
    let alive = true;
    // 퍼블리싱 Media 섹션 카드 4개 기준 — size 4(소스 필터 없이 4종 전체).
    // totalElements 는 size 와 무관한 전체 건수라 탭/헤더 카운트로 그대로 재사용한다(카운트 전용 추가 호출 없음).
    void fetchSearchMedia(query, { size: 4 }).then((result) => {
      if (alive) setMediaResult(result);
    });
    return () => {
      alive = false;
    };
  }, [query]);

  useEffect(() => {
    let alive = true;
    // 퍼블리싱 Pages 섹션 목록 4건 기준 — size 4.
    // totalElements 는 size 와 무관한 전체 건수라 탭/헤더 카운트로 그대로 재사용한다(카운트 전용 추가 호출 없음).
    void fetchSearchPages(query, { size: 4 }).then((result) => {
      if (alive) setPagesResult(result);
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
            // All 탭만 목업 카운트 유지. Products/Documents/Media/Pages 탭은 검색 API total 기반 + 99+ 임계 표기.
            const countLabel =
              tab.id === "all"
                ? `${tab.count}+`
                : tab.id === "products"
                  ? formatSearchCount(productResult.total)
                  : tab.id === "documents"
                    ? formatSearchCount(documentResult.total)
                    : tab.id === "media"
                      ? formatSearchCount(mediaResult.totalElements)
                      : tab.id === "pages"
                        ? formatSearchCount(pagesResult.totalElements)
                        : String(tab.count);
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

        {/* 이 화면 한정 예외: Media 검색결과 0건이면 섹션 자체 미표시(형제 섹션 Product/Documents 와 동일 정책). */}
        {isAllTab && mediaResult.items.length > 0 ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Media"
              count={formatSearchCount(mediaResult.totalElements)}
              // Explore 클릭 시 다른 화면이 아니라 상단 Media 탭이 선택된 상태로 이동(기획 주석 #11). 검색어(q)는 유지.
              exploreHref={buildSearchTabHref(query, "media")}
            />
            <SearchMediaList items={mediaResult.items} variant="card" />
          </div>
        ) : null}

        {/* 이 화면 한정 예외: Pages 검색결과 0건이면 섹션 자체 미표시(형제 섹션 Product/Documents/Media 와 동일 정책). */}
        {isAllTab && pagesResult.items.length > 0 ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Pages"
              count={formatSearchCount(pagesResult.totalElements)}
              exploreHref={searchSectionExploreLinks.pages}
            />
            <SearchPageList
              items={pagesResult.items}
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
