"use client";

import { useEffect, useRef, useState } from "react";
import type { WhereToBuyLocation } from "@/data/support/whereToBuyContent";
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
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 최신 활성 위치/콜백을 리스너가 참조할 수 있도록 렌더마다 ref 동기화
  activeLocationRef.current = activeLocation;
  onPopupPositionChangeRef.current = onPopupPositionChange;

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

  useEffect(() => {
    if (usePlaceholder || !apiKey || !mapCanvasRef.current) {
      // 모바일 플레이스홀더 등 지도 미생성 상태에서는 데스크톱 팝업 좌표를 해제
      onPopupPositionChangeRef.current?.(null);
      return;
    }

    let cancelled = false;
    // 지도 이동 리스너 핸들(정리 시 해제)
    let listeners: google.maps.MapsEventListener[] = [];

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

        // 실제 검색/필터가 적용된 상태에서만 결과 범위로 fitBounds. 초기/미필터 상태에서는
        // 원래 퍼블리싱된 mapDefaultCenter/mapDefaultZoom(Figma 기준값) 뷰를 그대로 유지한다.
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
    };
  }, [apiKey, locations, usePlaceholder, isFiltered]);

  useEffect(() => {
    if (usePlaceholder) {
      return;
    }

    const map = mapRef.current;
    if (!mapReady || !map || !window.google?.maps) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const maps = window.google.maps;

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

    // 활성 위치가 유효 좌표일 때만 지도 이동(좌표 없는 카드 선택 시 (0,0) 이동 방지)
    if (activeLocation && hasValidCoords(activeLocation)) {
      map.panTo({ lat: activeLocation.lat, lng: activeLocation.lng });
      map.setZoom(whereToBuyPage.mapActiveZoom);
    }

    // 활성 위치 변경 즉시 팝업 픽셀좌표 재계산(지도 이동이 없더라도 갱신)
    updatePopupPositionRef.current();
  }, [activeLocation, locations, mapReady, onLocationSelect, usePlaceholder]);

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
    </div>
  );
}
