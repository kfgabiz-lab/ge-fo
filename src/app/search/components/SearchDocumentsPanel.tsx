"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchDocumentsActiveFilters from "./SearchDocumentsActiveFilters";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchDocumentsFilterPanel from "./SearchDocumentsFilterPanel";
import SearchEmptyResult from "./SearchEmptyResult";
import { useSearchDocumentsFilter } from "./SearchDocumentsFilterProvider";
import { searchDocumentsPage } from "@/data/search/searchDocumentsContent";
import type { DownloadCenterItem } from "@/data/support/downloadCenterData";
import { searchAllListClasses } from "./searchAllListClasses";

const { pageSize: PAGE_SIZE } = searchDocumentsPage;

type SearchDocumentsPanelProps = {
  /** 챗봇 keyword로 이미 한 번에 받아온 전체(미필터) 문서 리스트 — 재요청 없이 이 안에서 필터/페이지네이션 */
  items: DownloadCenterItem[];
  /** 상위(SearchAllTabContent)의 전체 리스트 fetch가 완료됐는지 여부 */
  loaded: boolean;
};

export default function SearchDocumentsPanel({
  items,
  loaded,
}: SearchDocumentsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

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

  /* 카테고리/문서유형 필터를 클라이언트에서 적용 — 이미 받아온 전체 리스트 안에서만 거른다(재요청 없음).
     서버 쿼리(DownloadCenterService.searchDocumentsByKeyword)의 조건과 동일한 의미:
     - docTypes: AND(IN)
     - categories(L2)/parentCategories(L1, L2 미배정 건만): OR로 묶여 docTypes와 AND */
  const filteredItems = useMemo(() => {
    if (!isFiltered) return items;
    const catSet = categoryKey ? new Set(categoryKey.split(",")) : null;
    const parentSet = parentCategoryKey ? new Set(parentCategoryKey.split(",")) : null;
    const docTypeSet = docTypeKey ? new Set(docTypeKey.split(",")) : null;

    return items.filter((item) => {
      if (docTypeSet && (!item.docType || !docTypeSet.has(item.docType))) {
        return false;
      }
      if (!catSet && !parentSet) return true;
      const matchesCategory = !!catSet && !!item.categoryL2Id && catSet.has(item.categoryL2Id);
      const matchesParent =
        !!parentSet && !item.categoryL2Id && !!item.categoryL1Id && parentSet.has(item.categoryL1Id);
      return matchesCategory || matchesParent;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isFiltered, categoryKey, parentCategoryKey, docTypeKey]);

  const totalElements = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
  const isEmptyResult = loaded && totalElements === 0;

  const pageItems = useMemo(() => {
    const from = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(from, from + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [items, categoryKey, parentCategoryKey, docTypeKey]);

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
                  {pageItems.map((item, index) => (
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
