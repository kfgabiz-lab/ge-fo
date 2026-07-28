"use client";

import { useMemo, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchDocumentsActiveFilters from "./SearchDocumentsActiveFilters";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchDocumentsFilterPanel from "./SearchDocumentsFilterPanel";
import { SearchDocumentsFilterProvider } from "./SearchDocumentsFilterProvider";
import {
  getSearchDocumentPageItems,
  searchDocumentsDemoKeyword,
  searchDocumentsPage,
} from "@/data/search/searchDocumentsContent";
import { searchAllListClasses } from "./searchAllListClasses";

function SearchDocumentsPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const { totalResults, pageSize } = searchDocumentsPage;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(
    () => getSearchDocumentPageItems(currentPage, pageSize),
    [currentPage, pageSize],
  );

  return (
    <section
      className="search_documents devices_product_downloads"
      id="search-documents"
    >
      <div className="inner">
        <div className="search_documents__body devices_product_downloads__body">
          <SearchDocumentsFilterPanel
            variant="sidebar"
            sidebarClassName="search_documents__filter devices_product_downloads__filter-stack--pc"
          />

          <div className="search_documents__main">
            <div className="search_documents__panel">
              <div className="search_documents__mo-filter-wrap">
                <button
                  type="button"
                  className="search_documents__mo-filter"
                  onClick={() => setFilterOpen(true)}
                >
                  <span className="search_documents__mo-filter-label">Filter by</span>
                  <span className="search_documents__mo-filter-icon" aria-hidden>
                    <img
                      src="/ico/ico_filter_14.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                </button>
              </div>

              <SearchDocumentsActiveFilters />
            </div>

            <div className="search_documents__results">
              <p className="search_documents__count">
                Total <strong>{totalResults.toLocaleString()}</strong>
              </p>

              <ul className="search_documents__list">
                {pageItems.map((item, index) => (
                  <li
                    key={`${item.id}-${currentPage}-${index}`}
                    className={searchAllListClasses.item}
                  >
                    <SearchDocumentsCard
                      item={item}
                      searchTerm={searchDocumentsDemoKeyword}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <PageNumbering
              className="search_documents__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Search documents pagination"
            />
          </div>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <SearchDocumentsFilterPanel variant="modal" />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchDocumentsPanel() {
  return (
    <SearchDocumentsFilterProvider>
      <SearchDocumentsPanelContent />
    </SearchDocumentsFilterProvider>
  );
}
