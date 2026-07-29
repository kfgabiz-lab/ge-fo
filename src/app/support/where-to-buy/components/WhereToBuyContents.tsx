"use client";

import { useEffect, useMemo, useState } from "react";
import WhereToBuyControls from "./WhereToBuyControls";
import WhereToBuyEmpty from "./WhereToBuyEmpty";
import WhereToBuyLocationCard from "./WhereToBuyLocationCard";
import WhereToBuyMap, { type PopupPixel } from "./WhereToBuyMap";
import WhereToBuyMapPopup from "./WhereToBuyMapPopup";
import type { WhereToBuyLocateSource } from "./WhereToBuySearch";
import WhereToBuyViewToggle, {
  type WhereToBuyMobileView,
} from "./WhereToBuyViewToggle";
import {
  fetchWhereToBuyLocations,
  filterLocationsByBounds,
  filterLocationsByRadius,
  parseDistanceMiles,
  whereToBuyDistanceOptions,
  whereToBuyPage,
  type WhereToBuyBoundsLiteral,
  type WhereToBuyLocation,
} from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";

type WhereToBuyContentsProps = {
  /** 메인 페이지: list-col 하단 no-data 프리뷰 (현재는 결과 0건일 때 자동 노출로 대체) */
  showNoDataPreview?: boolean;
  /** /no-data 전용 페이지 — 초기 모바일 뷰/클래스만 구분(검색·반경 기능은 동일 활성화) */
  noDataPage?: boolean;
};

