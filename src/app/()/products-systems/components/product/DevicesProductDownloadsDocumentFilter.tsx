"use client";

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
  const { isChecked, toggleFilter, clearSection, documentTypes } =
    useDevicesProductDownloadsFilter();

  return (
    <DevicesProductDownloadsFilterSection
      title="Document type"
      variant="document"
      compactHead={compactHead}
      onRefresh={clearSection}
    >
      {documentTypes.map((option) => {
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
