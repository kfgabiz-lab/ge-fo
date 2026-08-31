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
import SupportDownloadFilterOptionsLoader from "@/app/support/components/SupportDownloadFilterOptionsLoader";
import {
  type DownloadCategoryOption,
  type DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import {
  type DownloadCenterContentsPage,
  type DownloadCenterSort,
} from "@/data/support/downloadCenterData";
import { fetchPopularKeywords } from "@/data/search/searchKeywordData";

const store = createSupportFilterStore({
  displayName: "DownloadCenter",
  categoryIdPrefix: "dc-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "dc-doc",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: [],
});

export const DownloadCenterFilterBoundary = store.Boundary;
export const useDownloadCenterFilter = store.useFilter;

type DownloadCenterQueryContextValue = {
  query: string;
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  sort: DownloadCenterSort;
  setSort: (s: DownloadCenterSort) => void;
  categories: DownloadCategoryOption[];
  categoriesLoaded: boolean;
  documentTypes: DownloadFilterOption[];
  popularKeywords: string[];
  initialContents?: DownloadCenterContentsPage;
};

const DownloadCenterQueryContext =
  createContext<DownloadCenterQueryContextValue | null>(null);

export function useDownloadCenterQuery(): DownloadCenterQueryContextValue {
  const ctx = useContext(DownloadCenterQueryContext);
  if (!ctx) {
    throw new Error(
      "useDownloadCenterQuery must be used within DownloadCenterFilterProvider",
    );
  }
  return ctx;
}

export function DownloadCenterFilterProvider({
  children,
  initialContents,
}: {
  children: ReactNode;
  initialContents?: DownloadCenterContentsPage;
}) {
  const [categories, setCategories] = useState<DownloadCategoryOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DownloadFilterOption[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState<DownloadCenterSort>("newest");

  useEffect(() => {
    let alive = true;
    fetchPopularKeywords("DOWNLOAD_CENTER").then((keywords) => {
      if (!alive) return;
      setPopularKeywords(keywords);
    });
    return () => {
      alive = false;
    };
  }, []);

  const setQuery = (q: string) => {
    const hadKeyword = query.trim().length > 0;
    const hasKeyword = q.trim().length > 0;
    setQueryState(q);
    setPage(1);
    if (hasKeyword) {
      if (!hadKeyword) setSortState("relevance");
    } else {
      setSortState("");
    }
  };
  const setSort = (s: DownloadCenterSort) => {
    setSortState(s);
    setPage(1);
  };

  const queryValue = useMemo(
    () => ({
      query,
      setQuery,
      page,
      setPage,
      sort,
      setSort,
      categories,
      categoriesLoaded,
      documentTypes,
      popularKeywords,
      initialContents,
    }),
    [
      query,
      page,
      sort,
      categories,
      categoriesLoaded,
      documentTypes,
      popularKeywords,
      initialContents,
    ],
  );

  return (
    <DownloadCenterQueryContext.Provider value={queryValue}>
      <store.Provider categories={categories} secondaryOptions={documentTypes}>
        <SupportDownloadFilterOptionsLoader
          query={query}
          includeFileContent
          onCategoriesChange={setCategories}
          onDocumentTypesChange={setDocumentTypes}
          onCategoriesLoadedChange={setCategoriesLoaded}
        />
        {children}
      </store.Provider>
    </DownloadCenterQueryContext.Provider>
  );
}
