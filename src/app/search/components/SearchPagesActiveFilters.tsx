"use client";

import { useSearchPagesFilter } from "./SearchPagesFilterProvider";
import SearchTabActiveFilters from "./SearchTabActiveFilters";

export default function SearchPagesActiveFilters() {
  const { activeChips, toggleFilter, clearAll } = useSearchPagesFilter();

  return (
    <SearchTabActiveFilters
      activeChips={activeChips}
      toggleFilter={toggleFilter}
      clearAll={clearAll}
    />
  );
}
