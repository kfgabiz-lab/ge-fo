"use client";

import { useState } from "react";
import {
  downloadCenterActiveFilterDefaults,
  type DownloadActiveFilterChip,
} from "@/data/support/downloadCenterContent";

export default function DownloadCenterActiveFilters() {
  const [filters, setFilters] = useState<DownloadActiveFilterChip[]>(
    downloadCenterActiveFilterDefaults,
  );

  if (filters.length === 0) {
    return null;
  }

  const removeFilter = (id: string) => {
    setFilters((current) => current.filter((chip) => chip.id !== id));
  };

  const clearAll = () => {
    setFilters([]);
  };

  return (
    <div
      className="support_download_active-filters"
      role="region"
      aria-label="Active filters"
    >
      <ul className="support_download_active-filters__chips">
        {filters.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              className="support_download_active-filters__chip"
              aria-label={`Remove ${chip.group} ${chip.value} filter`}
              onClick={() => removeFilter(chip.id)}
            >
              <span className="support_download_active-filters__chip-text">
                {chip.group} : {chip.value}
              </span>
              <span className="support_download_active-filters__chip-icon" aria-hidden="true">
                <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="support_download_active-filters__clear"
        aria-label="Clear all filters"
        onClick={clearAll}
      >
        <span className="support_download_active-filters__clear-icon" aria-hidden>
          <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
        </span>
      </button>
    </div>
  );
}
