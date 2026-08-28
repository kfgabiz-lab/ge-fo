"use client";

import { TextField, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import DevicesProductDownloadsDocumentFilter from "./DevicesProductDownloadsDocumentFilter";
import { productDownloadsSortOptions } from "../../data/productDetailContent";
import type { DownloadCenterSort } from "@/data/support/downloadCenterData";

const MOBILE_MAX_WIDTH_QUERY = "(max-width: 780px)";

type DevicesProductDownloadsMobileControlsProps = {
  sort: DownloadCenterSort;
  onSortChange: (sort: DownloadCenterSort) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearch: () => void;
};

export default function DevicesProductDownloadsMobileControls({
  sort,
  onSortChange,
  keyword,
  onKeywordChange,
  onSearch,
}: DevicesProductDownloadsMobileControlsProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MAX_WIDTH_QUERY);

    const closeMobilePanels = () => {
      if (media.matches) return;

      setFilterOpen(false);
    };

    closeMobilePanels();
    media.addEventListener("change", closeMobilePanels);

    return () => media.removeEventListener("change", closeMobilePanels);
  }, []);

  return (
    <>
      <div className="devices_product_downloads__mo-controls">
        <TextField
          className="guide_field guide_field--search devices_product_downloads__mo-search"
          placeholder="keyword"
          aria-label="Search downloads"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
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
                    onClick={onSearch}
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

        <div className="devices_product_downloads__mo-toolbar">
          <div className="devices_product_downloads__mo-sort">
            <select
              className="devices_product_downloads__mo-sort-trigger"
              aria-label="Sort by"
              value={sort}
              onChange={(event) => {
                onSortChange(event.target.value as DownloadCenterSort);
              }}
            >
              {productDownloadsSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="devices_product_downloads__mo-sort-icon" aria-hidden>
              <img src="/ico/ico_down_16.svg" alt="" width={14} height={14} />
            </span>
          </div>

          <button
            type="button"
            className="devices_product_downloads__mo-filter"
            onClick={() => setFilterOpen(true)}
          >
            <span className="devices_product_downloads__mo-filter-label">
              Filter by
            </span>
            <span className="devices_product_downloads__mo-filter-icon" aria-hidden>
              <img src="/ico/ico_filter_14.svg" alt="" width={14} height={14} />
            </span>
          </button>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <div className="support_download_filter-modal__panel">
          <DevicesProductDownloadsDocumentFilter compactHead />
        </div>
      </SupportFilterModal>
    </>
  );
}
