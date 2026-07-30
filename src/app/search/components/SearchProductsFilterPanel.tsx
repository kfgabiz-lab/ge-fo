"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import {
  useSearchProductsCategories,
  useSearchProductsFilter,
} from "./SearchProductsFilterProvider";

type SearchProductsFilterPanelProps = {
  variant?: "sidebar" | "modal";
  sidebarClassName?: string;
};

export default function SearchProductsFilterPanel({
  variant = "sidebar",
  sidebarClassName,
}: SearchProductsFilterPanelProps) {
  const { isChecked, toggleFilter, clearSection } = useSearchProductsFilter();
  const { categories } = useSearchProductsCategories();

  const productCategorySection = (
    <DevicesProductDownloadsFilterSection
      title="Product Category"
      compactHead={variant === "modal"}
      onRefresh={() => clearSection("category")}
    >
      {categories.map((option) => (
        <DevicesProductDownloadsCategoryFilterRow
          key={option.id}
          option={option}
          idPrefix="search-product-category"
          isChecked={isChecked}
          onToggle={toggleFilter}
        />
      ))}
    </DevicesProductDownloadsFilterSection>
  );

  if (variant === "modal") {
    return (
      <div className="support_download_filter-modal__panel">
        {productCategorySection}
      </div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={sidebarClassName}>
      {productCategorySection}
    </DevicesProductDownloadsFilter>
  );
}
