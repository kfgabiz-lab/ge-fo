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

/**
 * Download Center / Tech Hub 필터 패널 공통 컴포넌트.
 * 두 페이지 패널 마크업이 동일(카테고리 섹션 + 평면 2차 섹션)하여,
 * 데이터·prefix·라벨·2차 섹션 variant만 props로 주입받는다.
 * 필터 상태 훅은 페이지별 컨텍스트가 다르므로 얇은 래퍼에서 값을 넘겨받는다.
 */
type SupportFilterPanelProps = {
  variant?: "sidebar" | "modal";
  /** 페이지별 필터 컨텍스트에서 넘겨받는 상태/액션 */
  filter: Pick<
    SupportFilterContextValue,
    "isChecked" | "toggleFilter" | "clearSection"
  >;
  /** 카테고리(중첩) 섹션 */
  categories: DownloadCategoryOption[];
  categoryIdPrefix: string;
  categorySection?: string;
  /** 두 번째 평면 섹션(문서유형 / 인증) */
  secondaryTitle: string;
  secondaryVariant: DevicesProductDownloadsFilterSectionVariant;
  secondaryIdPrefix: string;
  secondarySection: string;
  secondaryOptions: DownloadFilterOption[];
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

  const secondSection = (
    <DevicesProductDownloadsFilterSection
      title={secondaryTitle}
      variant={variant === "sidebar" ? secondaryVariant : undefined}
      compactHead={variant === "modal"}
      onRefresh={() => clearSection(secondarySection)}
    >
      {secondaryOptions.map((option) => {
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
  );

  if (variant === "modal") {
    return (
      <div className={panelClass}>
        {productCategorySection}
        <hr className="support_download_filter-modal__divider" aria-hidden />
        {secondSection}
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
