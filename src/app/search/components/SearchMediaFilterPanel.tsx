"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import { searchMediaTypes } from "@/data/search/searchMediaContent";
import { useSearchMediaFilter } from "./SearchMediaFilterProvider";

type SearchMediaFilterPanelProps = {
  variant?: "sidebar" | "modal";
  sidebarClassName?: string;
  /**
   * 소스별 검색 건수(필터 옵션 id 기준). 검색 응답 sourceCounts 에서 만들어 주입한다.
   * 미지정(최초 로딩 전)이면 count 표기를 생략한다.
   */
  counts?: Record<string, number>;
};

export default function SearchMediaFilterPanel({
  variant = "sidebar",
  sidebarClassName,
  counts,
}: SearchMediaFilterPanelProps) {
  const { isChecked, toggleFilter, clearAll } = useSearchMediaFilter();

  const mediaTypeSection = (
    <DevicesProductDownloadsFilterSection
      title="Document Type"
      variant={variant === "sidebar" ? "document" : undefined}
      compactHead={variant === "modal"}
      onRefresh={clearAll}
    >
      {searchMediaTypes.map((option) => {
        const filterId = `search-media-type-${option.id}`;

        return (
          <DevicesProductDownloadsFilterCheckRow
            key={option.id}
            id={filterId}
            label={option.label}
            count={counts?.[option.id]}
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
      <div className="support_download_filter-modal__panel">{mediaTypeSection}</div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={sidebarClassName}>
      {mediaTypeSection}
    </DevicesProductDownloadsFilter>
  );
}
