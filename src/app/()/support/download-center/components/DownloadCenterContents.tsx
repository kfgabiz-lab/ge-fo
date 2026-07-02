"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import DownloadCenterActiveFilters from "./DownloadCenterActiveFilters";
import DownloadCenterEmpty from "./DownloadCenterEmpty";
import {
  downloadCenterItems,
  downloadCenterPage,
  downloadDocumentTypes,
  downloadProductCategories,
} from "@/data/support/downloadCenterContent";

type DownloadCenterContentsProps = {
  empty?: boolean;
};

export default function DownloadCenterContents({
  empty = false,
}: DownloadCenterContentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalResults, pageSize } = downloadCenterPage;
  const resultCount = empty ? 0 : totalResults;

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(() => {
    if (empty) return [];

    const start = (currentPage - 1) * pageSize;
    const pool: typeof downloadCenterItems = [];

    while (pool.length < start + pageSize) {
      pool.push(...downloadCenterItems);
    }

    return pool.slice(start, start + pageSize);
  }, [currentPage, empty, pageSize]);

  return (
    <section
      className={`support_download_contents devices_product_downloads devices_product_downloads--center${
        empty ? " support_download_contents--no-data" : ""
      }`}
      id="support-download-contents"
    >
      <div className="inner">
        <div className="devices_product_downloads__body">
          <DevicesProductDownloadsFilter>
            <DevicesProductDownloadsFilterSection title="Product Category">
              {downloadProductCategories.map((option) => (
                <DevicesProductDownloadsCategoryFilterRow
                  key={option.id}
                  option={option}
                  idPrefix="dc-category"
                />
              ))}
            </DevicesProductDownloadsFilterSection>

            <DevicesProductDownloadsFilterSection
              title="Document Type"
              variant="document"
            >
              {downloadDocumentTypes.map((option) => (
                <DevicesProductDownloadsFilterCheckRow
                  key={option.id}
                  id={`dc-doc-${option.id}`}
                  label={option.label}
                  count={option.count}
                  defaultChecked={option.defaultChecked}
                />
              ))}
            </DevicesProductDownloadsFilterSection>
          </DevicesProductDownloadsFilter>

          <div className="devices_product_downloads__main">
          
            {!empty ? <DownloadCenterActiveFilters /> : null}
            <div className="devices_product_downloads__toolbar">
              <p className="devices_product_downloads__count">
                Total <strong>{resultCount.toLocaleString()}</strong>
              </p>
              {!empty ? 
              <div className="devices_product_downloads__search-row">
                <FormControl className="guide_field guide_field--w200">
                  <GuideSelect
                    defaultValue="Sort by"
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": "Sort by" }}
                    renderValue={(value) => (
                      <span className="guide_field__select-value" title={String(value)}>
                        {String(value)}
                      </span>
                    )}
                  >
                    <MenuItem value="Newest">Newest</MenuItem>
                    <MenuItem value="Oldest">Oldest</MenuItem>
                    <MenuItem value="Title A-Z">Title A-Z</MenuItem>
                  </GuideSelect>
                </FormControl>
              </div> : null}
            </div>

            {empty ? (
              <DownloadCenterEmpty />
            ) : (
              <>
            <div className="devices_product_downloads__list">
              {pageItems.map((item, index) => (
                <article
                  key={`${item.id}-${currentPage}-${index}`}
                  className="devices_product_downloads__item"
                >
                  <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
                    <div className="devices_product_downloads__item-head-main">
                      <div className="devices_product_downloads__item-head-meta">
                        <span className="devices_product_downloads__type">{item.type}</span>
                        <time
                          className="devices_product_downloads__date"
                          dateTime={item.date}
                        >
                          {item.date}
                        </time>
                      </div>
                      <div className="devices_product_downloads__item-head-title-row">
                        <h2 className="devices_product_downloads__item-tit">{item.title}</h2>
                        {item.versions && item.versions.length > 0 ? (
                          <div className="devices_product_downloads__item-version">
                            <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                              <GuideSelect
                                defaultValue={item.version}
                                IconComponent={GuideSelectIcon}
                                inputProps={{ "aria-label": `Version for ${item.title}` }}
                                renderValue={(value) => (
                                  <span
                                    className="guide_field__select-value"
                                    title={String(value)}
                                  >
                                    {String(value)}
                                  </span>
                                )}
                              >
                                {item.versions.map((version) => (
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
                              <span className="devices_product_downloads__pdf" aria-hidden>
                                <img
                                  src="/ico/ico_pdf_18.svg"
                                  alt=""
                                  width={18}
                                  height={18}
                                  loading="lazy"
                                  decoding="async"
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
                                className="devices_product_downloads__file-btn devices_product_downloads__file-btn--copy devices_product_downloads__file-btn--line"
                              >
                                Copy Link
                                <span
                                  className="devices_product_downloads__file-btn-icon"
                                  aria-hidden
                                />
                              </button>
                              <button
                                type="button"
                                className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
                              >
                                Download
                                <span
                                  className="devices_product_downloads__file-btn-icon"
                                  aria-hidden
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
              ariaLabel="Download Center pagination"
            />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
