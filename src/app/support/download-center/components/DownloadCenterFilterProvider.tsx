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

// doctype-counts API 로 실카운트를 채우는 대상 코드(C/M/D/S/R/O).
const DOC_TYPE_API_CODES = new Set<string>(downloadDocTypeCodes);

// 실카운트 도착 전 초기 상태 — API 대상 코드는 배지 미표시(count undefined).
// (STEP5 이전 목업 100 이 잠깐 노출되는 것을 막는다.)
const DOC_TYPES_PENDING: DownloadFilterOption[] = downloadDocumentTypes.map(
  (opt) =>
    DOC_TYPE_API_CODES.has(opt.id) ? { ...opt, count: undefined } : opt,
);

// Download Center 필터 스토어 — 카테고리는 정적이 아니라 category-data fetch 결과를 Provider 에 동적 주입한다(Tech Hub 와 동일 사상).
// Document Type(secondary) 은 정적 옵션 유지(option.id = BE docType 코드).
const store = createSupportFilterStore({
  displayName: "DownloadCenter",
  categoryIdPrefix: "dc-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [], // 동적 주입(fetch), 정적 기본 없음
  secondaryIdPrefix: "dc-doc",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: downloadDocumentTypes,
});

export const DownloadCenterFilterBoundary = store.Boundary;
export const useDownloadCenterFilter = store.useFilter;

// 검색어/페이지/정렬/동적 카테고리를 형제 컴포넌트(Search ↔ Contents ↔ FilterPanel)가 공유하기 위한 컨텍스트.
type DownloadCenterQueryContextValue = {
  query: string;
  setQuery: (q: string) => void;
  page: number; // 1-based(UI PageNumbering 기준)
  setPage: (p: number) => void;
  sort: DownloadCenterSort; // "" = 미지정(BE 기본 newest)
  setSort: (s: DownloadCenterSort) => void;
  categories: DownloadCategoryOption[]; // 아코디언 표시용(코드 + LV2별 count)
  categoriesLoaded: boolean;
  documentTypes: DownloadFilterOption[]; // 문서유형 옵션(옆 건수 배지 = doctype-counts 실카운트)
  popularKeywords: string[]; // 인기 검색어(source=DOWNLOAD_CENTER). 폴백 없음 — 빈 배열이면 태그 영역 미노출.
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

  // 문서유형 옆 건수 배지 = doctype-counts 실카운트 병합(코드 기준). 응답에 없는 코드는 정적 count 유지.
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

  // 인기 검색어(Popular Keywords) — Download Center 자체 검색 랭킹(source=DOWNLOAD_CENTER).
  // 실패/미집계 시 빈 배열 그대로 유지 — 폴백 없음(표시 시점에 태그 영역 미노출, DownloadCenterSearch).
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

  // 검색어/정렬 변경 시 항상 1페이지로.
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
