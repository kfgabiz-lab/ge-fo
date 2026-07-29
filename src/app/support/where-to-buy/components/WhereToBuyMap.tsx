"use client";

import { useEffect, useRef, useState } from "react";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { GeoCoord } from "@/lib/geo/distance";
import {
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "@/lib/googleMaps/loadGoogleMaps";
import WhereToBuyMapPlaceholder from "./WhereToBuyMapPlaceholder";

export type PopupPixel = { x: number; y: number };

type WhereToBuyMapProps = {
  locations: WhereToBuyLocation[];
  activeLocation?: WhereToBuyLocation;
  onLocationSelect?: (locationId: string) => void;
  onPopupPositionChange?: (pos: PopupPixel | null) => void;
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

const MOBILE_MAP_MQ = "(max-width: 780px)";

export default function WhereToBuyMap({
  locations,
  activeLocation,
  onLocationSelect,
  onPopupPositionChange,
  isFiltered = false,
  boundsMode = false,
  onSearchArea,
  radiusOrigin,
  radiusMiles,
}: WhereToBuyMapProps) {
  const apiKey = getGoogleMapsApiKey();
  const usePlaceholder = useMediaQuery(MOBILE_MAP_MQ);
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
  const onPopupPositionChangeRef = useRef(onPopupPositionChange);
  const onSearchAreaRef = useRef(onSearchArea);
  const [showAreaButton, setShowAreaButton] = useState(false);
  const suppressUserMoveRef = useRef(false);
  const prevLocationsRef = useRef<WhereToBuyLocation[] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  activeLocationRef.current = activeLocation;
  onPopupPositionChangeRef.current = onPopupPositionChange;
  onSearchAreaRef.current = onSearchArea;
  radiusOriginRef.current = radiusOrigin;
  radiusMilesRef.current = radiusMiles;
  boundsModeRef.current = boundsMode;

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
      return;
    }
    const point = projection.fromLatLngToContainerPixel(
      new window.google.maps.LatLng(loc.lat, loc.lng),
    );
    if (point) {
      notify?.({ x: point.x, y: point.y });
    }
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

  useEffect(() => {
    if (usePlaceholder || !apiKey || !mapCanvasRef.current) {
      onPopupPositionChangeRef.current?.(null);
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
          map.addListener("idle", () => updatePopupPositionRef.current()),
          map.addListener("bounds_changed", scheduleUpdatePopupPosition),
          map.addListener("center_changed", scheduleUpdatePopupPosition),
          map.addListener("zoom_changed", () => updatePopupPositionRef.current()),
        ];

        listeners.push(
          map.addListener("idle", () => {
            suppressUserMoveRef.current = false;
          }),
        );

        listeners.push(
          map.addListener("dragend", () => {
            setShowAreaButton(true);
          }),
        );

        listeners.push(
          map.addListener("zoom_changed", () => {
            if (suppressUserMoveRef.current) return;
            setShowAreaButton(true);
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
      setMapReady(false);
    };
  }, [apiKey, usePlaceholder]);

  useEffect(() => {
    if (usePlaceholder) {
      return;
    }
    if (!mapReady || !mapRef.current || !window.google?.maps) {
      return;
    }
    drawMarkersRef.current();
    updatePopupPositionRef.current();
  }, [locations, activeLocation, mapReady, usePlaceholder]);

  useEffect(() => {
    if (usePlaceholder) {
      return;
    }
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
  }, [radiusOrigin, radiusMiles, boundsMode, mapReady, usePlaceholder]);

  useEffect(() => {
    if (usePlaceholder) {
      return;
    }
    const map = mapRef.current;
    if (!mapReady || !map || !window.google?.maps) {
      return;
    }

    const maps = window.google.maps;
    const locationsChanged = prevLocationsRef.current !== locations;
    prevLocationsRef.current = locations;

    if (locationsChanged) {
      setShowAreaButton(false);
    }

    const mappable = locations.filter(hasValidCoords);

    if (locationsChanged && !isFiltered && !boundsMode) {
      const circleBounds = circleRef.current?.getBounds();
      if (circleBounds) {
        suppressUserMoveRef.current = true;
        map.fitBounds(circleBounds);
      }
      return;
    }

    if (isFiltered && mappable.length > 1 && locationsChanged) {
      suppressUserMoveRef.current = true;
      const bounds = new maps.LatLngBounds();
      mappable.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }

    const skipAutoPan = boundsMode && locationsChanged;
    if (!skipAutoPan && activeLocation && hasValidCoords(activeLocation)) {
      suppressUserMoveRef.current = true;
      map.panTo({ lat: activeLocation.lat, lng: activeLocation.lng });
      map.setZoom(whereToBuyPage.mapActiveZoom);
    }
  }, [
    locations,
    activeLocation,
    isFiltered,
    boundsMode,
    mapReady,
    usePlaceholder,
  ]);

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
