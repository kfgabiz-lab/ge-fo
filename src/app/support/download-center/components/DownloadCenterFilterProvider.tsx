"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import {
  downloadDocumentTypes,
  downloadProductCategories,
} from "@/data/support/downloadCenterContent";

// Download Center 필터 스토어 (공통 팩토리 주입 설정)
const store = createSupportFilterStore({
  displayName: "DownloadCenter",
  categoryIdPrefix: "dc-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: downloadProductCategories,
  secondaryIdPrefix: "dc-doc",
  secondaryGroup: "Types",
  secondarySection: "document",
  secondaryOptions: downloadDocumentTypes,
});

export const DownloadCenterFilterProvider = store.Provider;
export const DownloadCenterFilterBoundary = store.Boundary;
export const useDownloadCenterFilter = store.useFilter;
