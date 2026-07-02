"use client";

import { useMemo, useState } from "react";
import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import PageNumbering from "@/components/pagination/PageNumbering";
import {
  getSearchPagesPageItems,
  searchPageTypes,
  searchPagesPage,
} from "@/data/search/searchPagesContent";
import SearchPageList from "./SearchPageList";

export default function SearchPagesPanel() {
  const [currentPage, setCurrentPage] = useState(1);
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
          <aside className="search_pages__filter">
            <DevicesProductDownloadsFilter>
              <DevicesProductDownloadsFilterSection title="Document Type">
                {searchPageTypes.map((option) => (
                  <DevicesProductDownloadsFilterCheckRow
                    key={option.id}
                    id={`search-page-type-${option.id}`}
                    label={option.label}
                    count={option.count}
                  />
                ))}
              </DevicesProductDownloadsFilterSection>
            </DevicesProductDownloadsFilter>
          </aside>

          <div className="search_pages__main">
            <p className="search_pages__count">
              Total <strong>{totalResults.toLocaleString()}</strong>
            </p>

            <SearchPageList
              items={pageItems}
              listClassName="search_all__pages"
              itemClassName="search_all__page-item"
            />

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
    </section>
  );
}
