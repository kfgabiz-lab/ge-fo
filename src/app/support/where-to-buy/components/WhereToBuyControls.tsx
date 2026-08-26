"use client";

import { FormControl, MenuItem, type SelectChangeEvent } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import WhereToBuySearch, {
  type WhereToBuyLocateSource,
} from "./WhereToBuySearch";
import {
  whereToBuyDistanceOptions,
  whereToBuyFilterLabels,
} from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";

type WhereToBuyControlsProps = {
  searchResetKey: number;
  radiusValue: string;
  onRadiusChange: (value: string) => void;
  onLocate: (coord: GeoCoord | null, source: WhereToBuyLocateSource) => void;
  onTextFallback: (query: string) => void;
  onReset: () => void;
};

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

export default function WhereToBuyControls({
  searchResetKey,
  radiusValue,
  onRadiusChange,
  onLocate,
  onTextFallback,
  onReset,
}: WhereToBuyControlsProps) {
  return (
    <div className="support_where_to_buy_contents__controls">
      <WhereToBuySearch
        key={searchResetKey}
        embedded
        onLocate={onLocate}
        onTextFallback={onTextFallback}
        onReset={onReset}
      />
      <div
        id="support-where-to-buy-filters"
        className="support_where_to_buy_contents__filters"
      >
        <FormControl className="guide_field">
          <GuideSelect
            value={radiusValue}
            onChange={(event: SelectChangeEvent<unknown>) =>
              onRadiusChange(String(event.target.value))
            }
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": whereToBuyFilterLabels.distance }}
            renderValue={(value) => {
              const label =
                whereToBuyDistanceOptions.find((item) => item.value === value)
                  ?.label ?? String(value);
              return renderSelectValue(label);
            }}
          >
            {whereToBuyDistanceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </GuideSelect>
        </FormControl>
      </div>
    </div>
  );
}
