"use client";

import { useEffect, useRef, useState } from "react";
import type {
  WhereToBuyBoundsLiteral,
  WhereToBuyLocation,
} from "@/data/support/whereToBuyContent";
import {
  hasValidCoords,
  whereToBuyPage,
} from "@/data/support/whereToBuyContent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "@/lib/googleMaps/loadGoogleMaps";
import WhereToBuyMapPlaceholder from "./WhereToBuyMapPlaceholder";

/** 활성 마커의 지도 컨테이너 기준 화면 픽셀 좌표(팝업 anchor inline style 용) */
export type PopupPixel = { x: number; y: number };

type WhereToBuyMapProps = {
  locations: WhereToBuyLocation[];
  // 로딩 초기(데이터 도착 전)에는 활성 위치가 없을 수 있음
  activeLocation?: WhereToBuyLocation;
  onLocationSelect?: (locationId: string) => void;
  /**
   * 활성 마커의 화면 픽셀 좌표 변경 콜백.
   * - OverlayView 투영으로 계산한 지도 컨테이너 기준 (x, y) 를 상위로 올려
   *   팝업 anchor 의 inline style(left/top) 에 그대로 적용한다.
   * - 계산 불가(투영 미준비/좌표 없음/모바일 플레이스홀더)면 null.
   */
  onPopupPositionChange?: (pos: PopupPixel | null) => void;
  /**
   * 실제로 검색/필터가 적용된 상태인지 여부(상위 Contents에서 판단해 전달).
   * - true  → 필터 결과 범위에 맞춰 fitBounds 로 지도를 재계산
   * - false → 초기/미필터 상태이므로 퍼블리싱된 mapDefaultCenter/mapDefaultZoom 뷰를 그대로 유지
   */
  isFiltered?: boolean;
  /**
   * "이 지역에서 검색" 영역필터 모드 여부.
   * - true 이면 목록 갱신으로 지도가 재생성될 때 fitBounds/자동팬을 하지 않고,
   *   사용자가 마지막으로 보던 카메라(중심/줌)를 그대로 복원한다(사용자가 보던 화면 유지).
   */
  boundsMode?: boolean;
  /**
   * "이 지역에서 검색" 버튼 클릭 콜백.
   * - 클릭 시점 지도의 getBounds() 를 {north,south,east,west} 단순객체로 변환해 상위로 전달.
   * - 상위(Contents)는 이 영역으로 목록을 갈아끼운다(기존 검색/반경 필터 대체).
   */
  onSearchArea?: (bounds: WhereToBuyBoundsLiteral) => void;
};

const mapFillStyle = {
  width: "100%",
  height: "100%",
  minHeight: "inherit",
} as const;

// 모바일에서는 지도 대신 회색 플레이스홀더 노출 (780px 이하)
const MOBILE_MAP_MQ = "(max-width: 780px)";

