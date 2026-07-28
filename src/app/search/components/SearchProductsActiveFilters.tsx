"use client";

import { useSearchProductsFilter } from "./SearchProductsFilterProvider";

export default function SearchProductsActiveFilters() {
  const { activeChips, toggleFilter, clearAll } = useSearchProductsFilter();

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <div
      className="search_products__active-filters"
      role="region"
      aria-label="Active filters"
    >
      <ul className="search_products__active-filters-chips">
        {activeChips.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              className="search_products__active-filters-chip"
              aria-label={`Remove ${chip.group} ${chip.value} filter`}
              onClick={() => toggleFilter(chip.id, false)}
            >
              <span className="search_products__active-filters-chip-text">
                <span className="search_products__active-filters-chip-group">
                  {chip.group} :{" "}
                </span>
                <span className="search_products__active-filters-chip-value">
                  {chip.value}
                </span>
              </span>
              <span className="search_products__active-filters-chip-icon" aria-hidden>
                <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="search_products__active-filters-clear"
        aria-label="Clear all filters"
        onClick={clearAll}
      >
        <span className="search_products__active-filters-clear-icon" aria-hidden>
          <img src="/ico/ico_clear_12.svg" alt="" width={12} height={12} />
        </span>
      </button>
    </div>
  );
}
