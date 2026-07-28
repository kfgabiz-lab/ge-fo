"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import { searchPageTypes } from "@/data/search/searchPagesContent";
import { useSearchPagesFilter } from "./SearchPagesFilterProvider";

type SearchPagesFilterPanelProps = {
  variant?: "sidebar" | "modal";
  sidebarClassName?: string;
};

export default function SearchPagesFilterPanel({
  variant = "sidebar",
  sidebarClassName,
}: SearchPagesFilterPanelProps) {
  const { isChecked, toggleFilter, clearAll } = useSearchPagesFilter();

  const pageTypeSection = (
    <DevicesProductDownloadsFilterSection
      title="Document Type"
      variant={variant === "sidebar" ? "document" : undefined}
      compactHead={variant === "modal"}
      onRefresh={clearAll}
    >
      {searchPageTypes.map((option) => {
        const filterId = `search-page-type-${option.id}`;

        return (
          <DevicesProductDownloadsFilterCheckRow
            key={option.id}
            id={filterId}
            label={option.label}
            count={option.count}
            defaultChecked={option.defaultChecked}
            checked={isChecked(filterId)}
            onCheckedChange={(checked) => toggleFilter(filterId, checked)}
          />
        );
      })}
    </DevicesProductDownloadsFilterSection>
  );

  if (variant === "modal") {
    return (
      <div className="support_download_filter-modal__panel">{pageTypeSection}</div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={sidebarClassName}>
      {pageTypeSection}
    </DevicesProductDownloadsFilter>
  );
}
