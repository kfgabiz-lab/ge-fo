"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import { searchMediaTypes } from "@/data/search/searchMediaContent";

/**
 * Search - Media 탭 필터 스토어.
 * 카테고리 없이 문서유형(평면) 한 섹션만 사용 → 공통 팩토리 createSupportFilterStore 에
 * categories 를 비우고 secondary(문서유형) 만 구성한다(로직 중복 제거).
 */
const store = createSupportFilterStore({
  displayName: "SearchMedia",
  categoryIdPrefix: "search-media-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "search-media-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: searchMediaTypes,
});

export const SearchMediaFilterProvider = store.Provider;
export const useSearchMediaFilter = store.useFilter;
