"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type {
  WhereToBuyBoundsLiteral,
  WhereToBuyLocation,
} from "@/data/support/whereToBuyContent";
import {
  hasValidCoords,
  MILES_TO_METERS,
  whereToBuyHq,
  whereToBuyHqPin,
  whereToBuyPage,
  whereToBuyRadiusCircle,
} from "@/data/support/whereToBuyContent";
import type { GeoCoord } from "@/lib/geo/distance";
import {
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "@/lib/googleMaps/loadGoogleMaps";

type PopupPixel = { x: number; y: number };

type WhereToBuyMapProps = {
  locations: WhereToBuyLocation[];
  activeLocation?: WhereToBuyLocation;
  onLocationSelect?: (locationId: string) => void;
  popupAnchorRef?: React.RefObject<HTMLDivElement | null>;
  isFiltered?: boolean;
  boundsMode?: boolean;
  onSearchArea?: (bounds: WhereToBuyBoundsLiteral) => void;
  radiusOrigin: GeoCoord;
  radiusMiles: number;
};

const mapFillStyle = {
  width: "100%",
  height: "100%",
  minHeight: "inherit",
} as const;

const MILES_PER_DEGREE_LAT = 69;

// circle.getBounds()는 setCenter/setRadius 직후 동기적으로 최신값을 보장하지 않으므로
// (Circle 내부 캐시 재계산 타이밍 문제) 원점+반경으로 bounds를 직접 계산한다.
function computeRadiusBounds(
  maps: typeof google.maps,
  origin: GeoCoord,
  radiusMiles: number,
): google.maps.LatLngBounds {
  const latDelta = radiusMiles / MILES_PER_DEGREE_LAT;
  const lngDelta =
    radiusMiles / (MILES_PER_DEGREE_LAT * Math.cos((origin.lat * Math.PI) / 180));
  const bounds = new maps.LatLngBounds();
  bounds.extend({ lat: origin.lat - latDelta, lng: origin.lng - lngDelta });
  bounds.extend({ lat: origin.lat + latDelta, lng: origin.lng + lngDelta });
  return bounds;
}

export default function WhereToBuyMap({
  locations,
  activeLocation,
  onLocationSelect,
  popupAnchorRef,
  isFiltered = false,
  boundsMode = false,
  onSearchArea,
  radiusOrigin,
  radiusMiles,
}: WhereToBuyMapProps) {
  const apiKey = getGoogleMapsApiKey();
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const hqMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const radiusOriginRef = useRef(radiusOrigin);
  const radiusMilesRef = useRef(radiusMiles);
  const boundsModeRef = useRef(boundsMode);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const popupPositionRafIdRef = useRef<number | null>(null);
  const activeLocationRef = useRef<WhereToBuyLocation | undefined>(activeLocation);
  const popupAnchorRefHolder = useRef(popupAnchorRef);
  const lastPopupPosRef = useRef<PopupPixel | null>(null);
  const onSearchAreaRef = useRef(onSearchArea);
  const onLocationSelectRef = useRef(onLocationSelect);
  const [showAreaButton, setShowAreaButton] = useState(false);
  const showAreaButtonRef = useRef(false);
  const suppressUserMoveRef = useRef(false);
  const pendingPopupRevealRef = useRef(false);
  const prevLocationsRef = useRef<WhereToBuyLocation[] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  activeLocationRef.current = activeLocation;
  popupAnchorRefHolder.current = popupAnchorRef;
  onSearchAreaRef.current = onSearchArea;
  onLocationSelectRef.current = onLocationSelect;
  radiusOriginRef.current = radiusOrigin;
  radiusMilesRef.current = radiusMiles;
  boundsModeRef.current = boundsMode;

  const updateShowAreaButton = (next: boolean) => {
    if (showAreaButtonRef.current === next) return;
    showAreaButtonRef.current = next;
    setShowAreaButton(next);
  };

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
    updateShowAreaButton(false);
  };

  const clearPopupPositionRef = useRef<() => void>(() => {});
  clearPopupPositionRef.current = () => {
    const el = popupAnchorRefHolder.current?.current;
    if (el && lastPopupPosRef.current !== null) {
      el.style.left = "";
      el.style.top = "";
    }
    lastPopupPosRef.current = null;
  };

  const updatePopupPositionRef = useRef<() => void>(() => {});
  updatePopupPositionRef.current = () => {
    const el = popupAnchorRefHolder.current?.current;
    if (!el) {
      lastPopupPosRef.current = null;
      return;
    }
    const map = mapRef.current;
    const overlay = overlayRef.current;
    const loc = activeLocationRef.current;
    if (!map || !overlay || !loc || !hasValidCoords(loc) || !window.google?.maps) {
      clearPopupPositionRef.current();
      return;
    }
    const projection = overlay.getProjection();
    if (!projection) {
      return;
    }
    const point = projection.fromLatLngToContainerPixel(
      new window.google.maps.LatLng(loc.lat, loc.lng),
    );
    if (!point) {
      return;
    }
    const last = lastPopupPosRef.current;
    if (last && last.x === point.x && last.y === point.y) {
      return;
    }
    lastPopupPosRef.current = { x: point.x, y: point.y };
    el.style.left = `${point.x}px`;
    el.style.top = `${point.y}px`;
  };

  const drawMarkersRef = useRef<() => void>(() => {});
  drawMarkersRef.current = () => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) {
      return;
    }
    const maps = window.google.maps;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    locations.filter(hasValidCoords).forEach((location) => {
      const isActive = location.id === activeLocation?.id;

      const marker = new maps.Marker({
        map,
        position: { lat: location.lat, lng: location.lng },
        title: location.name,
        zIndex: isActive ? 3 : 1,
        icon: {
          url: whereToBuyPage.mapPinImage,
          scaledSize: new maps.Size(24, 34),
          anchor: new maps.Point(12, 34),
        },
      });

      marker.addListener("click", () => {
        onLocationSelect?.(location.id);
      });

      markersRef.current.push(marker);
    });

    hqMarkerRef.current?.setMap(map);
    circleRef.current?.setMap(map);
  };

  // 현재 필터 상태에 맞춰 카메라(줌/중심)를 다시 맞춘다.
  // 컨테이너가 display:none 이었다가 다시 보일 때(모바일 View Map 전환) 재호출한다.
  const recenterCameraRef = useRef<() => void>(() => {});
  recenterCameraRef.current = () => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;
    const maps = window.google.maps;
    const mappable = locations.filter(hasValidCoords);

    if (!boundsModeRef.current) {
      // 반경필터 모드: 반경 원 전체에 맞춘다.
      suppressUserMoveRef.current = true;
      map.fitBounds(
        computeRadiusBounds(
          maps,
          radiusOriginRef.current,
          radiusMilesRef.current,
        ),
      );
    } else if (mappable.length >= 1) {
      // 영역/텍스트 검색 모드: 실제 매칭 지점 기준으로 맞춘다.
      const bounds = new maps.LatLngBounds();
      mappable.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      suppressUserMoveRef.current = true;
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (!apiKey || !mapCanvasRef.current) {
      clearPopupPositionRef.current();
      return;
    }

    let cancelled = false;
    let listeners: google.maps.MapsEventListener[] = [];

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapCanvasRef.current) {
          return;
        }

        suppressUserMoveRef.current = true;

        const map = new maps.Map(mapCanvasRef.current, {
          center: whereToBuyPage.mapDefaultCenter,
          zoom: whereToBuyPage.mapDefaultZoom,
          disableDefaultUI: true,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
          streetViewControl: false,
          gestureHandling: "greedy",
        });

        mapRef.current = map;

        hqMarkerRef.current = new maps.Marker({
          map,
          position: { lat: whereToBuyHq.lat, lng: whereToBuyHq.lng },
          title: whereToBuyHq.name,
          zIndex: whereToBuyHqPin.zIndex,
          icon: {
            url: whereToBuyPage.mapBrandPinImage,
            scaledSize: new maps.Size(
              whereToBuyHqPin.width,
              whereToBuyHqPin.height,
            ),
            anchor: new maps.Point(
              whereToBuyHqPin.width / 2,
              whereToBuyHqPin.height,
            ),
          },
        });

        circleRef.current = new maps.Circle({
          map,
          center: radiusOriginRef.current,
          radius: radiusMilesRef.current * MILES_TO_METERS,
          clickable: false,
          strokeColor: whereToBuyRadiusCircle.strokeColor,
          strokeOpacity: whereToBuyRadiusCircle.strokeOpacity,
          strokeWeight: whereToBuyRadiusCircle.strokeWeight,
          fillColor: whereToBuyRadiusCircle.fillColor,
          fillOpacity: whereToBuyRadiusCircle.fillOpacity,
          visible: !boundsModeRef.current,
        });

        const overlay = new maps.OverlayView();
        overlay.onAdd = () => {};
        overlay.draw = () => {};
        overlay.onRemove = () => {};
        overlay.setMap(map);
        overlayRef.current = overlay;

        const scheduleUpdatePopupPosition = () => {
          if (popupPositionRafIdRef.current !== null) return;
          popupPositionRafIdRef.current = window.requestAnimationFrame(() => {
            popupPositionRafIdRef.current = null;
            updatePopupPositionRef.current();
          });
        };

        listeners = [
          map.addListener("idle", () => {
            updatePopupPositionRef.current();
            if (pendingPopupRevealRef.current) {
              pendingPopupRevealRef.current = false;
              popupAnchorRefHolder.current?.current?.classList.add("is-visible");
            }
          }),
          map.addListener("bounds_changed", scheduleUpdatePopupPosition),
          map.addListener("center_changed", scheduleUpdatePopupPosition),
          map.addListener("zoom_changed", () => updatePopupPositionRef.current()),
          map.addListener("click", () => {
            onLocationSelectRef.current?.("");
          }),
        ];

        listeners.push(
          map.addListener("idle", () => {
            suppressUserMoveRef.current = false;
          }),
        );

        listeners.push(
          map.addListener("dragend", () => {
            updateShowAreaButton(true);
          }),
        );

        listeners.push(
          map.addListener("zoom_changed", () => {
            if (suppressUserMoveRef.current) return;
            updateShowAreaButton(true);
          }),
        );

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
      if (popupPositionRafIdRef.current !== null) {
        window.cancelAnimationFrame(popupPositionRafIdRef.current);
        popupPositionRafIdRef.current = null;
      }
      overlayRef.current?.setMap(null);
      overlayRef.current = null;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      hqMarkerRef.current?.setMap(null);
      hqMarkerRef.current = null;
      circleRef.current?.setMap(null);
      circleRef.current = null;
      mapRef.current = null;
      prevLocationsRef.current = null;
      lastPopupPosRef.current = null;
      showAreaButtonRef.current = false;
      setShowAreaButton(false);
      setMapReady(false);
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps) {
      return;
    }
    drawMarkersRef.current();
  }, [locations, activeLocation, mapReady]);

  // 지도 컨테이너가 숨겨졌다(display:none) 다시 보일 때 처리.
  // 모바일에서 View List 상태로 mi(반경) 셀렉트를 바꾸면 0px 상태에서 fitBounds가
  // 실행돼 지도가 축소된 채로 남는다. 다시 보이는 순간 resize 후 카메라를 재정렬한다.
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!mapReady || !canvas || typeof ResizeObserver === "undefined") {
      return;
    }

    let collapsed = canvas.offsetWidth === 0 || canvas.offsetHeight === 0;
    const observer = new ResizeObserver(() => {
      const hidden = canvas.offsetWidth === 0 || canvas.offsetHeight === 0;
      if (hidden) {
        collapsed = true;
        return;
      }
      if (!collapsed) return;
      collapsed = false;

      const map = mapRef.current;
      if (!map || !window.google?.maps) return;
      window.google.maps.event.trigger(map, "resize");
      recenterCameraRef.current();
      updatePopupPositionRef.current();
    });
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [mapReady]);

  useLayoutEffect(() => {
    if (!mapReady) {
      return;
    }
    updatePopupPositionRef.current();
  }, [activeLocation, mapReady]);

  useEffect(() => {
    const circle = circleRef.current;
    if (!mapReady || !circle) {
      return;
    }
    if (boundsMode) {
      circle.setVisible(false);
      return;
    }
    circle.setVisible(true);
    circle.setCenter(radiusOrigin);
    circle.setRadius(radiusMiles * MILES_TO_METERS);
  }, [radiusOrigin, radiusMiles, boundsMode, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !window.google?.maps) {
      return;
    }

    const maps = window.google.maps;
    const locationsChanged = prevLocationsRef.current !== locations;
    prevLocationsRef.current = locations;

    if (locationsChanged) {
      updateShowAreaButton(false);
    }

    const mappable = locations.filter(hasValidCoords);

    if (locationsChanged && !boundsMode) {
      // 반경필터 모드(검색 전 초기 상태 포함): 결과 건수와 무관하게 항상 반경 원 전체에 맞춰 카메라를 맞춘다.
      const circleBounds = computeRadiusBounds(
        maps,
        radiusOriginRef.current,
        radiusMilesRef.current,
      );
      suppressUserMoveRef.current = true;
      map.fitBounds(circleBounds);
    } else if (isFiltered && boundsMode && locationsChanged && mappable.length >= 1) {
      // 영역검색(지도 드래그 후 "이 지역에서 검색") 모드: 반경 원 개념이 없으므로 실제 매칭 지점 기준으로 맞춘다.
      suppressUserMoveRef.current = true;
      const bounds = new maps.LatLngBounds();
      mappable.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }

    const skipAutoPan = boundsMode && locationsChanged;
    if (activeLocation && hasValidCoords(activeLocation)) {
      if (skipAutoPan) {
        popupAnchorRefHolder.current?.current?.classList.add("is-visible");
      } else {
        suppressUserMoveRef.current = true;
        popupAnchorRefHolder.current?.current?.classList.remove("is-visible");
        pendingPopupRevealRef.current = true;
        map.panTo({ lat: activeLocation.lat, lng: activeLocation.lng });
      }
    }
  }, [locations, activeLocation, isFiltered, boundsMode, mapReady]);

  if (!apiKey || mapError) {
    return (
      <div
        className="support_where_to_buy_map support_where_to_buy_map--placeholder"
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
        data-lenis-prevent-wheel
      />
      {/*
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
      */}
    </div>
  );
}
