"use client";

import { useState } from "react";
import type { DownloadActiveFilterChip } from "@/data/support/downloadCenterContent";

type SearchTabActiveFiltersProps = {
  blockClass: "search_products" | "search_documents";
  defaultFilters: DownloadActiveFilterChip[];
};

export default function SearchTabActiveFilters({
  blockClass,
  defaultFilters,
}: SearchTabActiveFiltersProps) {
  const [filters, setFilters] = useState<DownloadActiveFilterChip[]>(defaultFilters);

  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className={`${blockClass}__active-filters`}
      role="region"
      aria-label="Active filters"
    >
      <ul className={`${blockClass}__active-filters-chips`}>
        {filters.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              className={`${blockClass}__active-filters-chip`}
              aria-label={`Remove ${chip.group} ${chip.value} filter`}
              onClick={() =>
                setFilters((current) => current.filter((item) => item.id !== chip.id))
              }
            >
              <span className={`${blockClass}__active-filters-chip-text`}>
                {chip.group} : {chip.value}
              </span>
              <span className={`${blockClass}__active-filters-chip-icon`} aria-hidden>
                <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${blockClass}__active-filters-clear`}
        aria-label="Clear all filters"
        onClick={() => setFilters([])}
      >
        <span className={`${blockClass}__active-filters-clear-icon`} aria-hidden>
          <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
        </span>
      </button>
    </div>
  );
}
