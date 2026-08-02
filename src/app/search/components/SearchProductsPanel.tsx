"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchEmptyResult from "./SearchEmptyResult";
import SearchProductCard from "./SearchProductCard";
import SearchProductsActiveFilters from "./SearchProductsActiveFilters";
import SearchProductsFilterPanel from "./SearchProductsFilterPanel";
import {
  SearchProductsFilterProvider,
  useSearchProductsFilter,
} from "./SearchProductsFilterProvider";
import {
  fetchSearchAllProducts,
  type SearchAllProductsResult,
} from "@/data/search/searchAllProductsData";
import { searchAllListClasses } from "./searchAllListClasses";

const PAGE_SIZE = 10;

type SearchPanelTotalProps = {
  onTotalChange?: (total: number, filtered: boolean) => void;
  onFilteredChange?: (filtered: boolean) => void;
};

function SearchProductsPanelContent({
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [result, setResult] = useState<SearchAllProductsResult>({
    total: 0,
    items: [],
  });
  const [loaded, setLoaded] = useState(false);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { getSelectedCategoryValues } = useSearchProductsFilter();
  const selectedCategories = getSelectedCategoryValues("category");
  const categoriesKey = [...selectedCategories].sort().join(",");

  const isFiltered = categoriesKey !== "";

  const pageItems = result.items;
  const totalResults = result.total;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const isEmptyResult = loaded && pageItems.length === 0;

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [query, categoriesKey]);

  useEffect(() => {
    onFilteredChange?.(isFiltered);
  }, [isFiltered, onFilteredChange]);

  useEffect(() => {
    let alive = true;
    void fetchSearchAllProducts(query, {
      categories: selectedCategories,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    }).then((res) => {
      if (!alive) return;
      setResult(res);
      setLoaded(true);
      onTotalChange?.(res.total, isFiltered);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoriesKey, currentPage]);

  return (
    <section
      className="search_products devices_product_downloads"
      id="search-products"
    >
      <div className="inner">
        <div className="search_products__body devices_product_downloads__body">
          <SearchProductsFilterPanel
            variant="sidebar"
            sidebarClassName="search_products__filter devices_product_downloads__filter-stack--pc"
          />

          <div className="search_products__main">
            <div className="search_products__panel">
              <div className="search_products__mo-filter-wrap">
                <button
                  type="button"
                  className="search_products__mo-filter"
                  onClick={() => setFilterOpen(true)}
                >
                  <span className="search_products__mo-filter-label">Filter by</span>
                  <span className="search_products__mo-filter-icon" aria-hidden>
                    <img
                      src="/ico/ico_filter_14.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                </button>
              </div>

              <SearchProductsActiveFilters />

              <div className="search_products__results">
                <p className="search_products__count">
                  Total <strong>{totalResults.toLocaleString()}</strong>
                </p>

                {isEmptyResult ? (
                  <SearchEmptyResult />
                ) : (
                  <ul className="search_products__list">
                    {pageItems.map((item, index) => (
                      <li
                        key={`${item.id}-${currentPage}-${index}`}
                        className={searchAllListClasses.item}
                      >
                        <SearchProductCard item={item} searchTerm={query} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {isEmptyResult ? null : (
              <PageNumbering
                className="search_products__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                ariaLabel="Search products pagination"
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
        <SearchProductsFilterPanel variant="modal" />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchProductsPanel({
  onTotalChange,
  onFilteredChange,
}: SearchPanelTotalProps) {
  return (
    <SearchProductsFilterProvider>
      <SearchProductsPanelContent
        onTotalChange={onTotalChange}
        onFilteredChange={onFilteredChange}
      />
    </SearchProductsFilterProvider>
  );
}
