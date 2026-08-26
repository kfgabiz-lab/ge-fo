"use client";

import {
  downloadCenterPage,
  downloadCenterSortOptionsFor,
} from "@/data/support/downloadCenterContent";
import type { DownloadCenterSort } from "@/data/support/downloadCenterData";
import { useDownloadCenterQuery } from "./DownloadCenterFilterProvider";

type DownloadCenterMobileToolbarProps = {
  onFilterOpen: () => void;
};

export default function DownloadCenterMobileToolbar({
  onFilterOpen,
}: DownloadCenterMobileToolbarProps) {
  const { query, sort, setSort } = useDownloadCenterQuery();
  const sortOptions = downloadCenterSortOptionsFor(query.trim().length > 0);

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

      <div className="support_download_mo-toolbar__sort">
        <select
          className="support_download_mo-toolbar__sort-trigger"
          aria-label={downloadCenterPage.sortByLabel}
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as DownloadCenterSort);
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="support_download_mo-toolbar__sort-icon" aria-hidden>
          <img src="/ico/ico_down_16.svg" alt="" width={14} height={14} />
        </span>
      </div>
    </div>
  );
}
