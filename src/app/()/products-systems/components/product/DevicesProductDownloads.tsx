"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import DevicesProductDownloadsCopyLink from "./DevicesProductDownloadsCopyLink";
import DevicesProductDownloadsDocumentFilter from "./DevicesProductDownloadsDocumentFilter";
import DevicesProductDownloadsFilter from "./DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterBoundary,
  useDevicesProductDownloadsFilter,
} from "./DevicesProductDownloadsFilterProvider";
import DevicesProductDownloadsMobileControls from "./DevicesProductDownloadsMobileControls";
import {
  fetchProductDownloadsPage,
  PRODUCT_DOWNLOADS_DEFAULT_SORT,
  PRODUCT_DOWNLOADS_PAGE_SIZE,
  productDownloadsSortLabel,
  productDownloadsSortOptions,
  type ProductDownloadsPage,
} from "../../data/productDetailContent";
import type { DownloadCenterSort } from "@/data/support/downloadCenterData";

type DevicesProductDownloadsProps = {
  initial: ProductDownloadsPage;
  productCodes: string[];
};

export default function DevicesProductDownloads({
  initial,
  productCodes,
}: DevicesProductDownloadsProps) {
  return (
    <DevicesProductDownloadsFilterBoundary productCodes={productCodes}>
      <DevicesProductDownloadsBody
        initial={initial}
        productCodes={productCodes}
      />
    </DevicesProductDownloadsFilterBoundary>
  );
}

function DevicesProductDownloadsBody({
  initial,
  productCodes,
}: DevicesProductDownloadsProps) {
  const { selectedDocTypes } = useDevicesProductDownloadsFilter();
  const docTypeKey = [...selectedDocTypes].sort().join(",");
  const productCodeKey = [...productCodes].sort().join(",");

  const [items, setItems] = useState(initial.items);
  const [totalElements, setTotalElements] = useState(initial.totalElements);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<DownloadCenterSort>(
    PRODUCT_DOWNLOADS_DEFAULT_SORT,
  );

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [docTypeKey, sort]);

  const skipFirstFetchRef = useRef(true);
  useEffect(() => {
    if (skipFirstFetchRef.current) {
      skipFirstFetchRef.current = false;
      return;
    }

    let alive = true;
    fetchProductDownloadsPage({
      docTypes: selectedDocTypes,
      productCodes,
      page: currentPage,
      sort,
    }).then((page) => {
      if (!alive) return;
      setItems(page.items);
      setTotalElements(page.totalElements);
      setTotalPages(page.totalPages);
    });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docTypeKey, productCodeKey, sort, currentPage]);

  const showingStart =
    items.length === 0 ? 0 : (currentPage - 1) * PRODUCT_DOWNLOADS_PAGE_SIZE + 1;
  const showingEnd = items.length === 0 ? 0 : showingStart + items.length - 1;

  return (
    <section className="devices_product_downloads" id="product-downloads">
        <div className="inner">
          <div className="devices_product_downloads__head">
            <h2 className="section_tit">Downloads</h2>
          </div>
          <DevicesProductDownloadsMobileControls
            sort={sort}
            onSortChange={setSort}
          />
          <div className="devices_product_downloads__body">
            <DevicesProductDownloadsFilter className="devices_product_downloads__filter-stack--pc">
              <DevicesProductDownloadsDocumentFilter />
            </DevicesProductDownloadsFilter>
          <div className="devices_product_downloads__main">
            <div className="devices_product_downloads__toolbar">
              <p className="devices_product_downloads__count">
                Showing {showingStart}-{showingEnd} of{" "}
                <strong>{totalElements.toLocaleString()}</strong> results
              </p>
              <div className="devices_product_downloads__search-row devices_product_downloads__search-row--pc">
                <FormControl className="guide_field guide_field--w200">
                  <GuideSelect
                    value={sort}
                    displayEmpty
                    onChange={(event) =>
                      setSort(event.target.value as DownloadCenterSort)
                    }
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": "Sort by" }}
                    renderValue={(value) => {
                      const text = productDownloadsSortLabel(
                        value as DownloadCenterSort,
                      );
                      return (
                        <span className="guide_field__select-value" title={text}>
                          {text}
                        </span>
                      );
                    }}
                  >
                    {productDownloadsSortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </GuideSelect>
                </FormControl>
                <TextField
                  className="guide_field guide_field--search"
                  placeholder=""
                  aria-label="key word downloads"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className="guide_field__search-adorn"
                        >
                          <button
                            type="button"
                            className="guide_field__search-icon-button"
                            aria-label="Search"
                          >
                            <img
                              loading="lazy"
                              decoding="async"
                              src="/ico/ico_search_24.svg"
                              alt=""
                              width={18}
                              height={18}
                            />
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
            </div>
            <div className="devices_product_downloads__list">
              {items.map((item, index) => (
                <article
                  key={`${item.id}-${currentPage}-${index}`}
                  className="devices_product_downloads__item"
                >
                  <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
                    <div className="devices_product_downloads__item-head-main">
                      <div className="devices_product_downloads__item-head-meta">
                        <span className="devices_product_downloads__type">
                          {item.type}
                        </span>
                        {item.date ? (
                          <time
                            className="devices_product_downloads__date"
                            dateTime={item.date}
                          >
                            {item.date}
                          </time>
                        ) : null}
                      </div>
                      <div className="devices_product_downloads__item-head-title-row">
                        <h3 className="devices_product_downloads__item-tit">
                          {item.title}
                        </h3>
                        {item.version ? (
                          <div className="devices_product_downloads__item-version">
                            <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                              <GuideSelect
                                defaultValue={item.version}
                                displayEmpty
                                IconComponent={GuideSelectIcon}
                                inputProps={{
                                  "aria-label": `Version for ${item.title}`,
                                }}
                                renderValue={(value) => {
                                  const text = value ? String(value) : item.version;
                                  return (
                                    <span
                                      className="guide_field__select-value"
                                      title={text}
                                    >
                                      {text}
                                    </span>
                                  );
                                }}
                              >
                                {(item.versions ?? [item.version]).map((version) => (
                                  <MenuItem key={version} value={version}>
                                    {version}
                                  </MenuItem>
                                ))}
                              </GuideSelect>
                            </FormControl>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </header>
                  <div className="devices_product_downloads__item-body">
                    <div className="devices_product_downloads__files-panel">
                      <ul className="devices_product_downloads__files">
                        {item.files.map((file) => (
                          <li key={file.name} className="devices_product_downloads__file">
                            <div className="devices_product_downloads__file-main">
                              <span
                                className="devices_product_downloads__pdf"
                                aria-hidden="true"
                              >
                                <img loading="lazy" decoding="async"
                                  src="/ico/ico_pdf_18.svg"
                                  alt=""
                                  width={18}
                                  height={18}
                                />
                              </span>
                              <span className="devices_product_downloads__file-name">
                                {file.name}
                                {file.size ? ` (${file.size})` : ""}
                              </span>
                            </div>
                            <div className="devices_product_downloads__file-actions">
                              <DevicesProductDownloadsCopyLink url={file.url} />
                              <button
                                type="button"
                                className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
                                onClick={() => {
                                  if (file.url) {
                                    window.open(file.url, "_blank", "noopener,noreferrer");
                                  }
                                }}
                              >
                                Download
                                <span
                                  className="devices_product_downloads__file-btn-icon"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <PageNumbering
              className="devices_product_downloads__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Downloads pagination"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
