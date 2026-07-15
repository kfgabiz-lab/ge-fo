"use client";

import SupportFilterPanel from "@/app/support/components/SupportFilterPanel";
import {
  downloadDocumentTypes,
  downloadProductCategories,
} from "@/data/support/downloadCenterContent";
import { useDownloadCenterFilter } from "./DownloadCenterFilterProvider";

type DownloadCenterFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function DownloadCenterFilterPanel({
  variant = "sidebar",
}: DownloadCenterFilterPanelProps) {
  const filter = useDownloadCenterFilter();

  return (
    <SupportFilterPanel
      variant={variant}
      filter={filter}
      categories={downloadProductCategories}
      categoryIdPrefix="dc-category"
      secondaryTitle="Document Type"
      secondaryVariant="document"
      secondaryIdPrefix="dc-doc"
      secondarySection="document"
      secondaryOptions={downloadDocumentTypes}
    />
  );
}
