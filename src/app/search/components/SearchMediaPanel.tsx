"use client";

import { useEffect, useRef, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchMediaActiveFilters from "./SearchMediaActiveFilters";
import SearchMediaFilterPanel from "./SearchMediaFilterPanel";
import {
  SearchMediaFilterProvider,
  useSearchMediaFilter,
} from "./SearchMediaFilterProvider";
import SearchEmptyResult from "./SearchEmptyResult";
import SearchMediaList from "./SearchMediaList";
import { searchMediaPage } from "@/data/search/searchMediaContent";
import {
  EMPTY_SEARCH_MEDIA_RESULT,
  fetchSearchMedia,
  type SearchMediaResult,
} from "@/data/search/searchMediaData";
import { useSearchQuery } from "./SearchQueryContext";

const { pageSize: PAGE_SIZE } = searchMediaPage;

type SearchPanelTotalProps = {
  onTotalChange?: (total: number, filtered: boolean) => void;
  onFilteredChange?: (filtered: boolean) => void;
};

export function SearchMediaPanelContent({
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [result, setResult] = useState<SearchMediaResult>({
    items: [],
    totalElements: 0,
    totalPages: 0,
    counts: {},
  });
  const [loaded, setLoaded] = useState(false);

  const { query, effectiveQuery, ready } = useSearchQuery();

  const { getSelectedCategoryValues } = useSearchMediaFilter();
  const selectedSources = getSelectedCategoryValues("document");
  const sourcesKey = [...selectedSources].sort().join(",");

  const isFiltered = sourcesKey !== "";

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
  }, [effectiveQuery, sourcesKey]);

  useEffect(() => {
    onFilteredChange?.(isFiltered);
  }, [isFiltered, onFilteredChange]);

  useEffect(() => {
    if (!ready) return;
    if (!effectiveQuery) {
      setResult(EMPTY_SEARCH_MEDIA_RESULT);
      setLoaded(true);
      onTotalChange?.(0, isFiltered);
      return;
    }
    let alive = true;
    void fetchSearchMedia(effectiveQuery, {
      sources: selectedSources,
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
  }, [ready, effectiveQuery, query, sourcesKey, currentPage]);

  return (
    <section className="search_media devices_product_downloads" id="search-media">
      <div className="inner">
        <div className="search_media__body devices_product_downloads__body">
          <SearchMediaFilterPanel
            variant="sidebar"
            sidebarClassName="search_media__filter devices_product_downloads__filter-stack--pc"
            counts={result.counts}
          />

          <div className="search_media__main">
            <div className="search_documents__panel">
              <div className="search_media__mo-filter-wrap">
                <button
                  type="button"
                  className="search_media__mo-filter"
                  onClick={() => setFilterOpen(true)}
                >
                  <span className="search_media__mo-filter-label">Filter by</span>
                  <span className="search_media__mo-filter-icon" aria-hidden>
                    <img
                      src="/ico/ico_filter_14.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                </button>
              </div>

              <SearchMediaActiveFilters />
            </div>

            <div className="search_media__results">
              <p className="search_media__count">
                Total <strong>{totalResults.toLocaleString()}</strong>
              </p>

              {isEmptyResult ? (
                <SearchEmptyResult />
              ) : (
                <SearchMediaList items={pageItems} variant="card" />
              )}
            </div>

            {isEmptyResult ? null : (
              <PageNumbering
                className="search_media__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                ariaLabel="Search media pagination"
                scrollTargetSelector=".search_media__count"
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
        <SearchMediaFilterPanel variant="modal" counts={result.counts} />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchMediaPanel({
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  return (
    <SearchMediaFilterProvider>
      <SearchMediaPanelContent
        onTotalChange={onTotalChange}
        onFilteredChange={onFilteredChange}
      />
    </SearchMediaFilterProvider>
  );
}
