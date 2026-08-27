"use client";

import { useEffect, useRef, useState } from "react";
import {
  downloadCenterPage,
  downloadCenterSortLabel,
  downloadCenterSortOptionsFor,
} from "@/data/support/downloadCenterContent";
import { useDownloadCenterQuery } from "./DownloadCenterFilterProvider";

type DownloadCenterMobileToolbarProps = {
  onFilterOpen: () => void;
};

export default function DownloadCenterMobileToolbar({
  onFilterOpen,
}: DownloadCenterMobileToolbarProps) {
  const { query, sort, setSort } = useDownloadCenterQuery();
  const sortOptions = downloadCenterSortOptionsFor(query.trim().length > 0);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

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
    <div className="support_download_mo-toolbar">
      <button
        type="button"
        className="support_download_mo-toolbar__filter"
        onClick={onFilterOpen}
      >
        <span className="support_download_mo-toolbar__filter-label">
          {downloadCenterPage.filterByLabel}
        </span>
        <span className="support_download_mo-toolbar__filter-icon" aria-hidden>
          <img src="/ico/ico_filter_14.svg" alt="" width={14} height={14} />
        </span>
      </button>

      <div
        ref={sortRef}
        className={`support_download_mo-toolbar__sort${
          sortOpen ? " support_download_mo-toolbar__sort--open" : ""
        }`}
      >
        <button
          type="button"
          className="support_download_mo-toolbar__sort-trigger"
          aria-expanded={sortOpen}
          aria-haspopup="listbox"
          aria-controls="download-center-sort-listbox"
          aria-label={downloadCenterPage.sortByLabel}
          onClick={() => setSortOpen((open) => !open)}
        >
          <span className="support_download_mo-toolbar__sort-label">
            {sortOpen ? downloadCenterPage.sortByLabel : downloadCenterSortLabel(sort)}
          </span>
          <span className="support_download_mo-toolbar__sort-icon" aria-hidden>
            <img src="/ico/ico_down_16.svg" alt="" width={14} height={14} />
          </span>
        </button>

        {sortOpen ? (
          <ul
            id="download-center-sort-listbox"
            className="support_download_mo-toolbar__sort-list"
            role="listbox"
            aria-label={downloadCenterPage.sortByLabel}
          >
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`support_download_mo-toolbar__sort-option${
                    sort === option.value
                      ? " support_download_mo-toolbar__sort-option--active"
                      : ""
                  }`}
                  role="option"
                  aria-selected={sort === option.value}
                  onClick={() => {
                    setSort(option.value);
                    setSortOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
