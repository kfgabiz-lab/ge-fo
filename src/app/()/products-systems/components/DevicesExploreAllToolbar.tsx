"use client";

import { FormControl, MenuItem } from "@mui/material";
import GuideSelect from "@/components/form/GuideSelect";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";

type DevicesExploreAllToolbarProps = {
  showDiscontinued: boolean;
  onToggle: () => void;
  /** devices-tree 공개 depth1 목록(Lv1 옵션, 서버에서 조회해 상위에서 주입) */
  lv1Categories: { id: string; label: string }[];
  /** 선택된 Lv1의 공개 Lv2 옵션(cascading) */
  lv2Categories: { id: string; label: string }[];
  selectedLv1: string;
  selectedLv2: string;
  onLv1Change: (value: string) => void;
  onLv2Change: (value: string) => void;
};

export default function DevicesExploreAllToolbar({
  showDiscontinued,
  onToggle,
  lv1Categories,
  lv2Categories,
  selectedLv1,
  selectedLv2,
  onLv1Change,
  onLv2Change,
}: DevicesExploreAllToolbarProps) {
  return (
    <div className="devices_explore__filters">
      <div className="devices_explore__filters-left">
        <FormControl className="guide_field guide_field--w200">
          <GuideSelect
            value={selectedLv1}
            onChange={(event) => onLv1Change(String(event.target.value))}
            displayEmpty
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": "Lv1 Category" }}
            renderValue={(value) => {
              const selected = lv1Categories.find(
                (category) => category.id === String(value),
              );
              const label = selected ? selected.label : "Lv1 Category";
              return (
                <span className="guide_field__select-value" title={label}>
                  {label}
                </span>
              );
            }}
          >
            <MenuItem value="">Lv1 Category</MenuItem>
            {lv1Categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.label}
              </MenuItem>
            ))}
          </GuideSelect>
        </FormControl>

        <FormControl className="guide_field guide_field--w200">
          <GuideSelect
            value={selectedLv2}
            onChange={(event) => onLv2Change(String(event.target.value))}
            displayEmpty
            disabled={!selectedLv1 || lv2Categories.length === 0}
            IconComponent={GuideSelectIcon}
            inputProps={{ "aria-label": "Lv2 Category" }}
            renderValue={(value) => {
              const selected = lv2Categories.find(
                (category) => category.id === String(value),
              );
              const label = selected ? selected.label : "Lv2 Category";
              return (
                <span className="guide_field__select-value" title={label}>
                  {label}
                </span>
              );
            }}
          >
            <MenuItem value="">Lv2 Category</MenuItem>
            {lv2Categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.label}
              </MenuItem>
            ))}
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
