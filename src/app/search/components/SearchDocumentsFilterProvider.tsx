"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import SupportDownloadFilterOptionsLoader from "@/app/support/components/SupportDownloadFilterOptionsLoader";
import {
  type DownloadCategoryOption,
  type DownloadFilterOption,
} from "@/data/support/downloadCenterContent";

const store = createSupportFilterStore({
  displayName: "SearchDocuments",
  categoryIdPrefix: "search-document-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-document-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: [],
});

export const useSearchDocumentsFilter = store.useFilter;

type SearchDocumentsFilterOptionsValue = {
  categories: DownloadCategoryOption[];
  documentTypes: DownloadFilterOption[];
};

const SearchDocumentsFilterOptionsContext =
  createContext<SearchDocumentsFilterOptionsValue | null>(null);

export function useSearchDocumentsFilterOptions(): SearchDocumentsFilterOptionsValue {
  const ctx = useContext(SearchDocumentsFilterOptionsContext);
  if (!ctx) {
    throw new Error(
      "useSearchDocumentsFilterOptions must be used within SearchDocumentsFilterProvider",
    );
  }
  return ctx;
}

export function SearchDocumentsFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<DownloadCategoryOption[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DownloadFilterOption[]>([]);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const value = useMemo(
    () => ({ categories, documentTypes }),
    [categories, documentTypes],
  );

  return (
    <SearchDocumentsFilterOptionsContext.Provider value={value}>
      <store.Provider categories={categories} secondaryOptions={documentTypes}>
        <SupportDownloadFilterOptionsLoader
          useFilter={useSearchDocumentsFilter}
          query={query}
          onCategoriesChange={setCategories}
          onDocumentTypesChange={setDocumentTypes}
        />
        {children}
      </store.Provider>
    </SearchDocumentsFilterOptionsContext.Provider>
  );
}
