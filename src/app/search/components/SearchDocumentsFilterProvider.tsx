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
  downloadDocTypeCodes,
  downloadDocumentTypes,
  type DownloadCategoryOption,
  type DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import {
  fetchDownloadCenterCategoryTree,
  fetchDownloadCenterDocTypeCounts,
} from "@/data/support/downloadCenterData";

const DOC_TYPE_API_CODES = new Set<string>(downloadDocTypeCodes);

const DOC_TYPES_PENDING: DownloadFilterOption[] = downloadDocumentTypes.map(
  (opt) => (DOC_TYPE_API_CODES.has(opt.id) ? { ...opt, count: undefined } : opt),
);

const store = createSupportFilterStore({
  displayName: "SearchDocuments",
  categoryIdPrefix: "search-document-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-document-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: downloadDocumentTypes,
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
  const [documentTypes, setDocumentTypes] =
    useState<DownloadFilterOption[]>(DOC_TYPES_PENDING);

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
    fetchDownloadCenterDocTypeCounts().then((counts) => {
      if (!alive) return;
      const countMap = new Map(counts.map((c) => [c.docType, c.count]));
      setDocumentTypes(
        downloadDocumentTypes.map((opt) =>
          countMap.has(opt.id) ? { ...opt, count: countMap.get(opt.id) } : opt,
        ),
      );
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
      <store.Provider categories={categories}>{children}</store.Provider>
    </SearchDocumentsFilterOptionsContext.Provider>
  );
}
