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
