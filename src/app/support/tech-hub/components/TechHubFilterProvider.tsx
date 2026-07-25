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
import type { DownloadCategoryOption } from "@/data/support/downloadCenterContent";
import { fetchTechHubCategoryTree } from "@/data/support/techHubData";

// Tech Hub 필터 스토어 — 카테고리는 정적이 아니라 category-data fetch 결과를 Provider 에 동적 주입한다.
// Certification(secondary) 섹션은 이번 스코프 제외 → secondaryOptions 빈 배열(패널에서도 미전달).
const store = createSupportFilterStore({
  displayName: "TechHub",
  categoryIdPrefix: "th-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [], // 동적 주입(fetch), 정적 기본 없음
  secondaryIdPrefix: "th-cert",
  secondaryGroup: "Certification",
  secondarySection: "certification",
  secondaryOptions: [],
});

export const TechHubFilterBoundary = store.Boundary;
export const useTechHubFilter = store.useFilter;

// 검색어/페이지/동적 카테고리를 형제 컴포넌트(Search ↔ Contents ↔ FilterPanel)가 공유하기 위한 컨텍스트.
type TechHubQueryContextValue = {
  query: string;
  setQuery: (q: string) => void;
  page: number; // 1-based(UI PageNumbering 기준)
  setPage: (p: number) => void;
  categories: DownloadCategoryOption[]; // 아코디언 표시용(코드 + LV2별 count)
  categoriesLoaded: boolean;
};

const TechHubQueryContext = createContext<TechHubQueryContextValue | null>(null);

export function useTechHubQuery(): TechHubQueryContextValue {
  const ctx = useContext(TechHubQueryContext);
  if (!ctx) {
    throw new Error(
      "useTechHubQuery must be used within TechHubFilterProvider",
    );
  }
  return ctx;
}

export function TechHubFilterProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<DownloadCategoryOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    fetchTechHubCategoryTree()
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

  // 검색어 변경 시 항상 1페이지로.
  const setQuery = (q: string) => {
    setQueryState(q);
    setPage(1);
  };

  const queryValue = useMemo(
    () => ({ query, setQuery, page, setPage, categories, categoriesLoaded }),
    [query, page, categories, categoriesLoaded],
  );

  return (
    <TechHubQueryContext.Provider value={queryValue}>
      <store.Provider categories={categories}>{children}</store.Provider>
    </TechHubQueryContext.Provider>
  );
}
