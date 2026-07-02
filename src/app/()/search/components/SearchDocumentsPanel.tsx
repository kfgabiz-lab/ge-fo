"use client";

import { useMemo, useState } from "react";
import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchTabActiveFilters from "./SearchTabActiveFilters";
import {
  getSearchDocumentPageItems,
  searchDocumentActiveFilterDefaults,
  searchDocumentCategories,
  searchDocumentTypes,
  searchDocumentsPage,
} from "@/data/search/searchDocumentsContent";

export default function SearchDocumentsPanel() {
  const [currentPage, setCurrentPage] = useState(1);
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
          <aside className="search_documents__filter">
            <DevicesProductDownloadsFilter>
              <DevicesProductDownloadsFilterSection title="Product Category">
                {searchDocumentCategories.map((option) => (
                  <DevicesProductDownloadsCategoryFilterRow
                    key={option.id}
                    option={option}
                    idPrefix="search-document-category"
                  />
                ))}
              </DevicesProductDownloadsFilterSection>

              <DevicesProductDownloadsFilterSection
                title="Document Type"
                variant="document"
              >
                {searchDocumentTypes.map((option) => (
                  <DevicesProductDownloadsFilterCheckRow
                    key={option.id}
                    id={`search-document-type-${option.id}`}
                    label={option.label}
                    count={option.count}
                  />
                ))}
              </DevicesProductDownloadsFilterSection>
            </DevicesProductDownloadsFilter>
          </aside>

          <div className="search_documents__main">
            <SearchTabActiveFilters
              blockClass="search_documents"
              defaultFilters={searchDocumentActiveFilterDefaults}
            />

            <p className="search_documents__count">
              Total <strong>{totalResults.toLocaleString()}</strong>
            </p>

            <div className="search_documents__list">
              {pageItems.map((item, index) => (
                <SearchDocumentsCard key={`${item.id}-${currentPage}-${index}`} item={item} />
              ))}
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
    </section>
  );
}
