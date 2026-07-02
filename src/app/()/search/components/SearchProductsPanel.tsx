"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchTabActiveFilters from "./SearchTabActiveFilters";
import {
  getSearchProductPageItems,
  searchProductActiveFilterDefaults,
  searchProductCategories,
  searchProductDocumentTypes,
  searchProductsPage,
} from "@/data/search/searchProductsContent";

export default function SearchProductsPanel() {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalResults, pageSize } = searchProductsPage;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(
    () => getSearchProductPageItems(currentPage, pageSize),
    [currentPage, pageSize],
  );

  return (
    <section
      className="search_products devices_product_downloads"
      id="search-products"
    >
      <div className="inner">
        <div className="search_products__body devices_product_downloads__body">
          <aside className="search_products__filter">
            <DevicesProductDownloadsFilter>
              <DevicesProductDownloadsFilterSection title="Product Category">
                {searchProductCategories.map((option) => (
                  <DevicesProductDownloadsCategoryFilterRow
                    key={option.id}
                    option={option}
                    idPrefix="search-product-category"
                  />
                ))}
              </DevicesProductDownloadsFilterSection>

              <DevicesProductDownloadsFilterSection
                title="Document Type"
                variant="document"
              >
                {searchProductDocumentTypes.map((option) => (
                  <DevicesProductDownloadsFilterCheckRow
                    key={option.id}
                    id={`search-product-doc-${option.id}`}
                    label={option.label}
                    count={option.count}
                  />
                ))}
              </DevicesProductDownloadsFilterSection>
            </DevicesProductDownloadsFilter>
          </aside>

          <div className="search_products__main">
            <SearchTabActiveFilters
              blockClass="search_products"
              defaultFilters={searchProductActiveFilterDefaults}
            />

            <p className="search_products__count">
              Total <strong>{totalResults.toLocaleString()}</strong>
            </p>

            <ul className="search_products__list">
              {pageItems.map((item, index) => (
                <li key={`${item.id}-${currentPage}-${index}`}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="search_products__item"
                  >
                    <div className="search_products__item-img">
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="search_products__item-body">
                      <p className="search_products__item-path">
                        <span>{item.category}</span>
                        <span className="search_products__item-path-icon" aria-hidden />
                        <span className="search_all__mark">{item.highlight}</span>
                      </p>
                      <h3 className="search_products__item-tit">
                        {item.title.split("\n").map((line, index) => (
                          <span key={`${item.id}-tit-${index}`}>
                            {index > 0 ? <br /> : null}
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p className="search_products__item-desc">{item.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

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
    </section>
  );
}
