"use client";

import SupportFilterPanel from "@/app/support/components/SupportFilterPanel";
import {
  useDownloadCenterFilter,
  useDownloadCenterQuery,
} from "./DownloadCenterFilterProvider";

type DownloadCenterFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function DownloadCenterFilterPanel({
  variant = "sidebar",
}: DownloadCenterFilterPanelProps) {
  const filter = useDownloadCenterFilter();
  // 카테고리는 category-data fetch 결과(코드 기반 LV1>LV2 + 건수). Document Type(secondary)은 doctype-counts 실카운트 반영.
  const { categories, documentTypes } = useDownloadCenterQuery();

  return (
    <SupportFilterPanel
      variant={variant}
      filter={filter}
      categories={categories}
      categoryIdPrefix="dc-category"
      secondaryTitle="Document Type"
      secondaryVariant="document"
      secondaryIdPrefix="dc-doc"
      secondarySection="document"
      secondaryOptions={documentTypes}
    />
  );
}
