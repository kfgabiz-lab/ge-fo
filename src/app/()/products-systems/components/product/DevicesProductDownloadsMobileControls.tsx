"use client";

import { TextField, InputAdornment } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import DevicesProductDownloadsDocumentFilter from "./DevicesProductDownloadsDocumentFilter";

const SORT_OPTIONS = ["Most Recent", "A to Z", "Z to A"] as const;
const MOBILE_MAX_WIDTH_QUERY = "(max-width: 780px)";

export default function DevicesProductDownloadsMobileControls() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState<(typeof SORT_OPTIONS)[number]>(
    SORT_OPTIONS[0],
  );
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MAX_WIDTH_QUERY);

    const closeMobilePanels = () => {
      if (media.matches) return;

      setFilterOpen(false);
      setSortOpen(false);
    };

    closeMobilePanels();
    media.addEventListener("change", closeMobilePanels);

    return () => media.removeEventListener("change", closeMobilePanels);
  }, []);

  useEffect(() => {
    if (!sortOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [sortOpen]);

  return (
    <>
      <div className="devices_product_downloads__mo-controls">
        <TextField
          className="guide_field guide_field--search devices_product_downloads__mo-search"
          placeholder="key word"
          aria-label="Search downloads"
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

        <div className="devices_product_downloads__mo-toolbar">
          <div
            ref={sortRef}
            className={`devices_product_downloads__mo-sort${
              sortOpen ? " devices_product_downloads__mo-sort--open" : ""
            }`}
          >
            <button
              type="button"
              className="devices_product_downloads__mo-sort-trigger"
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
              onClick={() => setSortOpen((open) => !open)}
            >
              <span className="devices_product_downloads__mo-sort-label">
                {sortOpen ? "Sort by" : sortValue}
              </span>
              <span className="devices_product_downloads__mo-sort-icon" aria-hidden>
                <img src="/ico/ico_down_16.svg" alt="" width={14} height={14} />
              </span>
            </button>

            {sortOpen ? (
              <ul
                className="devices_product_downloads__mo-sort-list"
                role="listbox"
              >
                {SORT_OPTIONS.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      className={`devices_product_downloads__mo-sort-option${
                        sortValue === option
                          ? " devices_product_downloads__mo-sort-option--active"
                          : ""
                      }`}
                      role="option"
                      aria-selected={sortValue === option}
                      onClick={() => {
                        setSortValue(option);
                        setSortOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
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
