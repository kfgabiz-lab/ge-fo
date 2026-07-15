"use client";

import { useDownloadCenterFilter } from "./DownloadCenterFilterProvider";

export default function DownloadCenterActiveFilters() {
  const { activeChips, toggleFilter, clearAll } = useDownloadCenterFilter();

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <div
      className="support_download_active-filters"
      role="region"
      aria-label="Active filters"
    >
      <ul className="support_download_active-filters__chips">
        {activeChips.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              className="support_download_active-filters__chip"
              aria-label={`Remove ${chip.group} ${chip.value} filter`}
              onClick={() => toggleFilter(chip.id, false)}
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
