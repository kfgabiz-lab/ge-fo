"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchDocumentsActiveFilters from "./SearchDocumentsActiveFilters";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchDocumentsFilterPanel from "./SearchDocumentsFilterPanel";
import SearchEmptyResult from "./SearchEmptyResult";
import {
  SearchDocumentsFilterProvider,
  useSearchDocumentsFilter,
} from "./SearchDocumentsFilterProvider";
import { searchDocumentsPage } from "@/data/search/searchDocumentsContent";
import { downloadDocTypeCodes } from "@/data/support/downloadCenterContent";
import {
  fetchDownloadCenterContents,
  type DownloadCenterItem,
} from "@/data/support/downloadCenterData";
import { searchAllListClasses } from "./searchAllListClasses";

const { pageSize: PAGE_SIZE } = searchDocumentsPage;

const VALID_DOC_TYPE_CODES = new Set<string>(downloadDocTypeCodes);

function SearchDocumentsPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [items, setItems] = useState<DownloadCenterItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const { getSelectedCategoryValues } = useSearchDocumentsFilter();
  const selectedCategories = getSelectedCategoryValues("category");
  const categoryKey = [...selectedCategories].sort().join(",");
  const selectedDocTypes = getSelectedCategoryValues("document").filter((code) =>
    VALID_DOC_TYPE_CODES.has(code),
  );
  const docTypeKey = [...selectedDocTypes].sort().join(",");

  const isEmptyResult = loaded && items.length === 0;

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [query, categoryKey, docTypeKey]);

  useEffect(() => {
    if (!query) {
      setItems([]);
      setTotalElements(0);
      setTotalPages(1);
      setLoaded(true);
      return;
    }

    let alive = true;
    void fetchDownloadCenterContents({
      q: query,
      categories: selectedCategories,
      docTypes: selectedDocTypes,
      page: currentPage - 1,
      size: PAGE_SIZE,
    }).then((res) => {
      if (!alive) return;
      setItems(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(Math.max(1, res.totalPages));
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryKey, docTypeKey, currentPage]);

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
                Total <strong>{totalElements.toLocaleString()}</strong>
              </p>

              {isEmptyResult ? (
                <SearchEmptyResult />
              ) : (
                <ul className="search_documents__list">
                  {items.map((item, index) => (
                    <li
                      key={`${item.id}-${currentPage}-${index}`}
                      className={searchAllListClasses.item}
                    >
                      <SearchDocumentsCard item={item} searchTerm={query} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isEmptyResult ? null : (
              <PageNumbering
                className="search_documents__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                ariaLabel="Search documents pagination"
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
