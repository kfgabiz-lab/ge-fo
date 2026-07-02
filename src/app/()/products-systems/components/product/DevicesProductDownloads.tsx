"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import { downloadDocumentTypes } from "@/data/support/downloadCenterContent";
import DevicesProductDownloadsFilter from "./DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "./DevicesProductDownloadsFilterParts";
import type { ProductDownloadItem } from "../../data/productDetailContent";

const DOWNLOADS_PAGE_SIZE = 5;
const DOWNLOADS_TOTAL_RESULTS = 2658;

type DevicesProductDownloadsProps = {
  items: ProductDownloadItem[];
};

export default function DevicesProductDownloads({
  items,
}: DevicesProductDownloadsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(DOWNLOADS_TOTAL_RESULTS / DOWNLOADS_PAGE_SIZE),
  );

  const pageItems = useMemo(() => {
    if (items.length === 0) return [];

    const start = (currentPage - 1) * DOWNLOADS_PAGE_SIZE;
    const pool: ProductDownloadItem[] = [];

    while (pool.length < start + DOWNLOADS_PAGE_SIZE) {
      pool.push(...items);
    }

    return pool.slice(start, start + DOWNLOADS_PAGE_SIZE);
  }, [currentPage, items]);

  const showingStart = (currentPage - 1) * DOWNLOADS_PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * DOWNLOADS_PAGE_SIZE, DOWNLOADS_TOTAL_RESULTS);

  return (
    <section className="devices_product_downloads" id="product-downloads">
      <div className="inner">
        <div className="devices_product_downloads__head">
          <h2 className="section_tit">Downloads</h2>
          {/* <p className="section_desc">
            Access all the technical assets you need in one place. Download
            high-resolution CAD drawings, detailed installation manuals, and the
            latest product catalogs to streamline your engineering workflow.
          </p> */}
        </div>
        <div className="devices_product_downloads__body">
          <DevicesProductDownloadsFilter>
            <DevicesProductDownloadsFilterSection
              title="Document type"
              variant="document"
            >
              {downloadDocumentTypes.map((option) => (
                <DevicesProductDownloadsFilterCheckRow
                  key={option.id}
                  id={`pd-doc-${option.id}`}
                  label={option.label}
                  count={option.count}
                  defaultChecked={option.defaultChecked}
                />
              ))}
            </DevicesProductDownloadsFilterSection>
          </DevicesProductDownloadsFilter>
          <div className="devices_product_downloads__main">
            <div className="devices_product_downloads__toolbar">
              <p className="devices_product_downloads__count">
                Showing {showingStart}-{showingEnd} of{" "}
                <strong>{DOWNLOADS_TOTAL_RESULTS.toLocaleString()}</strong> results
              </p>
              <div className="devices_product_downloads__search-row">
                <FormControl className="guide_field guide_field--w200">
                  <GuideSelect
                    defaultValue="Most Recent"
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": "Sort by" }}
                    renderValue={(value) => {
                      const text = value ? String(value) : "Sort by";
                      return (
                        <span className="guide_field__select-value" title={text}>
                          {text}
                        </span>
                      );
                    }}
                  >
                    <MenuItem value="Most Recent">Most Recent</MenuItem>
                    <MenuItem value="A to Z">A to Z</MenuItem>
                    <MenuItem value="Z to A">Z to A</MenuItem>
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
              {pageItems.map((item, index) => (
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
                          <button
                            type="button"
                            className="devices_product_downloads__file-btn devices_product_downloads__file-btn--copy"
                          >
                            Copy Link
                            <span
                              className="devices_product_downloads__file-btn-icon"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
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
