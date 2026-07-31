"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import {
  type DownloadCategoryOption,
  type DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import {
  fetchDownloadCenterCategoryTree,
  fetchDownloadDocTypeFilters,
} from "@/data/support/downloadCenterData";

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

  useEffect(() => {
    let alive = true;
    fetchDownloadCenterCategoryTree().then((tree) => {
      if (alive) setCategories(tree);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetchDownloadDocTypeFilters().then((options) => {
      if (!alive) return;
      setDocumentTypes(options);
    });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(
    () => ({ categories, documentTypes }),
    [categories, documentTypes],
  );

  return (
    <SearchDocumentsFilterOptionsContext.Provider value={value}>
      <store.Provider categories={categories} secondaryOptions={documentTypes}>
        {children}
      </store.Provider>
    </SearchDocumentsFilterOptionsContext.Provider>
  );
}
