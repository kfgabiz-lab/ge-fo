"use client";

import { useSearchMediaFilter } from "./SearchMediaFilterProvider";
import SearchTabActiveFilters from "./SearchTabActiveFilters";

export default function SearchMediaActiveFilters() {
  const { activeChips, toggleFilter, clearAll } = useSearchMediaFilter();

  return (
    <SearchTabActiveFilters
      activeChips={activeChips}
      toggleFilter={toggleFilter}
      clearAll={clearAll}
    />
  );
}
