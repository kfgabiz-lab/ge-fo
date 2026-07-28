"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import {
  searchDocumentCategories,
  searchDocumentTypes,
} from "@/data/search/searchDocumentsContent";

/**
 * Search - Documents 탭 필터 스토어.
 * 카테고리(중첩) + 문서유형(평면) 구조가 Download Center / Products 다운로드와 동일하여
 * 공통 팩토리 createSupportFilterStore 를 재사용한다(로직 중복 제거).
 * Figma 6571:104998 기본 활성 필터는 공유 정적 데이터라 defaultChecked 로 못 넣어 extraDefaultCheckedIds 로 주입.
 */
const store = createSupportFilterStore({
  displayName: "SearchDocuments",
  categoryIdPrefix: "search-document-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: searchDocumentCategories,
  secondaryIdPrefix: "search-document-type",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: searchDocumentTypes,
  extraDefaultCheckedIds: [
    "search-document-category-mccb-susol-ul",
    "search-document-type-catalogs",
    "search-document-type-manuals",
  ],
});

export const SearchDocumentsFilterProvider = store.Provider;
export const useSearchDocumentsFilter = store.useFilter;
