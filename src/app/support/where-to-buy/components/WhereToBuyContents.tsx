"use client";

import { useState } from "react";
import WhereToBuyControls from "./WhereToBuyControls";
import WhereToBuyEmpty from "./WhereToBuyEmpty";
import WhereToBuyLocationCard from "./WhereToBuyLocationCard";
import WhereToBuyMap from "./WhereToBuyMap";
import WhereToBuyMapPopup from "./WhereToBuyMapPopup";
import WhereToBuyViewToggle, {
  type WhereToBuyMobileView,
} from "./WhereToBuyViewToggle";
import {
  whereToBuyDefaultActiveId,
  whereToBuyLocations,
  whereToBuyPage,
} from "@/data/support/whereToBuyContent";

type WhereToBuyContentsProps = {
  /** 메인 페이지: list-col 하단 no-data 프리뷰 */
  showNoDataPreview?: boolean;
  /** /no-data 전용 페이지 */
  noDataPage?: boolean;
};

export default function WhereToBuyContents({
  showNoDataPreview = false,
  noDataPage = false,
}: WhereToBuyContentsProps) {
  const [activeId, setActiveId] = useState(whereToBuyDefaultActiveId);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [mobileView, setMobileView] = useState<WhereToBuyMobileView>(
    noDataPage ? "list" : "map",
  );
  const activeLocation =
    whereToBuyLocations.find((item) => item.id === activeId) ??
    whereToBuyLocations[0];

  return (
    <section
      className={`support_where_to_buy_contents support_where_to_buy_contents--mobile-${mobileView}${
        noDataPage ? " support_where_to_buy_contents--no-data-page" : ""
      }`}
      id="support-where-to-buy-contents"
    >
      <div className="support_where_to_buy_contents__shell">
        <div className="support_where_to_buy_contents__list-col">
          <WhereToBuyControls />

          {!noDataPage ? (
            <div className="support_where_to_buy_contents__results">
              <div className="support_where_to_buy_contents__count-row">
                <p className="support_where_to_buy_contents__count">
                  Total{" "}
                  <strong>
                    {whereToBuyPage.totalResults.toLocaleString()}
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
                {whereToBuyLocations.map((location) => (
                  <WhereToBuyLocationCard
                    key={location.id}
                    location={location}
                    isActive={location.id === activeId}
                    onSelect={() => setActiveId(location.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {noDataPage || showNoDataPreview ? (
            <div className="support_where_to_buy_contents__no-data">
              <div className="support_where_to_buy_contents__count-total">
                <div className="support_where_to_buy_contents__count-row">
                  <p className="support_where_to_buy_contents__count">
                    Total <strong>0</strong>
                  </p>
                </div>
                <hr
                  className="support_where_to_buy_contents__count-divider"
                  aria-hidden
                />
              </div>
              <WhereToBuyEmpty />
            </div>
          ) : null}
        </div>

        <div id="store_locator_main" className="support_where_to_buy_contents__map-col">
          <WhereToBuyMap
            locations={whereToBuyLocations}
            activeLocation={activeLocation}
            onLocationSelect={setActiveId}
          />
          {!noDataPage ? (
            <div className="support_where_to_buy_map__popup-anchor support_where_to_buy_map__popup-anchor--sample support_where_to_buy_map__popup-anchor--mobile">
              <WhereToBuyMapPopup location={activeLocation} />
            </div>
          ) : null}
        </div>
      </div>

      <WhereToBuyViewToggle
        view={mobileView}
        onToggle={() =>
          setMobileView((current) => (current === "map" ? "list" : "map"))
        }
      />
    </section>
  );
}
