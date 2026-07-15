"use client";

import { FormControl, MenuItem } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import WhereToBuySearch from "./WhereToBuySearch";
import {
  whereToBuyDistanceOptions,
  whereToBuyFilterLabels,
} from "@/data/support/whereToBuyContent";

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

export default function WhereToBuyControls() {
  return (
    <div className="support_where_to_buy_contents__controls">
      <WhereToBuySearch embedded />
      <div className="support_where_to_buy_contents__filters">
        <FormControl className="guide_field">
          <GuideSelect
            defaultValue={whereToBuyDistanceOptions[0].value}
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
