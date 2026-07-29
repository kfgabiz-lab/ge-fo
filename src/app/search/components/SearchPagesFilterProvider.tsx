"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import { searchPageTypes } from "@/data/search/searchPagesContent";

const store = createSupportFilterStore({
  displayName: "SearchPages",
  categoryIdPrefix: "search-page-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-page-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: searchPageTypes,
});

export const SearchPagesFilterProvider = store.Provider;
export const useSearchPagesFilter = store.useFilter;
