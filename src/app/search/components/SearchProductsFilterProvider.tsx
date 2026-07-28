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
import { searchProductDocumentTypes } from "@/data/search/searchProductsContent";
import { fetchSearchProductCategoryTree } from "@/data/search/searchAllProductsData";

/**
 * Search - Products 탭 필터 스토어.
 * - 카테고리(중첩)는 정적이 아니라 devices-tree 기반 트리(fetchSearchProductCategoryTree)를 Provider 에 동적 주입.
 *   → 리프(Lv2) optionId = category-data row_id 문자열이며 이 값이 API categories 로 전송됨(Tech Hub 동적 주입 패턴).
 * - 문서유형(secondary)은 기존 정적 유지(BE 제품검색은 문서유형 파라미터 없음 — UI 필터로만 존재).
 * - 카테고리(중첩) + 문서유형(평면) 구조가 동일하여 공통 팩토리 createSupportFilterStore 재사용.
 */
const store = createSupportFilterStore({
  displayName: "SearchProducts",
  categoryIdPrefix: "search-product-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [], // 동적 주입(devices-tree), 정적 기본 없음
  secondaryIdPrefix: "search-product-doc",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: searchProductDocumentTypes,
});

export const useSearchProductsFilter = store.useFilter;

// 필터 패널이 아코디언을 그릴 때 쓰는 동적 카테고리 트리를 형제 컴포넌트에 공유.
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

  useEffect(() => {
    let alive = true;
    fetchSearchProductCategoryTree().then((tree) => {
      if (alive) setCategories(tree);
    });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ categories }), [categories]);

  return (
    <SearchProductsCategoryContext.Provider value={value}>
      <store.Provider categories={categories}>{children}</store.Provider>
    </SearchProductsCategoryContext.Provider>
  );
}
