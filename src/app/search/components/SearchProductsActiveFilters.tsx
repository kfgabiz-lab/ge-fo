"use client";

import { useSearchProductsFilter } from "./SearchProductsFilterProvider";
import SearchTabActiveFilters from "./SearchTabActiveFilters";

export default function SearchProductsActiveFilters() {
  const { activeChips, toggleFilter, clearAll } = useSearchProductsFilter();

  return (
    <SearchTabActiveFilters
      activeChips={activeChips}
      toggleFilter={toggleFilter}
      clearAll={clearAll}
    />
  );
}
