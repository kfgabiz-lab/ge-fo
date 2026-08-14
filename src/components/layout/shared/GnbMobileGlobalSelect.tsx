"use client";

import { type ChangeEvent, useState } from "react";
import {
  gnbGlobalActiveRegionId,
  gnbGlobalRegions,
} from "@/data/gnb/gnbGlobalContent";

export default function GnbMobileGlobalSelect() {
  const [value, setValue] = useState(gnbGlobalActiveRegionId);
  const currentLabel =
    gnbGlobalRegions.find((item) => item.id === value)?.label ?? "America";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value;
    const region = gnbGlobalRegions.find((item) => item.id === nextValue);
    if (!region) return;

    if (region.href && region.href !== "#") {
      window.location.assign(region.href);
      return;
    }

    event.target.value = gnbGlobalActiveRegionId;
    setValue(gnbGlobalActiveRegionId);
  };

  return (
    <label className="gnb_mobile_global-select">
      <span className="gnb_mobile_global-select__group">
        <span className="gnb_mobile_global-select__icon" aria-hidden />
        <span className="gnb_mobile_global-select__value">{currentLabel}</span>
      </span>
      <span className="gnb_mobile_global-select__chevron" aria-hidden />
      <select
        className="gnb_mobile_global-select__native"
        value={value}
        aria-label="Select region"
        onChange={handleChange}
      >
        {gnbGlobalRegions.map((region) => (
          <option
            key={region.id}
            value={region.id}
            disabled={region.href === "#" && region.id !== gnbGlobalActiveRegionId}
          >
            {region.label}
          </option>
        ))}
      </select>
    </label>
  );
}
