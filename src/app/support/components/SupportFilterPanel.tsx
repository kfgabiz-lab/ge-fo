"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
  type DevicesProductDownloadsFilterSectionVariant,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import type { SupportFilterContextValue } from "./createSupportFilterStore";

type SupportFilterPanelProps = {
  variant?: "sidebar" | "modal";
  filter: Pick<
    SupportFilterContextValue,
    "isChecked" | "toggleFilter" | "clearSection"
  >;
  categories: DownloadCategoryOption[];
  categoryIdPrefix: string;
  categorySection?: string;
  secondaryTitle?: string;
  secondaryVariant?: DevicesProductDownloadsFilterSectionVariant;
  secondaryIdPrefix?: string;
  secondarySection?: string;
  secondaryOptions?: DownloadFilterOption[];
};

export default function SupportFilterPanel({
  variant = "sidebar",
  filter,
  categories,
  categoryIdPrefix,
  categorySection = "category",
  secondaryTitle,
  secondaryVariant,
  secondaryIdPrefix,
  secondarySection,
  secondaryOptions,
}: SupportFilterPanelProps) {
  const { isChecked, toggleFilter, clearSection } = filter;

  const panelClass =
    variant === "sidebar"
      ? "support_download_filter--pc"
      : "support_download_filter-modal__panel";

  const productCategorySection = (
    <DevicesProductDownloadsFilterSection
      title="Product Category"
      compactHead={variant === "modal"}
      onRefresh={() => clearSection(categorySection)}
    >
      {categories.map((option) => (
        <DevicesProductDownloadsCategoryFilterRow
          key={option.id}
          option={option}
          idPrefix={categoryIdPrefix}
          isChecked={isChecked}
          onToggle={toggleFilter}
        />
      ))}
    </DevicesProductDownloadsFilterSection>
  );

  const hasSecondary = Boolean(secondaryOptions && secondaryOptions.length > 0);
  const secondSection = hasSecondary ? (
    <DevicesProductDownloadsFilterSection
      title={secondaryTitle ?? ""}
      variant={variant === "sidebar" ? secondaryVariant : undefined}
      compactHead={variant === "modal"}
      onRefresh={() => clearSection(secondarySection ?? "")}
    >
      {(secondaryOptions ?? []).map((option) => {
        const filterId = `${secondaryIdPrefix}-${option.id}`;

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
  ) : null;

  if (variant === "modal") {
    return (
      <div className={panelClass}>
        {productCategorySection}
        {secondSection ? (
          <>
            <hr className="support_download_filter-modal__divider" aria-hidden />
            {secondSection}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={panelClass}>
      {productCategorySection}
      {secondSection}
    </DevicesProductDownloadsFilter>
  );
}
