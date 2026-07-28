"use client";

import { useMemo, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchMediaFilterPanel from "./SearchMediaFilterPanel";
import { SearchMediaFilterProvider } from "./SearchMediaFilterProvider";
import SearchMediaList from "./SearchMediaList";
import {
  getSearchMediaPageItems,
  searchMediaPage,
} from "@/data/search/searchMediaContent";

function SearchMediaPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const { totalResults, pageSize } = searchMediaPage;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(
    () => getSearchMediaPageItems(currentPage, pageSize),
    [currentPage, pageSize],
  );

  return (
    <section className="search_media devices_product_downloads" id="search-media">
      <div className="inner">
        <div className="search_media__body devices_product_downloads__body">
          <SearchMediaFilterPanel
            variant="sidebar"
            sidebarClassName="search_media__filter devices_product_downloads__filter-stack--pc"
          />

          <div className="search_media__main">
            <div className="search_media__list-block">
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

              <div className="search_media__results">
                <p className="search_media__count">
                  Total <strong>{totalResults.toLocaleString()}</strong>
                </p>

                <SearchMediaList items={pageItems} variant="card" />
              </div>
            </div>

            <PageNumbering
              className="search_media__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Search media pagination"
            />
          </div>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <SearchMediaFilterPanel variant="modal" />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchMediaPanel() {
  return (
    <SearchMediaFilterProvider>
      <SearchMediaPanelContent />
    </SearchMediaFilterProvider>
  );
}
