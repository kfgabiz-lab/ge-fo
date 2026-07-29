"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchPageList from "./SearchPageList";
import SearchPagesFilterPanel from "./SearchPagesFilterPanel";
import { SearchPagesFilterProvider } from "./SearchPagesFilterProvider";
import { searchPagesPage } from "@/data/search/searchPagesContent";
import {
  EMPTY_SEARCH_PAGES_RESULT,
  fetchSearchPages,
  type SearchPagesResult,
} from "@/data/search/searchPagesData";

// Pages 탭 페이지 크기(퍼블리싱 기준 10건)
const { pageSize: PAGE_SIZE } = searchPagesPage;

function SearchPagesPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [result, setResult] = useState<SearchPagesResult>(
    EMPTY_SEARCH_PAGES_RESULT,
  );

  // 검색어(q)는 URL ?q= 에서 읽는다(All 탭/다른 탭과 동일 소스).
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const pageItems = result.items;
  const totalResults = result.totalElements;
  const totalPages = Math.max(1, result.totalPages);

  // 검색어 변경 시 1페이지로(최초 실행 제외).
  // 좌측 필터(Document Type)는 대응 컬럼이 없어 이번 라운드 API 미연동 — 결과에 영향을 주지 않는다.
  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [query]);

  // 실검색(검색어/페이지 변경 시). 실패 시 빈 결과 폴백은 헬퍼가 처리.
  useEffect(() => {
    let alive = true;
    void fetchSearchPages(query, {
      // 화면 페이지는 1-based, API page 는 0-based.
      page: currentPage - 1,
      size: PAGE_SIZE,
    }).then((res) => {
      if (alive) setResult(res);
    });
    return () => {
      alive = false;
    };
  }, [query, currentPage]);

  return (
    <section className="search_pages devices_product_downloads" id="search-pages">
      <div className="inner">
        <div className="search_pages__body devices_product_downloads__body">
          <SearchPagesFilterPanel
            variant="sidebar"
            sidebarClassName="search_pages__filter devices_product_downloads__filter-stack--pc"
          />

          <div className="search_pages__main">
            <div className="search_pages__list-block">
              <div className="search_pages__mo-filter-wrap">
                <button
                  type="button"
                  className="search_pages__mo-filter"
                  onClick={() => setFilterOpen(true)}
                >
                  <span className="search_pages__mo-filter-label">Filter by</span>
                  <span className="search_pages__mo-filter-icon" aria-hidden>
                    <img
                      src="/ico/ico_filter_14.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                </button>
              </div>

              <div className="search_pages__results">
                <p className="search_pages__count">
                  Total <strong>{totalResults.toLocaleString()}</strong>
                </p>

                <SearchPageList
                  items={pageItems}
                  listClassName="search_all__pages"
                  itemClassName="search_all__page-item"
                  variant="pages"
                />
              </div>
            </div>

            <PageNumbering
              className="search_pages__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Search pages pagination"
            />
          </div>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <SearchPagesFilterPanel variant="modal" />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchPagesPanel() {
  return (
    <SearchPagesFilterProvider>
      <SearchPagesPanelContent />
    </SearchPagesFilterProvider>
  );
}
