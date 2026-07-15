"use client";

import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import {
  techHubCertifications,
  techHubProductCategories,
} from "@/data/support/techHubContent";

// Tech Hub 필터 스토어 (공통 팩토리 주입 설정)
const store = createSupportFilterStore({
  displayName: "TechHub",
  categoryIdPrefix: "th-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: techHubProductCategories,
  secondaryIdPrefix: "th-cert",
  secondaryGroup: "Certification",
  secondarySection: "certification",
  secondaryOptions: techHubCertifications,
});

export const TechHubFilterProvider = store.Provider;
export const TechHubFilterBoundary = store.Boundary;
export const useTechHubFilter = store.useFilter;
