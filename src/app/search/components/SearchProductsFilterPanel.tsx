"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import { searchProductDocumentTypes } from "@/data/search/searchProductsContent";
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

  const documentTypeSection = (
    <DevicesProductDownloadsFilterSection
      title="Document Type"
      variant={variant === "sidebar" ? "document" : undefined}
      compactHead={variant === "modal"}
      onRefresh={() => clearSection("document")}
    >
      {searchProductDocumentTypes.map((option) => {
        const filterId = `search-product-doc-${option.id}`;

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
      <div className="support_download_filter-modal__panel">
        {productCategorySection}
        <hr className="support_download_filter-modal__divider" aria-hidden />
        {documentTypeSection}
      </div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={sidebarClassName}>
      {productCategorySection}
      {documentTypeSection}
    </DevicesProductDownloadsFilter>
  );
}
