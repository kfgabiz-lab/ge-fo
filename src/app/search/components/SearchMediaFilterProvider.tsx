"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import { searchMediaTypes } from "@/data/search/searchMediaContent";

const store = createSupportFilterStore({
  displayName: "SearchMedia",
  categoryIdPrefix: "search-media-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-media-type",
  secondaryGroup: "Menu",
  secondarySection: "document",
  secondaryOptions: searchMediaTypes,
});

export const SearchMediaFilterProvider = store.Provider;
export const useSearchMediaFilter = store.useFilter;