export default function WhereToBuyMap({
  locations,
  activeLocation,
  onLocationSelect,
  onPopupPositionChange,
  isFiltered = false,
  boundsMode = false,
  onSearchArea,
}: WhereToBuyMapProps) {
  const apiKey = getGoogleMapsApiKey();
  const usePlaceholder = useMediaQuery(MOBILE_MAP_MQ);
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  // 팝업 픽셀좌표 계산용 OverlayView + 활성 위치/콜백 최신값 참조
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const activeLocationRef = useRef<WhereToBuyLocation | undefined>(activeLocation);
  const onPopupPositionChangeRef = useRef(onPopupPositionChange);
  const onSearchAreaRef = useRef(onSearchArea);
  // 사용자가 지도를 이동/줌한 뒤에만 노출되는 "이 지역에서 검색" 버튼 표시 여부
  const [showAreaButton, setShowAreaButton] = useState(false);
  // 프로그램적 카메라 이동(fitBounds/panTo/setZoom/초기뷰)으로 발생한 zoom_changed 를
  // 사용자 조작으로 오인하지 않도록 잠그는 플래그. 이동 시작 전 true, idle 에서 해제.
  const suppressUserMoveRef = useRef(false);
  // 마지막 사용자 뷰(중심/줌) — boundsMode 재생성 시 이 값으로 카메라를 복원(뷰 유지)
  const lastCameraRef = useRef<{ lat: number; lng: number; zoom: number } | null>(
    null,
  );
  // boundsMode 로 지도가 막 재생성됐을 때, 직후 1회의 활성마커 자동팬을 건너뛰기 위한 플래그
  const skipNextAutoPanRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 최신 활성 위치/콜백을 리스너가 참조할 수 있도록 렌더마다 ref 동기화
  activeLocationRef.current = activeLocation;
  onPopupPositionChangeRef.current = onPopupPositionChange;
  onSearchAreaRef.current = onSearchArea;

  // "이 지역에서 검색" 클릭 — 현재 지도 뷰포트를 단순객체로 변환해 상위로 올리고 버튼을 숨긴다.
  const handleSearchArea = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    onSearchAreaRef.current?.({
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
    });
    setShowAreaButton(false);
  };

  // 활성 마커의 화면 픽셀 좌표를 계산해 상위 콜백으로 전달(지도 이동 리스너/활성 변경에서 호출)
  const updatePopupPositionRef = useRef<() => void>(() => {});
  updatePopupPositionRef.current = () => {
    const map = mapRef.current;
    const overlay = overlayRef.current;
    const loc = activeLocationRef.current;
    const notify = onPopupPositionChangeRef.current;
    if (!map || !overlay || !loc || !hasValidCoords(loc) || !window.google?.maps) {
      notify?.(null);
      return;
    }
    const projection = overlay.getProjection();
    if (!projection) {
      // 아직 투영 미준비 — 준비되면 idle 리스너가 다시 호출한다.
      return;
    }
    const point = projection.fromLatLngToContainerPixel(
      new window.google.maps.LatLng(loc.lat, loc.lng),
    );
    if (point) {
      notify?.({ x: point.x, y: point.y });
    }
  };

  // 마커 렌더 함수(렌더마다 최신 locations/activeLocation/onLocationSelect 캡처).
  // - 항상 "현재 mapRef.current" 에 마커를 붙인다. 호출 시점에 mapRef 가 새 지도를
  //   가리키고 있어야 하므로, 지도 생성 콜백(.then) 내부와 mapReady 기반 effect 에서만 호출한다.
  const drawMarkersRef = useRef<() => void>(() => {});
  drawMarkersRef.current = () => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) {
      return;
    }
    const maps = window.google.maps;

    // 이전 마커 제거 후 재생성(활성 마커 zIndex 반영을 위해 전량 재그림)
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 좌표 가드: 유효 좌표 레코드만 마커 생성(0/빈값 좌표 제외)
    locations.filter(hasValidCoords).forEach((location) => {
      const isActive = location.id === activeLocation?.id;
      const isBrand = Boolean(location.brandPin);
      const iconUrl = isBrand
        ? whereToBuyPage.mapBrandPinImage
        : whereToBuyPage.mapPinImage;

      const marker = new maps.Marker({
        map,
        position: { lat: location.lat, lng: location.lng },
        title: location.name,
        zIndex: isActive ? 3 : 1,
        icon: {
          url: iconUrl,
          scaledSize: new maps.Size(isBrand ? 34 : 24, isBrand ? 48 : 34),
          anchor: new maps.Point(isBrand ? 17 : 12, isBrand ? 48 : 34),
        },
      });

      marker.addListener("click", () => {
        onLocationSelect?.(location.id);
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (usePlaceholder || !apiKey || !mapCanvasRef.current) {
      // 모바일 플레이스홀더 등 지도 미생성 상태에서는 데스크톱 팝업 좌표를 해제
      onPopupPositionChangeRef.current?.(null);
      return;
    }

    let cancelled = false;
    // 지도 이동 리스너 핸들(정리 시 해제)
    let listeners: google.maps.MapsEventListener[] = [];

    // 지도가 재생성될 때마다 이전 상태의 "이 지역에서 검색" 버튼을 숨긴다
    // (새 검색/새 영역검색이 반영된 직후엔 버튼이 떠 있으면 안 됨).
    setShowAreaButton(false);
    // 이번 재생성이 boundsMode 이면 직후 1회 활성마커 자동팬을 건너뛴다(사용자 뷰 유지).
    skipNextAutoPanRef.current = boundsMode;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapCanvasRef.current) {
          return;
        }

        // 좌표 가드: 0/빈값/NaN 좌표 레코드는 bounds 계산에서 제외(지도가 (0,0)으로 튀지 않도록)
        const mappable = locations.filter(hasValidCoords);
        const bounds = new maps.LatLngBounds();
        mappable.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });

        // boundsMode(영역검색) 재생성이면 사용자가 마지막으로 보던 카메라로 복원,
        // 그 외에는 퍼블리싱된 기본 중심/줌으로 시작한다.
        const restore =
          boundsMode && lastCameraRef.current ? lastCameraRef.current : null;

        // 초기 카메라 세팅(constructor)으로 인한 zoom_changed 를 사용자 조작으로 오인하지 않도록 잠근다.
        suppressUserMoveRef.current = true;

        const map = new maps.Map(mapCanvasRef.current, {
          center: restore
            ? { lat: restore.lat, lng: restore.lng }
            : whereToBuyPage.mapDefaultCenter,
          zoom: restore ? restore.zoom : whereToBuyPage.mapDefaultZoom,
          disableDefaultUI: true,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
          streetViewControl: false,
          gestureHandling: "greedy",
        });

        // 실제 검색/필터가 적용된 상태에서만 결과 범위로 fitBounds. 초기/미필터/영역검색 상태에서는
        // fitBounds 하지 않는다(영역검색은 위에서 사용자 뷰를 복원하므로 카메라를 다시 움직이면 안 됨).
        if (isFiltered && mappable.length > 1) {
          map.fitBounds(bounds);
        }

        mapRef.current = map;

        // 팝업 픽셀좌표 계산용 OverlayView 부착(마커 위치 추적 전용, 그리기는 없음)
        const overlay = new maps.OverlayView();
        overlay.onAdd = () => {};
        overlay.draw = () => {};
        overlay.onRemove = () => {};
        overlay.setMap(map);
        overlayRef.current = overlay;

        // 지도가 움직일 때마다 팝업 픽셀좌표 재계산
        listeners = [
          "idle",
          "bounds_changed",
          "center_changed",
          "zoom_changed",
        ].map((eventName) =>
          map.addListener(eventName, () => updatePopupPositionRef.current()),
        );

        // idle: 이동이 멈춘 시점 — 프로그램적 이동 잠금 해제 + 현재 카메라를 저장(뷰 복원 소스).
        listeners.push(
          map.addListener("idle", () => {
            suppressUserMoveRef.current = false;
            const center = map.getCenter();
            const zoom = map.getZoom();
            if (center && typeof zoom === "number") {
              lastCameraRef.current = {
                lat: center.lat(),
                lng: center.lng(),
                zoom,
              };
            }
          }),
        );

        // dragend: 프로그램적 panTo 는 dragend 를 발생시키지 않으므로 항상 실제 사용자 드래그 → 버튼 노출.
        listeners.push(
          map.addListener("dragend", () => {
            setShowAreaButton(true);
          }),
        );

        // zoom_changed: 프로그램적 이동(잠금 중)이 아니면 사용자 줌 → 버튼 노출.
        listeners.push(
          map.addListener("zoom_changed", () => {
            if (suppressUserMoveRef.current) return;
            setShowAreaButton(true);
          }),
        );

        // ⚠️ 레이스 컨디션 방지 핵심:
        // 방금 만든 새 지도(mapRef.current) 에 곧바로 마커를 그린다. 마커 생성 시점의
        // mapRef 가 항상 "화면에 실제로 붙는 새 지도"임을 이 콜백이 보장한다.
        drawMarkersRef.current();

        // 재생성 직후 활성마커 자동팬. boundsMode 재생성 직후 1회는 건너뛴다("이 지역에서 검색"
        // 카메라 고정). skipNextAutoPanRef 의 유일한 소비 지점을 이 콜백으로 고정해,
        // 두 번째 effect(옛 지도에 대해 먼저 실행될 수 있음)가 플래그를 먼저 소비해 새 지도가
        // 튀는 문제를 원천 차단한다.
        if (skipNextAutoPanRef.current) {
          skipNextAutoPanRef.current = false;
        } else {
          const active = activeLocationRef.current;
          if (active && hasValidCoords(active)) {
            suppressUserMoveRef.current = true;
            map.panTo({ lat: active.lat, lng: active.lng });
            map.setZoom(whereToBuyPage.mapActiveZoom);
          }
        }

        // 새 지도/마커 기준 팝업 픽셀좌표 재계산
        updatePopupPositionRef.current();

        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(true);
        }
      });

    return () => {
      cancelled = true;
      listeners.forEach((listener) => listener.remove());
      listeners = [];
      overlayRef.current?.setMap(null);
      overlayRef.current = null;
      // 옛 지도의 마커를 반드시 제거(메모리 누수/유령 마커 방지). 새 지도의 마커는
      // 위 .then() 의 drawMarkersRef 호출로 다시 생성된다.
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [apiKey, locations, usePlaceholder, isFiltered, boundsMode]);

  // 활성 위치 변경(및 최초 지도 준비) 전담 effect.
  // - 마커의 최초 생성/locations 변경 반영은 지도 생성 .then() 콜백이 담당한다.
  // - 이 effect 는 "지도가 이미 준비된 상태에서 activeLocation 이 바뀐 경우"의 마커 재그림
  //   (활성 zIndex 갱신) + 활성마커 자동팬 + 팝업 좌표 갱신만 담당한다.
  useEffect(() => {
    if (usePlaceholder) {
      return;
    }

    const map = mapRef.current;
    if (!mapReady || !map || !window.google?.maps) {
      // 지도가 아직 없거나 재생성 중이면 아무것도 하지 않는다(옛 지도 조작 방지).
      return;
    }

    // 활성 위치 변경에 따른 마커 재그림(활성 zIndex 반영)
    drawMarkersRef.current();

    // 활성 위치가 유효 좌표일 때만 지도 이동(좌표 없는 카드 선택 시 (0,0) 이동 방지).
    // ⚠️ skipNextAutoPanRef 는 여기서 "소비하지 않고 확인만" 한다. 실제 소비/해제는
    //    지도 생성 .then() 콜백이 전담한다 — 이 effect 가 옛 지도에 대해 먼저 실행돼
    //    플래그를 소비해버리면 새 지도가 튀는 회귀가 생기므로 소비 지점을 한 곳으로 고정.
    if (!skipNextAutoPanRef.current && activeLocation && hasValidCoords(activeLocation)) {
      // 이 panTo/setZoom 은 프로그램적 이동 → 발생하는 zoom_changed 를 사용자 조작으로 오인하지 않도록 잠근다.
      suppressUserMoveRef.current = true;
      map.panTo({ lat: activeLocation.lat, lng: activeLocation.lng });
      map.setZoom(whereToBuyPage.mapActiveZoom);
    }

    // 활성 위치 변경 즉시 팝업 픽셀좌표 재계산(지도 이동이 없더라도 갱신)
    updatePopupPositionRef.current();
  }, [activeLocation, mapReady, usePlaceholder]);

  if (usePlaceholder) {
    return (
      <WhereToBuyMapPlaceholder
        ariaLabel={`Map showing distributor locations near ${activeLocation?.name ?? ""}`}
      />
    );
  }

  if (!apiKey || mapError) {
    return (
      <div
        style={mapFillStyle}
        role="img"
        aria-label={`Map showing distributor locations near ${activeLocation?.name ?? ""}`}
      />
    );
  }

  return (
    <div className="support_where_to_buy_map" style={mapFillStyle}>
      <div
        ref={mapCanvasRef}
        className="support_where_to_buy_map__canvas"
        style={mapFillStyle}
        role="application"
        aria-label={`Map showing distributor locations near ${activeLocation?.name ?? ""}`}
      />
      {/* 사용자가 지도를 이동/줌한 뒤에만 노출 — 클릭 시 현재 영역 기준으로 목록을 갈아끼운다 */}
      {mapReady && showAreaButton ? (
        <button
          type="button"
          className="support_where_to_buy_map__area-search"
          onClick={handleSearchArea}
        >
          <span
            className="support_where_to_buy_map__area-search-icon"
            aria-hidden
          />
          Search this area
        </button>
      ) : null}
    </div>
  );
}
