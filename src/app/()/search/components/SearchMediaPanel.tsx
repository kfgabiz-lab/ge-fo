"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import PageNumbering from "@/components/pagination/PageNumbering";
import {
  getSearchMediaPageItems,
  searchMediaPage,
  searchMediaTypes,
} from "@/data/search/searchMediaContent";

export default function SearchMediaPanel() {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalResults, pageSize } = searchMediaPage;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(
    () => getSearchMediaPageItems(currentPage, pageSize),
    [currentPage, pageSize],
  );

  return (
    <section className="search_media devices_product_downloads" id="search-media">
      <div className="inner">
        <div className="search_media__body devices_product_downloads__body">
          <aside className="search_media__filter">
            <DevicesProductDownloadsFilter>
              <DevicesProductDownloadsFilterSection title="Document Type">
                {searchMediaTypes.map((option) => (
                  <DevicesProductDownloadsFilterCheckRow
                    key={option.id}
                    id={`search-media-type-${option.id}`}
                    label={option.label}
                    count={option.count}
                  />
                ))}
              </DevicesProductDownloadsFilterSection>
            </DevicesProductDownloadsFilter>
          </aside>

          <div className="search_media__main">
            <p className="search_media__count">
              Total <strong>{totalResults.toLocaleString()}</strong>
            </p>

            <ul className="search_all__media">
              {pageItems.map((item, index) => (
                <li key={`${item.id}-${currentPage}-${index}`}>
                  <Link href={item.href} prefetch={false} className="search_all__media-item">
                    <div
                      className={
                        item.variant === "video"
                          ? "search_all__media-thumb search_all__media-thumb--video"
                          : "search_all__media-thumb"
                      }
                    >
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="search_all__media-body">
                      <p className="search_all__media-cat">{item.category}</p>
                      <h3 className="search_all__media-tit">{item.title}</h3>
                      {item.description ? (
                        <p className="search_all__media-desc">
                          {item.description.split("\n").map((line, lineIndex) => (
                            <span key={`${item.id}-${lineIndex}`}>
                              {lineIndex > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <PageNumbering
              className="search_media__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Search media pagination"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
