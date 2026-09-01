"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WhereToBuyControls from "./WhereToBuyControls";
import WhereToBuyEmpty from "./WhereToBuyEmpty";
import WhereToBuyLocationCard from "./WhereToBuyLocationCard";
import WhereToBuyMap from "./WhereToBuyMap";
import WhereToBuyMapPopup from "./WhereToBuyMapPopup";
import type { WhereToBuyLocateSource } from "./WhereToBuySearch";
import WhereToBuyViewToggle, {
  type WhereToBuyMobileView,
} from "./WhereToBuyViewToggle";
import {
  fetchWhereToBuyLocations,
  filterLocationsByBounds,
  filterLocationsByRadius,
  filterLocationsByText,
  parseDistanceMiles,
  whereToBuyDefaultDistance,
  whereToBuyPage,
  type WhereToBuyBoundsLiteral,
  type WhereToBuyLocation,
} from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";
import { getLenisInstance, getWindowScrollY, scrollWindowTo } from "@/lib/lenisScroll";

type WhereToBuyContentsProps = {
  showNoDataPreview?: boolean;
  noDataPage?: boolean;
};

export default function WhereToBuyContents({
  noDataPage = false,
}: WhereToBuyContentsProps) {
  const [locations, setLocations] = useState<WhereToBuyLocation[]>([]);
  const [searchCoord, setSearchCoord] = useState<GeoCoord | null>(null);
  const [myLocation, setMyLocation] = useState<GeoCoord | null>(null);
  const [radiusValue, setRadiusValue] = useState<string>(
    whereToBuyDefaultDistance,
  );
  const [boundsFilter, setBoundsFilter] = useState<WhereToBuyBoundsLiteral | null>(
    null,
  );
  const [textSearchResults, setTextSearchResults] = useState<
    WhereToBuyLocation[] | null
  >(null);
  const [activeId, setActiveId] = useState<string>("");
  const popupAnchorRef = useRef<HTMLDivElement>(null);
  const mapColRef = useRef<HTMLDivElement>(null);
  const listColRef = useRef<HTMLDivElement>(null);
  const viewToggleRef = useRef<HTMLButtonElement>(null);
  const pendingScrollViewRef = useRef<WhereToBuyMobileView | null>(null);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [mobileView, setMobileView] = useState<WhereToBuyMobileView>(
    noDataPage ? "list" : "map",
  );

  useEffect(() => {
    let alive = true;
    fetchWhereToBuyLocations()
      .then((rows) => {
        if (alive) setLocations(rows);
      })
      .catch(() => {
        if (alive) setLocations([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const radiusOrigin = useMemo<GeoCoord>(
    () =>
      searchCoord ?? {
        lat: whereToBuyPage.mapDefaultCenter.lat,
        lng: whereToBuyPage.mapDefaultCenter.lng,
      },
    [searchCoord],
  );
  const radiusMiles = useMemo(
    () => parseDistanceMiles(radiusValue),
    [radiusValue],
  );

  const filtered = useMemo(() => {
    if (boundsFilter) {
      return filterLocationsByBounds(locations, boundsFilter);
    }
    if (textSearchResults) {
      return textSearchResults;
    }
    return filterLocationsByRadius(locations, radiusOrigin, radiusMiles);
  }, [locations, radiusOrigin, radiusMiles, boundsFilter, textSearchResults]);

  const handleLocate = (
    coord: GeoCoord | null,
    source: WhereToBuyLocateSource,
  ) => {
    setBoundsFilter(null);
    setTextSearchResults(null);
    setSearchCoord(coord);
    if (source === "device" && coord) {
      setMyLocation(coord);
    }
  };

  const handleTextFallback = (query: string) => {
    const matches = filterLocationsByText(locations, query);
    if (matches.length === 0) {
      return;
    }
    setBoundsFilter(null);
    setSearchCoord(null);
    setTextSearchResults(matches);
  };

  const handleReset = () => {
    setBoundsFilter(null);
    setTextSearchResults(null);
    setSearchCoord(null);
    setRadiusValue(whereToBuyDefaultDistance);
    setSearchResetKey((current) => current + 1);
  };

  const handleViewAll = () => {
    handleReset();
  };

  const handleRefresh = () => {
    setRefreshSpin(true);
    handleReset();
  };

  const handleRadiusChange = (value: string) => {
    setBoundsFilter(null);
    setTextSearchResults(null);
    setRadiusValue(value);
  };

  const handleSearchArea = (bounds: WhereToBuyBoundsLiteral) => {
    setBoundsFilter(bounds);
    setTextSearchResults(null);
    setSearchCoord(null);
    setRadiusValue(whereToBuyDefaultDistance);
  };

  const handleMarkerSelect = (id: string) => {
    setActiveId((current) => (current === id ? "" : id));
  };

  const isFiltered =
    searchCoord !== null ||
    textSearchResults !== null ||
    radiusValue !== whereToBuyDefaultDistance;

  useEffect(() => {
    setActiveId((current) =>
      current && filtered.some((item) => item.id === current) ? current : "",
    );
  }, [filtered]);

  const activeLocation = filtered.find((item) => item.id === activeId);
  const hasResults = filtered.length > 0;

  const scrollElementToTop = (el: HTMLElement | null, offsetPx = 0) => {
    if (!el) return;

    const top = Math.max(
      0,
      el.getBoundingClientRect().top + getWindowScrollY() - offsetPx,
    );
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(top, { programmatic: true, force: true });
      return;
    }
    scrollWindowTo(top);
  };

  const handleViewToggle = () => {
    setMobileView((current) => {
      const next = current === "map" ? "list" : "map";
      pendingScrollViewRef.current = next;
      return next;
    });
  };

  useEffect(() => {
    const target = pendingScrollViewRef.current;
    if (!target || target !== mobileView) return;
    pendingScrollViewRef.current = null;

    let cancelled = false;
    const scrollToTarget = () => {
      if (cancelled) return;
      // View Map / View List 공통 — search 위치 + 입력 포커스
      const searchEl = document.getElementById("support-where-to-buy-search");
      scrollElementToTop(
        searchEl ??
          (mobileView === "map" ? mapColRef.current : listColRef.current),
      );
      const input = searchEl?.querySelector<HTMLInputElement>(
        "input:not([type='hidden'])",
      );
      input?.focus({ preventScroll: true });
    };

    // map↔list 레이아웃 반영 후 스크롤 (이중 rAF + timeout)
    let timeoutId = 0;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTarget();
        timeoutId = window.setTimeout(scrollToTarget, 50);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [mobileView]);

  return (
    <section
      className={`support_where_to_buy_contents support_where_to_buy_contents--mobile-${mobileView}${
        noDataPage ? " support_where_to_buy_contents--no-data-page" : ""
      }`}
      id="support-where-to-buy-contents"
    >
      <div className="support_where_to_buy_contents__shell">
        <div
          ref={listColRef}
          className="support_where_to_buy_contents__list-col"
        >
          <WhereToBuyControls
            searchResetKey={searchResetKey}
            radiusValue={radiusValue}
            onRadiusChange={handleRadiusChange}
            onLocate={handleLocate}
            onTextFallback={handleTextFallback}
            onReset={handleReset}
          />

          {/* 기획서 항목8 — Total 개수 + 새로고침 버튼은 결과 0건이어도 항상 노출한다(리스트/Empty만 분기) */}
          <div className="support_where_to_buy_contents__results">
            <div className="support_where_to_buy_contents__count-row">
              <p className="support_where_to_buy_contents__count">
                Total <strong>{filtered.length.toLocaleString()}</strong>
              </p>
              <button
                type="button"
                className="support_where_to_buy_contents__refresh"
                onClick={handleRefresh}
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

            {hasResults ? (
              <div
                className="support_where_to_buy_contents__list"
                data-slug="wheretobuy-agency-data"
                data-slug-repeat="true"
              >
                {filtered.map((location) => (
                  <WhereToBuyLocationCard
                    key={location.id}
                    location={location}
                    isActive={location.id === activeId}
                    onSelect={() => setActiveId(location.id)}
                    myLocation={myLocation}
                  />
                ))}
              </div>
            ) : (
              <div className="support_where_to_buy_contents__no-data">
                <WhereToBuyEmpty onViewAll={handleViewAll} />
              </div>
            )}
          </div>
        </div>

        <WhereToBuyViewToggle
          ref={viewToggleRef}
          view={mobileView}
          onToggle={handleViewToggle}
        />

        <div
          id="store_locator_main"
          ref={mapColRef}
          className="support_where_to_buy_contents__map-col"
        >
          <WhereToBuyMap
            locations={filtered}
            activeLocation={activeLocation}
            onLocationSelect={handleMarkerSelect}
            popupAnchorRef={popupAnchorRef}
            isFiltered={isFiltered}
            boundsMode={boundsFilter !== null || textSearchResults !== null}
            onSearchArea={handleSearchArea}
            radiusOrigin={radiusOrigin}
            radiusMiles={radiusMiles}
          />
          {activeLocation ? (
            <div
              ref={popupAnchorRef}
              className="support_where_to_buy_map__popup-anchor support_where_to_buy_map__popup-anchor--mobile"
            >
              <WhereToBuyMapPopup location={activeLocation} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
