"use client";

import { useEffect, useRef, useState } from "react";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";

type DownloadCenterMobileToolbarProps = {
  onFilterOpen: () => void;
};

export default function DownloadCenterMobileToolbar({
  onFilterOpen,
}: DownloadCenterMobileToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState<
    (typeof downloadCenterPage.mobileSortOptions)[number]
  >(downloadCenterPage.mobileSortDefault);
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
          onClick={() => setSortOpen((open) => !open)}
        >
          <span className="support_download_mo-toolbar__sort-label">
            {sortOpen ? downloadCenterPage.sortByLabel : sortValue}
          </span>
          <span className="support_download_mo-toolbar__sort-icon" aria-hidden>
            <img src="/ico/ico_down_16.svg" alt="" width={14} height={14} />
          </span>
        </button>

        {sortOpen ? (
          <ul className="support_download_mo-toolbar__sort-list" role="listbox">
            {downloadCenterPage.mobileSortOptions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  className={`support_download_mo-toolbar__sort-option${
                    sortValue === option
                      ? " support_download_mo-toolbar__sort-option--active"
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
    </div>
  );
}
