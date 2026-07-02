"use client";

import { FormControl, MenuItem } from "@mui/material";
import GuideSelect from "@/components/form/GuideSelect";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import { exploreAllLv1Categories } from "@/data/gnbExploreAllProducts";

type DevicesExploreAllToolbarProps = {
  showDiscontinued: boolean;
  onToggle: () => void;
};

export default function DevicesExploreAllToolbar({
  showDiscontinued,
  onToggle,
}: DevicesExploreAllToolbarProps) {
  return (
    <div className="devices_explore__filters">
      <div className="devices_explore__filters-left">
        <FormControl className="guide_field guide_field--w200">
          <GuideSelect
            value=""
            displayEmpty
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": "Lv1 Category" }}
            onOpen={(event) => event.preventDefault()}
            renderValue={() => (
              <span className="guide_field__select-value" title="Lv1 Category">
                Lv1 Category
              </span>
            )}
          >
            <MenuItem value="">Lv1 Category</MenuItem>
            {exploreAllLv1Categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.label}
              </MenuItem>
            ))}
          </GuideSelect>
        </FormControl>

        <FormControl className="guide_field guide_field--w200">
          <GuideSelect
            value=""
            displayEmpty
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": "Lv2 Category" }}
            onOpen={(event) => event.preventDefault()}
            renderValue={() => (
              <span className="guide_field__select-value" title="Lv2 Category">
                Lv2 Category
              </span>
            )}
          >
            <MenuItem value="">Lv2 Category</MenuItem>
          </GuideSelect>
        </FormControl>
      </div>

      <div className="devices_explore__toggle-wrap">
        <span className="devices_explore__toggle-label">
          <span className="devices_explore__status devices_explore__status--legend" aria-hidden />
          Discontinued
        </span>
        <button
          type="button"
          className={
            showDiscontinued
              ? "devices_explore__toggle is-on"
              : "devices_explore__toggle"
          }
          role="switch"
          aria-checked={showDiscontinued}
          aria-label="Show discontinued products"
          onClick={onToggle}
        >
          <span className="devices_explore__toggle-knob" aria-hidden />
        </button>
      </div>
    </div>
  );
}
