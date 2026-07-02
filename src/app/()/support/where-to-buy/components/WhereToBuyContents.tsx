"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useState } from "react";
import {
  GuideSelectIcon,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import WhereToBuyEmpty from "./WhereToBuyEmpty";
import WhereToBuyLocationCard from "./WhereToBuyLocationCard";
import WhereToBuyMap from "./WhereToBuyMap";
import WhereToBuyMapPopup from "./WhereToBuyMapPopup";
import WhereToBuySearch from "./WhereToBuySearch";
import {
  whereToBuyCategoryOptions,
  whereToBuyDefaultActiveId,
  whereToBuyDistanceOptions,
  whereToBuyFilterLabels,
  whereToBuyLocations,
  whereToBuyPage,
} from "@/data/support/whereToBuyContent";

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

type WhereToBuyContentsProps = {
  empty?: boolean;
};

export default function WhereToBuyContents({
  empty = false,
}: WhereToBuyContentsProps) {
  const [activeId, setActiveId] = useState(whereToBuyDefaultActiveId);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const activeLocation =
    whereToBuyLocations.find((item) => item.id === activeId) ??
    whereToBuyLocations[0];

  return (
    <section
      className={`support_where_to_buy_contents${
        empty ? " support_where_to_buy_contents--no-data" : ""
      }`}
      id="support-where-to-buy-contents"
    >
      <div className="support_where_to_buy_contents__shell">
        <div className="support_where_to_buy_contents__list-col">
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

              <FormControl className="guide_field">
                <GuideSelect
                  defaultValue={whereToBuyCategoryOptions[0].value}
                  IconComponent={GuideSelectIcon}
                  inputProps={{ "aria-label": whereToBuyFilterLabels.category }}
                  renderValue={(value) => {
                    const label =
                      whereToBuyCategoryOptions.find((item) => item.value === value)
                        ?.label ?? String(value);
                    return renderSelectValue(label);
                  }}
                >
                  {whereToBuyCategoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </GuideSelect>
              </FormControl>
            </div>
          </div>

          <div className="support_where_to_buy_contents__results">
            <div className="support_where_to_buy_contents__count-row">
              <p className="support_where_to_buy_contents__count">
                Total{" "}
                <strong>
                  {(empty ? 0 : whereToBuyPage.totalResults).toLocaleString()}
                </strong>
              </p>
              <button
                type="button"
                className="support_where_to_buy_contents__refresh"
                onClick={() => setRefreshSpin(true)}
              >
                <span
                  className={
                    refreshSpin
                      ? "support_where_to_buy_contents__refresh-icon is-spinning"
                      : "support_where_to_buy_contents__refresh-icon"
                  }
                  onAnimationEnd={() => setRefreshSpin(false)}
                  aria-hidden
                />
                <span className="ir">Refresh results</span>
              </button>
            </div>

            <div className="support_where_to_buy_contents__list">
              {empty ? (
                <WhereToBuyEmpty />
              ) : (
                whereToBuyLocations.map((location) => (
                  <WhereToBuyLocationCard
                    key={location.id}
                    location={location}
                    isActive={location.id === activeId}
                    onSelect={() => setActiveId(location.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div id="store_locator_main" className="support_where_to_buy_contents__map-col">
          <WhereToBuyMap
            locations={whereToBuyLocations}
            activeLocation={activeLocation}
            onLocationSelect={setActiveId}
          />
          <div className="support_where_to_buy_map__popup-anchor support_where_to_buy_map__popup-anchor--sample">
            <WhereToBuyMapPopup location={whereToBuyLocations[0]} />
          </div>
        </div>
      </div>
    </section>
  );
}
