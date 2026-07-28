"use client";

import { useMemo, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchPageList from "./SearchPageList";
import SearchPagesFilterPanel from "./SearchPagesFilterPanel";
import { SearchPagesFilterProvider } from "./SearchPagesFilterProvider";
import {
  getSearchPagesPageItems,
  searchPagesPage,
} from "@/data/search/searchPagesContent";

function SearchPagesPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const { totalResults, pageSize } = searchPagesPage;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(
    () => getSearchPagesPageItems(currentPage, pageSize),
    [currentPage, pageSize],
  );

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
