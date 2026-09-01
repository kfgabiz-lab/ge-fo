"use client";

import { useEffect, useRef, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchEmptyResult from "./SearchEmptyResult";
import SearchPageList from "./SearchPageList";
import SearchPagesActiveFilters from "./SearchPagesActiveFilters";
import SearchPagesFilterPanel from "./SearchPagesFilterPanel";
import {
  SearchPagesFilterProvider,
  useSearchPagesFilter,
} from "./SearchPagesFilterProvider";
import { searchPagesPage } from "@/data/search/searchPagesContent";
import {
  EMPTY_SEARCH_PAGES_RESULT,
  fetchSearchPages,
  type SearchPagesResult,
} from "@/data/search/searchPagesData";
import { useSearchQuery } from "./SearchQueryContext";

const { pageSize: PAGE_SIZE } = searchPagesPage;

type SearchPanelTotalProps = {
  onTotalChange?: (total: number, filtered: boolean) => void;
  onFilteredChange?: (filtered: boolean) => void;
};

export function SearchPagesPanelContent({
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [result, setResult] = useState<SearchPagesResult>({
    items: [],
    totalElements: 0,
    totalPages: 0,
    counts: {},
  });
  const [loaded, setLoaded] = useState(false);

  const { query, effectiveQuery, ready } = useSearchQuery();

  const { getSelectedCategoryValues } = useSearchPagesFilter();
  const selectedSections = getSelectedCategoryValues("document");
  const sectionsKey = [...selectedSections].sort().join(",");

  const isFiltered = sectionsKey !== "";

  const pageItems = result.items;
  const totalResults = result.totalElements;
  const totalPages = Math.max(1, result.totalPages);
  const isEmptyResult = loaded && pageItems.length === 0;

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [effectiveQuery, sectionsKey]);

  useEffect(() => {
    onFilteredChange?.(isFiltered);
  }, [isFiltered, onFilteredChange]);

  useEffect(() => {
    if (!ready) return;
    if (!effectiveQuery) {
      setResult(EMPTY_SEARCH_PAGES_RESULT);
      setLoaded(true);
      onTotalChange?.(0, isFiltered);
      return;
    }
    let alive = true;
    void fetchSearchPages(effectiveQuery, {
      sections: selectedSections,
      page: currentPage - 1,
      size: PAGE_SIZE,
      highlightTerm: query,
    }).then((res) => {
      if (!alive) return;
      setResult(res);
      setLoaded(true);
      onTotalChange?.(res.totalElements, isFiltered);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, effectiveQuery, query, sectionsKey, currentPage]);

  return (
    <section className="search_pages devices_product_downloads" id="search-pages">
      <div className="inner">
        <div className="search_pages__body devices_product_downloads__body">
          <SearchPagesFilterPanel
            variant="sidebar"
            sidebarClassName="search_pages__filter devices_product_downloads__filter-stack--pc"
            counts={result.counts}
          />

          <div className="search_pages__main">
            <div className="search_documents__panel">
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

              <SearchPagesActiveFilters />
            </div>

            <div className="search_pages__results">
              <p className="search_pages__count">
                Total <strong>{totalResults.toLocaleString()}</strong>
              </p>

              {isEmptyResult ? (
                <SearchEmptyResult />
              ) : (
                <SearchPageList
                  items={pageItems}
                  listClassName="search_all__pages"
                  itemClassName="search_all__page-item"
                  variant="pages"
                />
              )}
            </div>

            {isEmptyResult ? null : (
              <PageNumbering
                className="search_pages__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                ariaLabel="Search pages pagination"
                scrollTargetSelector=".search_pages__count"
              />
            )}
          </div>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <SearchPagesFilterPanel variant="modal" counts={result.counts} />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchPagesPanel({
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  return (
    <SearchPagesFilterProvider>
      <SearchPagesPanelContent
        onTotalChange={onTotalChange}
        onFilteredChange={onFilteredChange}
      />
    </SearchPagesFilterProvider>
  );
}
