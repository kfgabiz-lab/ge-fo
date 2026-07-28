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
  type DownloadCenterSort,
} from "@/data/support/downloadCenterData";
import { fetchPopularKeywords } from "@/data/search/searchKeywordData";

const DOC_TYPE_API_CODES = new Set<string>(downloadDocTypeCodes);

const DOC_TYPES_PENDING: DownloadFilterOption[] = downloadDocumentTypes.map(
  (opt) =>
    DOC_TYPE_API_CODES.has(opt.id) ? { ...opt, count: undefined } : opt,
);

const store = createSupportFilterStore({
  displayName: "DownloadCenter",
  categoryIdPrefix: "dc-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "dc-doc",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: downloadDocumentTypes,
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
}: {
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<DownloadCategoryOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [documentTypes, setDocumentTypes] =
    useState<DownloadFilterOption[]>(DOC_TYPES_PENDING);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState<DownloadCenterSort>("");

  useEffect(() => {
    let alive = true;
    fetchDownloadCenterCategoryTree()
      .then((tree) => {
        if (!alive) return;
        setCategories(tree);
      })
      .finally(() => {
        if (alive) setCategoriesLoaded(true);
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
    setQueryState(q);
    setPage(1);
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
    }),
    [
      query,
      page,
      sort,
      categories,
      categoriesLoaded,
      documentTypes,
      popularKeywords,
    ],
  );

  return (
    <DownloadCenterQueryContext.Provider value={queryValue}>
      <store.Provider categories={categories}>{children}</store.Provider>
    </DownloadCenterQueryContext.Provider>
  );
}
