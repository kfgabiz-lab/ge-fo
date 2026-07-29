"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import {
  searchDocumentCategories,
  searchDocumentTypes,
} from "@/data/search/searchDocumentsContent";

const store = createSupportFilterStore({
  displayName: "SearchDocuments",
  categoryIdPrefix: "search-document-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: searchDocumentCategories,
  secondaryIdPrefix: "search-document-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: searchDocumentTypes,
  extraDefaultCheckedIds: [
    "search-document-category-mccb-susol-ul",
    "search-document-type-catalogs",
    "search-document-type-manuals",
  ],
});

export const SearchDocumentsFilterProvider = store.Provider;
export const useSearchDocumentsFilter = store.useFilter;
