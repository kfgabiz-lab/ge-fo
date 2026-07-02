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
};

export function DevicesProductDownloadsFilterCheckRow({
  id,
  label,
  count,
  defaultChecked,
  wrapLi = true,
}: FilterCheckRowProps) {
  const row = (
    <label className="devices_product_downloads__check-row" htmlFor={id}>
      <Checkbox
        className="guide_checkbox devices_product_downloads__check"
        defaultChecked={defaultChecked}
        disableRipple
        icon={<GuideCheckboxIcon {...guideCheckboxIconsDownloads} />}
        checkedIcon={
          <GuideCheckboxIcon checked {...guideCheckboxIconsDownloads} />
        }
        slotProps={{ input: { id, name: id } }}
      />
      <DevicesProductDownloadsCheckLabel label={label} count={count} />
    </label>
  );

  return wrapLi ? <li>{row}</li> : row;
}

export function DevicesProductDownloadsCategoryFilterRow({
  option,
  idPrefix,
}: {
  option: DownloadCategoryOption;
  idPrefix: string;
}) {
  const [expanded, setExpanded] = useState(
    Boolean(option.nested?.length && option.defaultExpanded),
  );

  return (
    <li>
      <div className="devices_product_downloads__category-row">
        <DevicesProductDownloadsFilterCheckRow
          id={`${idPrefix}-${option.id}`}
          label={option.label}
          count={option.count}
          defaultChecked={option.defaultChecked}
          wrapLi={false}
        />
        {option.hasArrow ? (
          <button
            type="button"
            className={`devices_product_downloads__filter-arrow devices_product_downloads__filter-arrow--14${
              expanded ? " is-open" : ""
            }`}
            aria-expanded={expanded}
            aria-label={`${option.label} subcategories`}
            onClick={() => setExpanded((open) => !open)}
          />
        ) : null}
      </div>
      {option.nested?.length && expanded ? (
        <ul className="devices_product_downloads__filter-list devices_product_downloads__filter-list--nested">
          {option.nested.map((nested) => (
            <DevicesProductDownloadsFilterCheckRow
              key={nested.id}
              id={`${idPrefix}-${nested.id}`}
              label={nested.label}
              count={nested.count}
              defaultChecked={nested.defaultChecked}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function DevicesProductDownloadsFilterSection({
  title,
  children,
  variant,
}: {
  title: string;
  children: ReactNode;
  variant?: DevicesProductDownloadsFilterSectionVariant;
}) {
  const [refreshSpin, setRefreshSpin] = useState(false);
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
            onClick={() => setRefreshSpin(true)}
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
        <hr className="devices_product_downloads__filter-head-divider" />
      </div>
      <div className="devices_product_downloads__filter-panel">
        <ul className="devices_product_downloads__filter-list">{children}</ul>
      </div>
    </div>
  );
}
