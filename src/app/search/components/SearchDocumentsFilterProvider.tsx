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
  applyCategoryCounts,
  buildDocTypeFilters,
  deriveCategoryCountsFromItems,
  deriveDocTypeCountsFromItems,
  fetchDownloadCenterBaseCategoryTree,
  fetchDownloadDocTypes,
  toCategoryCountMaps,
  toDocTypeCountMap,
  type DownloadCenterItem,
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
  items,
  children,
}: {
  items: DownloadCenterItem[];
  children: ReactNode;
}) {
  const [baseCategories, setBaseCategories] = useState<DownloadCategoryOption[]>(
    [],
  );
  const [docTypeCodes, setDocTypeCodes] = useState<DownloadFilterOption[]>([]);

  useEffect(() => {
    let alive = true;
    void Promise.all([
      fetchDownloadCenterBaseCategoryTree(),
      fetchDownloadDocTypes(),
    ]).then(([tree, codes]) => {
      if (!alive) return;
      setBaseCategories(tree);
      setDocTypeCodes(codes);
    });
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const { l1CountMap, l2CountMap } = toCategoryCountMaps(
      deriveCategoryCountsFromItems(items),
    );
    return applyCategoryCounts(baseCategories, l1CountMap, l2CountMap);
  }, [baseCategories, items]);

  const documentTypes = useMemo(
    () =>
      buildDocTypeFilters(
        docTypeCodes,
        toDocTypeCountMap(deriveDocTypeCountsFromItems(items)),
        0,
      ),
    [docTypeCodes, items],
  );

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
