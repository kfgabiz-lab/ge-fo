"use client";

import { downloadDocumentTypes } from "@/data/support/downloadCenterContent";
import {
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "./DevicesProductDownloadsFilterParts";
import {
  getDevicesProductDownloadsFilterId,
  useDevicesProductDownloadsFilter,
} from "./DevicesProductDownloadsFilterProvider";

type DevicesProductDownloadsDocumentFilterProps = {
  compactHead?: boolean;
};

export default function DevicesProductDownloadsDocumentFilter({
  compactHead = false,
}: DevicesProductDownloadsDocumentFilterProps) {
  const { isChecked, toggleFilter, clearSection } = useDevicesProductDownloadsFilter();

  return (
    <DevicesProductDownloadsFilterSection
      title="Document type"
      variant="document"
      compactHead={compactHead}
      onRefresh={clearSection}
    >
      {downloadDocumentTypes.map((option) => {
        const filterId = getDevicesProductDownloadsFilterId(option.id);

        return (
          <DevicesProductDownloadsFilterCheckRow
            key={option.id}
            id={filterId}
            label={option.label}
            count={option.count}
            checked={isChecked(filterId)}
            onCheckedChange={(checked) => toggleFilter(filterId, checked)}
          />
        );
      })}
    </DevicesProductDownloadsFilterSection>
  );
}
