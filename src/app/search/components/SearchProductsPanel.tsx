"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
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

// Products 탭은 10개 단위 페이징.
const PAGE_SIZE = 10;

function SearchProductsPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [result, setResult] = useState<SearchAllProductsResult>({
    total: 0,
    items: [],
  });

  // 검색어(q)는 URL ?q= 에서 읽는다(All 탭과 동일 소스).
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  // 선택된 Lv2 category-data row_id 목록(Lv1 체크 시 하위 리프가 전개됨). 정렬해 안정 의존성 키로 사용.
  const { getSelectedCategoryValues } = useSearchProductsFilter();
  const selectedCategories = getSelectedCategoryValues("category");
  const categoriesKey = [...selectedCategories].sort().join(",");

  const pageItems = result.items;
  const totalResults = result.total;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  // 검색어/필터 변경 시 1페이지로(최초 실행 제외).
  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [query, categoriesKey]);

  // 실검색(검색어/선택 카테고리/페이지 변경 시). 실패 시 빈 결과 폴백은 헬퍼가 처리.
  useEffect(() => {
    let alive = true;
    void fetchSearchAllProducts(query, {
      categories: selectedCategories,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    }).then((res) => {
      if (alive) setResult(res);
    });
    return () => {
      alive = false;
    };
    // selectedCategories 는 categoriesKey 로 대표(매 렌더 새 배열이라 직접 의존 불가).
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
              </div>
            </div>

            <PageNumbering
              className="search_products__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Search products pagination"
            />
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

export default function SearchProductsPanel() {
  return (
    <SearchProductsFilterProvider>
      <SearchProductsPanelContent />
    </SearchProductsFilterProvider>
  );
}
