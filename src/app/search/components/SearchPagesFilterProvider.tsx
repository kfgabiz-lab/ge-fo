"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import { searchPageTypes } from "@/data/search/searchPagesContent";

/**
 * Search - Pages 탭 필터 스토어.
 * 카테고리 없이 문서유형(평면) 한 섹션만 사용 → 공통 팩토리 createSupportFilterStore 에
 * categories 를 비우고 secondary(문서유형) 만 구성한다(로직 중복 제거).
 * secondaryOptions(searchPageTypes)는 분류 4종 단일 정의(SEARCH_PAGE_SECTIONS)에서 파생되며,
 * 선택값은 getSelectedCategoryValues("document") 로 읽어 page-search 의 sections 파라미터로 전달된다.
 */
const store = createSupportFilterStore({
  displayName: "SearchPages",
  categoryIdPrefix: "search-page-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-page-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: searchPageTypes,
});

export const SearchPagesFilterProvider = store.Provider;
export const useSearchPagesFilter = store.useFilter;