export default function WhereToBuyContents({
  noDataPage = false,
}: WhereToBuyContentsProps) {
  // 카드/지도/팝업이 공유하는 단일 fetch 결과(팝업이 별도 조회하지 않도록 상위에서 1회 조회 후 하위 전달)
  const [locations, setLocations] = useState<WhereToBuyLocation[]>([]);
  // 검색좌표(지오코딩/내위치). null 이면 검색 전 → 전체 목록 노출
  const [searchCoord, setSearchCoord] = useState<GeoCoord | null>(null);
  // 브라우저 위치 권한으로 이미 확보한 "내 위치". 길찾기 출발지로만 쓰며, 새 권한 요청은 하지 않는다.
  // null 이면 본사 주소가 출발지가 된다(기획서 항목9).
  const [myLocation, setMyLocation] = useState<GeoCoord | null>(null);
  // 선택 반경 값("500mi" 등). 기본은 최대 옵션(첫 항목)
  const [radiusValue, setRadiusValue] = useState<string>(
    whereToBuyDistanceOptions[0].value,
  );
  // "이 지역에서 검색" 영역필터. null 이면 일반(검색/반경) 모드, 값이 있으면 영역검색 모드.
  // 검색/반경 모드와 상호배타 — 셋 중 하나만 결과에 영향을 준다.
  const [boundsFilter, setBoundsFilter] = useState<WhereToBuyBoundsLiteral | null>(
    null,
  );
  const [activeId, setActiveId] = useState<string>("");
  // 활성 마커의 화면 픽셀 좌표(데스크톱 지도 위 팝업 anchor inline style 용). null 이면 CSS 폴백
  const [popupPos, setPopupPos] = useState<PopupPixel | null>(null);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [mobileView, setMobileView] = useState<WhereToBuyMobileView>(
    noDataPage ? "list" : "map",
  );

  // wheretobuy-agency-data slug 공개 대리점 목록 조회(양쪽 페이지 모두 동일하게 1회 fetch)
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

  // 반경필터 원점 — 검색좌표가 있으면 그것을, 없으면 본사(mapDefaultCenter)를 사용.
  // 지도 반경 Circle 의 중심과 반드시 같은 값이어야 원과 목록이 일치한다(기획서 항목1·2).
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

  // 영역검색 모드(boundsFilter)면 지도 영역 안의 지점만 노출, 아니면 기존 반경필터.
  // 레퍼런스(lselectricamerica) 동작: 주소 검색이 없어도 고정 기본 중심좌표(mapDefaultCenter)를
  // 원점으로 항상 반경 필터를 실행한다(반경만 바꿔도 즉시 필터링). 검색좌표가 있으면 그것을 원점으로 사용.
  const filtered = useMemo(() => {
    if (boundsFilter) {
      return filterLocationsByBounds(locations, boundsFilter);
    }
    return filterLocationsByRadius(locations, radiusOrigin, radiusMiles);
  }, [locations, radiusOrigin, radiusMiles, boundsFilter]);

  // 주소 검색/내위치 확정 — 영역검색 모드를 해제하고 일반 검색모드로 전환(상호배타)
  const handleLocate = (
    coord: GeoCoord | null,
    source: WhereToBuyLocateSource,
  ) => {
    setBoundsFilter(null);
    setSearchCoord(coord);
    // 브라우저 위치 권한으로 얻은 좌표만 길찾기 출발지로 기억한다(주소 지오코딩 결과는 "내 위치"가 아님)
    if (source === "device" && coord) {
      setMyLocation(coord);
    }
  };

  // 기획서 항목8 — 새로고침 아이콘: 필터를 기본값(Distance 500mi)으로 초기화.
  // 주소 검색어/검색좌표/영역검색 상태는 건드리지 않는다.
  const handleRefresh = () => {
    setRefreshSpin(true);
    setRadiusValue(whereToBuyDistanceOptions[0].value);
  };

  // 반경 변경 — 영역검색 모드를 해제하고 일반 반경모드로 전환(상호배타)
  const handleRadiusChange = (value: string) => {
    setBoundsFilter(null);
    setRadiusValue(value);
  };

  // "이 지역에서 검색" 클릭 — 그 시점 지도 영역으로 목록을 완전히 대체.
  // 동시에 검색좌표/반경을 기본값으로 리셋해 기존 검색·반경 필터가 더는 영향을 주지 않게 한다.
  const handleSearchArea = (bounds: WhereToBuyBoundsLiteral) => {
    setBoundsFilter(bounds);
    setSearchCoord(null);
    setRadiusValue(whereToBuyDistanceOptions[0].value);
  };

  // "실제로 검색/필터가 적용된 상태" 판단: 검색좌표가 있거나, 반경이 기본값(첫 옵션)이 아닐 때.
  // 지도는 이 값이 false(사실상 초기 상태)면 결과로 자동팬하지 않고 반경 원 전체가 보이는 뷰를 유지한다.
  // 영역검색 모드에서는 searchCoord=null·반경=기본값으로 리셋되므로 자연히 false(→ fitBounds 없이 사용자 뷰 유지).
  const isFiltered =
    searchCoord !== null || radiusValue !== whereToBuyDistanceOptions[0].value;

  // 활성 카드: 필터 결과 안에 있으면 유지, 없으면 첫 항목으로 리셋
  useEffect(() => {
    setActiveId((current) =>
      filtered.some((item) => item.id === current)
        ? current
        : (filtered[0]?.id ?? ""),
    );
  }, [filtered]);

  const activeLocation =
    filtered.find((item) => item.id === activeId) ?? filtered[0];
  const hasResults = filtered.length > 0;

  return (
    <section
      className={`support_where_to_buy_contents support_where_to_buy_contents--mobile-${mobileView}${
        noDataPage ? " support_where_to_buy_contents--no-data-page" : ""
      }`}
      id="support-where-to-buy-contents"
    >
      <div className="support_where_to_buy_contents__shell">
        <div className="support_where_to_buy_contents__list-col">
          <WhereToBuyControls
            radiusValue={radiusValue}
            onRadiusChange={handleRadiusChange}
            onLocate={handleLocate}
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
                <WhereToBuyEmpty />
              </div>
            )}
          </div>
        </div>

        <div id="store_locator_main" className="support_where_to_buy_contents__map-col">
          <WhereToBuyMap
            locations={filtered}
            activeLocation={activeLocation}
            onLocationSelect={setActiveId}
            onPopupPositionChange={setPopupPos}
            isFiltered={isFiltered}
            boundsMode={boundsFilter !== null}
            onSearchArea={handleSearchArea}
            radiusOrigin={radiusOrigin}
            radiusMiles={radiusMiles}
          />
          {activeLocation ? (
            <div
              className="support_where_to_buy_map__popup-anchor support_where_to_buy_map__popup-anchor--sample support_where_to_buy_map__popup-anchor--mobile"
              // 데스크톱 지도 위 팝업: OverlayView 로 계산한 실제 마커 픽셀좌표를 inline style 로 덮어써
              // 정적 CSS(left:50%; top:42%) 대신 마커 위치를 따라가게 한다. null(모바일/미준비)이면 CSS 폴백.
              style={
                popupPos
                  ? { left: `${popupPos.x}px`, top: `${popupPos.y}px` }
                  : undefined
              }
            >
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
