"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";
import { fetchSearchProductCategoryTree } from "@/data/search/searchAllProductsData";

const store = createSupportFilterStore({
  displayName: "SearchProducts",
  categoryIdPrefix: "search-product-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-product-doc",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: [],
});

export const useSearchProductsFilter = store.useFilter;

type SearchProductsCategoryContextValue = {
  categories: DownloadCategoryOption[];
};

const SearchProductsCategoryContext =
  createContext<SearchProductsCategoryContextValue | null>(null);

export function useSearchProductsCategories(): SearchProductsCategoryContextValue {
  const ctx = useContext(SearchProductsCategoryContext);
  if (!ctx) {
    throw new Error(
      "useSearchProductsCategories must be used within SearchProductsFilterProvider",
    );
  }
  return ctx;
}

export function SearchProductsFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<DownloadCategoryOption[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    let alive = true;
    fetchSearchProductCategoryTree(query).then((tree) => {
      if (alive) setCategories(tree);
    });
    return () => {
      alive = false;
    };
  }, [query]);

  const value = useMemo(() => ({ categories }), [categories]);

  return (
    <SearchProductsCategoryContext.Provider value={value}>
      <store.Provider categories={categories}>{children}</store.Provider>
    </SearchProductsCategoryContext.Provider>
  );
}
