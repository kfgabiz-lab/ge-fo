"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchDocumentsActiveFilters from "./SearchDocumentsActiveFilters";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchDocumentsFilterPanel from "./SearchDocumentsFilterPanel";
import SearchEmptyResult from "./SearchEmptyResult";
import { useSearchDocumentsFilter } from "./SearchDocumentsFilterProvider";
import { searchDocumentsPage } from "@/data/search/searchDocumentsContent";
import {
  fetchDownloadCenterContentsByKeyword,
  type DownloadCenterItem,
} from "@/data/support/downloadCenterData";
import { searchAllListClasses } from "./searchAllListClasses";

const { pageSize: PAGE_SIZE } = searchDocumentsPage;

type SearchPanelTotalProps = {
  keyword: string;
  onTotalChange?: (total: number, filtered: boolean) => void;
  onFilteredChange?: (filtered: boolean) => void;
};

export default function SearchDocumentsPanel({
  keyword,
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [items, setItems] = useState<DownloadCenterItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const { getSelectedCategoryValues, getSelectedCategoryParentValues } =
    useSearchDocumentsFilter();
  const selectedCategories = getSelectedCategoryValues("category");
  const categoryKey = [...selectedCategories].sort().join(",");
  const selectedCategoryParentCodes = getSelectedCategoryParentValues("category");
  const parentCategoryKey = [...selectedCategoryParentCodes].sort().join(",");
  const selectedDocTypes = getSelectedCategoryValues("document");
  const docTypeKey = [...selectedDocTypes].sort().join(",");

  const isFiltered =
    categoryKey !== "" || parentCategoryKey !== "" || docTypeKey !== "";

  const isEmptyResult = loaded && items.length === 0;

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [keyword, categoryKey, parentCategoryKey, docTypeKey]);

  useEffect(() => {
    onFilteredChange?.(isFiltered);
  }, [isFiltered, onFilteredChange]);

  useEffect(() => {
    if (!keyword) {
      setItems([]);
      setTotalElements(0);
      setTotalPages(1);
      setLoaded(true);
      onTotalChange?.(0, isFiltered);
      return;
    }

    let alive = true;
    void fetchDownloadCenterContentsByKeyword({
      keyword,
      categories: selectedCategories,
      parentCategories: selectedCategoryParentCodes,
      docTypes: selectedDocTypes,
      page: currentPage - 1,
      size: PAGE_SIZE,
    }).then((res) => {
      if (!alive) return;
      setItems(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(Math.max(1, res.totalPages));
      setLoaded(true);
      onTotalChange?.(res.totalElements, isFiltered);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, categoryKey, parentCategoryKey, docTypeKey, currentPage]);

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
