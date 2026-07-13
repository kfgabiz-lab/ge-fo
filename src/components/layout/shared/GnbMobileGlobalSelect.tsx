"use client";

import { type ChangeEvent } from "react";
import {
  gnbGlobalActiveRegionId,
  gnbGlobalRegions,
} from "@/data/gnb/gnbGlobalContent";

export default function GnbMobileGlobalSelect() {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const region = gnbGlobalRegions.find((item) => item.id === event.target.value);
    if (!region) return;

    if (region.href && region.href !== "#") {
      window.location.assign(region.href);
      return;
    }

    event.target.value = gnbGlobalActiveRegionId;
  };

  return (
    <label className="gnb_mobile_global-select">
      <span className="gnb_mobile_global-select__group">
        <span className="gnb_mobile_global-select__icon" aria-hidden />
        <select
          className="gnb_mobile_global-select__native"
          defaultValue={gnbGlobalActiveRegionId}
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
      </span>
      <span className="gnb_mobile_global-select__chevron" aria-hidden />
    </label>
  );
}
