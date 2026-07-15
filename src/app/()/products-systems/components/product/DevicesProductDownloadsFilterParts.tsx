"use client";

import { Checkbox } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsDownloads,
} from "@/components/form/GuideFieldIcons";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import DevicesProductDownloadsCheckLabel from "./DevicesProductDownloadsCheckLabel";

export type DevicesProductDownloadsFilterSectionVariant =
  | "certification"
  | "document";

type FilterCheckRowProps = DownloadFilterOption & {
  id: string;
  wrapLi?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function DevicesProductDownloadsFilterCheckRow({
  id,
  label,
  count,
  defaultChecked,
  wrapLi = true,
  checked: controlledChecked,
  indeterminate = false,
  onCheckedChange,
}: FilterCheckRowProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    Boolean(defaultChecked),
  );
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const setChecked = (nextChecked: boolean) => {
    if (isControlled) {
      onCheckedChange?.(nextChecked);
      return;
    }

    setUncontrolledChecked(nextChecked);
  };

  const handleLabelClick = () => {
    if (indeterminate) {
      setChecked(false);
      return;
    }

    setChecked(!checked);
  };

  const row = (
    <div className="devices_product_downloads__check-row">
      <Checkbox
        className="guide_checkbox devices_product_downloads__check"
        checked={checked}
        indeterminate={indeterminate}
        onChange={(_, nextChecked) => setChecked(nextChecked)}
        disableRipple
        icon={<GuideCheckboxIcon {...guideCheckboxIconsDownloads} />}
        checkedIcon={
          <GuideCheckboxIcon checked {...guideCheckboxIconsDownloads} />
        }
        indeterminateIcon={
          <GuideCheckboxIcon {...guideCheckboxIconsDownloads} />
        }
        slotProps={{ input: { id, name: id, "aria-label": label } }}
      />
      <button
        type="button"
        className="devices_product_downloads__check-label"
        onClick={handleLabelClick}
      >
        <DevicesProductDownloadsCheckLabel label={label} count={count} />
      </button>
    </div>
  );

  return wrapLi ? <li>{row}</li> : row;
}

export function DevicesProductDownloadsCategoryFilterRow({
  option,
  idPrefix,
  isChecked,
  onToggle,
}: {
  option: DownloadCategoryOption;
  idPrefix: string;
  isChecked?: (id: string) => boolean;
  onToggle?: (id: string, checked: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(
    Boolean(option.nested?.length && option.defaultExpanded),
  );
  const parentId = `${idPrefix}-${option.id}`;
  const nestedIds =
    option.nested?.map((nested) => `${idPrefix}-${nested.id}`) ?? [];
  const checkedNestedCount = nestedIds.filter((nestedId) =>
    isChecked?.(nestedId),
  ).length;
  const parentChecked = isChecked?.(parentId) ?? false;
  const parentIndeterminate =
    Boolean(isChecked) &&
    nestedIds.length > 0 &&
    checkedNestedCount > 0 &&
    checkedNestedCount < nestedIds.length;
  const isManaged = Boolean(isChecked && onToggle);

  return (
    <li>
      <div className="devices_product_downloads__category-row">
        <DevicesProductDownloadsFilterCheckRow
          id={parentId}
          label={option.label}
          count={option.count}
          defaultChecked={option.defaultChecked}
          wrapLi={false}
          checked={isManaged ? parentChecked : undefined}
          indeterminate={isManaged ? parentIndeterminate : undefined}
          onCheckedChange={
            isManaged ? (checked) => onToggle?.(parentId, checked) : undefined
          }
        />
        {option.hasArrow ? (
          <button
            type="button"
            className={`devices_product_downloads__filter-arrow devices_product_downloads__filter-arrow--14${
              expanded ? " is-open" : ""
            }`}
            aria-expanded={expanded}
            aria-label={`${option.label} subcategories`}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((open) => !open);
            }}
          />
        ) : null}
      </div>
      {option.nested?.length && expanded ? (
        <ul className="devices_product_downloads__filter-list devices_product_downloads__filter-list--nested">
          {option.nested.map((nested) => {
            const nestedId = `${idPrefix}-${nested.id}`;

            return (
              <DevicesProductDownloadsFilterCheckRow
                key={nested.id}
                id={nestedId}
                label={nested.label}
                count={nested.count}
                defaultChecked={nested.defaultChecked}
                checked={isManaged ? isChecked?.(nestedId) : undefined}
                onCheckedChange={
                  isManaged
                    ? (checked) => onToggle?.(nestedId, checked)
                    : undefined
                }
              />
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

export function DevicesProductDownloadsFilterSection({
  title,
  children,
  variant,
  compactHead = false,
  onRefresh,
}: {
  title: string;
  children: ReactNode;
  variant?: DevicesProductDownloadsFilterSectionVariant;
  compactHead?: boolean;
  onRefresh?: () => void;
}) {
  const [refreshSpin, setRefreshSpin] = useState(false);

  const handleRefreshClick = () => {
    onRefresh?.();
    setRefreshSpin(false);
    requestAnimationFrame(() => {
      setRefreshSpin(true);
    });
  };

  const variantClass =
    variant === "certification"
      ? " devices_product_downloads__filter-section--certification"
      : variant === "document"
        ? " devices_product_downloads__filter-section--document"
        : "";

  return (
    <div className={`devices_product_downloads__filter-section${variantClass}`}>
      <div className="devices_product_downloads__filter-head">
        <div className="devices_product_downloads__filter-head-row">
          <span className="devices_product_downloads__filter-tit">{title}</span>
          <button
            type="button"
            className="devices_product_downloads__refresh"
            onClick={handleRefreshClick}
          >
            <span
              className={
                refreshSpin
                  ? "devices_product_downloads__refresh-icon is-spinning"
                  : "devices_product_downloads__refresh-icon"
              }
              onAnimationEnd={() => setRefreshSpin(false)}
              aria-hidden="true"
            />
            <span className="ir">Reset filters</span>
          </button>
        </div>
        {compactHead ? null : (
          <hr className="devices_product_downloads__filter-head-divider" />
        )}
      </div>
      <div className="devices_product_downloads__filter-panel">
        <ul className="devices_product_downloads__filter-list">{children}</ul>
      </div>
    </div>
  );
}
