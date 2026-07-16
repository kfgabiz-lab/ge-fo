"use client";

import { FormControl, MenuItem, type SelectChangeEvent } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import WhereToBuySearch from "./WhereToBuySearch";
import {
  whereToBuyDistanceOptions,
  whereToBuyFilterLabels,
} from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";

type WhereToBuyControlsProps = {
  /** 선택된 반경 값("500mi" 등) — Contents 소유 */
  radiusValue: string;
  /** 반경 드롭다운 변경 콜백 */
  onRadiusChange: (value: string) => void;
  /** 검색좌표(지오코딩/내위치) 확정 콜백 */
  onLocate: (coord: GeoCoord | null) => void;
};

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

export default function WhereToBuyControls({
  radiusValue,
  onRadiusChange,
  onLocate,
}: WhereToBuyControlsProps) {
  return (
    <div className="support_where_to_buy_contents__controls">
      <WhereToBuySearch embedded onLocate={onLocate} />
      <div className="support_where_to_buy_contents__filters">
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
