"use client";

import SupportFilterPanel from "@/app/support/components/SupportFilterPanel";
import { useTechHubFilter, useTechHubQuery } from "./TechHubFilterProvider";

type TechHubFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function TechHubFilterPanel({
  variant = "sidebar",
}: TechHubFilterPanelProps) {
  const filter = useTechHubFilter();
  // 카테고리는 category-data fetch 결과(코드 기반 LV1>LV2 + 건수). Certification(secondary)은 이번 스코프 제외 → 미전달.
  const { categories } = useTechHubQuery();

  return (
    <SupportFilterPanel
      variant={variant}
      filter={filter}
      categories={categories}
      categoryIdPrefix="th-category"
    />
  );
}
