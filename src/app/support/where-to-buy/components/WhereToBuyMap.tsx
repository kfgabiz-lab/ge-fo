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
   * - true  → 필터 결과 범위에 맞춰 fitBounds + 활성마커 자동팬
   * - false → 초기/미필터 상태이므로 자동팬 없이 반경 원 전체가 보이도록 맞춘다(기획서 항목1)
   */
  isFiltered?: boolean;
  /**
   * "이 지역에서 검색" 영역필터 모드 여부.
   * - true 이면 목록이 영역검색으로 갈아끼워질 때 fitBounds/자동팬을 하지 않고,
   *   사용자가 보던 카메라(중심/줌)를 그대로 둔다(사용자가 보던 화면 유지).
   */
  boundsMode?: boolean;
  /**
   * "이 지역에서 검색" 버튼 클릭 콜백.
   * - 클릭 시점 지도의 getBounds() 를 {north,south,east,west} 단순객체로 변환해 상위로 전달.
   * - 상위(Contents)는 이 영역으로 목록을 갈아끼운다(기존 검색/반경 필터 대체).
   */
  onSearchArea?: (bounds: WhereToBuyBoundsLiteral) => void;
  /**
   * 반경 Circle 오버레이 중심 = 현재 반경필터 원점(검색좌표 또는 본사 기본중심).
   * 상위 Contents 의 목록 필터 원점과 동일한 값이어야 원과 목록이 일치한다(기획서 항목2).
   */
  radiusOrigin: GeoCoord;
  /** 선택된 반경(mile). Distance 필터 변경 시 이 값만 바뀌고 Circle 인스턴스는 재사용된다(기획서 항목7) */
  radiusMiles: number;
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
  radiusOrigin,
  radiusMiles,
}: WhereToBuyMapProps) {
  const apiKey = getGoogleMapsApiKey();
  const usePlaceholder = useMediaQuery(MOBILE_MAP_MQ);
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  // 본사(HQ) 고정 마커 — locations 마커(markersRef)와 **완전히 분리**된 별도 참조.
  // drawMarkers 가 markersRef 만 전량 제거/재생성하므로 결과 0건이어도 이 마커는 지도에 남는다(기획서 항목3).
  const hqMarkerRef = useRef<google.maps.Marker | null>(null);
  // 반경 Circle 오버레이 — 최초 1회만 생성하고 이후 setCenter/setRadius 로만 갱신(마커와 동일 수명주기 원칙)
  const circleRef = useRef<google.maps.Circle | null>(null);
  // Effect A(지도 생성)는 radiusOrigin/radiusMiles/boundsMode 에 의존하지 않아야 하므로 최신값을 ref 로 참조
  const radiusOriginRef = useRef(radiusOrigin);
  const radiusMilesRef = useRef(radiusMiles);
  const boundsModeRef = useRef(boundsMode);
  // 팝업 픽셀좌표 계산용 OverlayView + 활성 위치/콜백 최신값 참조
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  // bounds_changed/center_changed 는 드래그 중 마우스 이동마다 발생해 rAF 로 프레임당 1회로 묶는다.
  const popupPositionRafIdRef = useRef<number | null>(null);
  const activeLocationRef = useRef<WhereToBuyLocation | undefined>(activeLocation);
  const onPopupPositionChangeRef = useRef(onPopupPositionChange);
  const onSearchAreaRef = useRef(onSearchArea);
  // 사용자가 지도를 이동/줌한 뒤에만 노출되는 "이 지역에서 검색" 버튼 표시 여부
  const [showAreaButton, setShowAreaButton] = useState(false);
  // 프로그램적 카메라 이동(fitBounds/panTo/setZoom/초기뷰)으로 발생한 zoom_changed 를
  // 사용자 조작으로 오인하지 않도록 잠그는 플래그. 이동 시작 전 true, idle 에서 해제.
  const suppressUserMoveRef = useRef(false);
  // 카메라/마커 갱신 effect 가 "목록이 실제로 바뀐 렌더"를 판별하기 위한 직전 locations 참조.
  // - 카드 클릭(activeLocation 만 변경)은 locations 참조가 그대로이므로 fitBounds/버튼숨김을 건너뛰고,
  //   영역검색 진입(locations 교체 + boundsMode)은 이 값이 달라지는 것으로 감지해 자동팬을 1회 건너뛴다.
  const prevLocationsRef = useRef<WhereToBuyLocation[] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 최신 활성 위치/콜백을 리스너가 참조할 수 있도록 렌더마다 ref 동기화
  activeLocationRef.current = activeLocation;
  onPopupPositionChangeRef.current = onPopupPositionChange;
  onSearchAreaRef.current = onSearchArea;
  radiusOriginRef.current = radiusOrigin;
  radiusMilesRef.current = radiusMiles;
  boundsModeRef.current = boundsMode;

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
  // - 항상 "현재 mapRef.current" 에 마커를 붙인다. 지도 인스턴스는 최초 1회만 생성되므로
  //   이 함수는 언제 호출돼도 동일한 하나의 지도 위에 마커를 다시 그린다.
  const drawMarkersRef = useRef<() => void>(() => {});
  drawMarkersRef.current = () => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) {
      return;
    }
    const maps = window.google.maps;

    // 이전 마커 제거 후 재생성(활성 마커 zIndex 반영을 위해 전량 재그림).
    // ⚠️ 본사 마커(hqMarkerRef)/반경 원(circleRef)은 이 정리 대상이 아니다 — 항상 지도에 남는다.
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 좌표 가드: 유효 좌표 레코드만 마커 생성(0/빈값 좌표 제외)
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

    // 방어: 재그림 후에도 본사 마커/반경 원이 반드시 현재 지도에 붙어 있게 한다(이미 붙어 있으면 no-op)
    hqMarkerRef.current?.setMap(map);
    circleRef.current?.setMap(map);
  };

  // ── Effect A. 지도 인스턴스 생성(마운트 시 1회) ─────────────────────────────
  // 의존성: [apiKey, usePlaceholder]. locations/activeLocation/isFiltered/boundsMode 변경으로는
  // 절대 재실행되지 않는다 → 컴포넌트 수명주기 동안 new maps.Map() 은 정확히 1번만 호출된다.
  // (모바일 플레이스홀더 전환으로 usePlaceholder 가 바뀌면 컨테이너 div 자체가 언마운트/재마운트되므로
  //  DOM 누적 없이 지도가 사라졌다 다시 생긴다.)
  useEffect(() => {
    if (usePlaceholder || !apiKey || !mapCanvasRef.current) {
      // 모바일 플레이스홀더 등 지도 미생성 상태에서는 데스크톱 팝업 좌표를 해제
      onPopupPositionChangeRef.current?.(null);
      return;
    }

    let cancelled = false;
    // 지도 수명주기에 묶인 리스너 핸들(정리 시 해제)
    let listeners: google.maps.MapsEventListener[] = [];

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapCanvasRef.current) {
          return;
        }

        // 초기 카메라 세팅(constructor)으로 인한 zoom_changed 를 사용자 조작으로 오인하지 않도록 잠근다.
        suppressUserMoveRef.current = true;

        // 항상 퍼블리싱된 기본 중심/줌으로 시작한다. 이후 검색(isFiltered)·활성위치 변경 등
        // 카메라 이동은 별도 effect 가 이 인스턴스에 대해 명령형으로 처리한다.
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

        // 본사(HQ) 고정 마커 — 기획서 항목3: 검색한 주소/필터 결과와 상관없이 항상 표기.
        // locations 배열과 무관한 별도 인스턴스라 검색 전/검색 후/결과 0건 어느 상태에서도 사라지지 않는다.
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

        // 반경 Circle 오버레이 — 기획서 항목1·2·7. 최초 1회만 생성하고 이후엔 setCenter/setRadius 로 갱신한다.
        // 초기 중심/반경은 렌더 시점 최신값(ref)을 사용(이 effect 는 반경 props 에 의존하지 않는다).
        circleRef.current = new maps.Circle({
          map,
          center: radiusOriginRef.current,
          radius: radiusMilesRef.current * MILES_TO_METERS,
          // 원 위 클릭이 마커/지도 조작을 방해하지 않도록 비클릭 처리
          clickable: false,
          strokeColor: whereToBuyRadiusCircle.strokeColor,
          strokeOpacity: whereToBuyRadiusCircle.strokeOpacity,
          strokeWeight: whereToBuyRadiusCircle.strokeWeight,
          fillColor: whereToBuyRadiusCircle.fillColor,
          fillOpacity: whereToBuyRadiusCircle.fillOpacity,
          // 영역검색 모드에서는 반경필터가 비활성이므로 원을 숨긴다
          visible: !boundsModeRef.current,
        });

        // 팝업 픽셀좌표 계산용 OverlayView 부착(마커 위치 추적 전용, 그리기는 없음)
        const overlay = new maps.OverlayView();
        overlay.onAdd = () => {};
        overlay.draw = () => {};
        overlay.onRemove = () => {};
        overlay.setMap(map);
        overlayRef.current = overlay;

        // 드래그 중 마우스 이동마다 발생하는 bounds_changed/center_changed 는
        // rAF 로 묶어 프레임당 1회로 제한(중복 예약 방지 가드 포함).
        const scheduleUpdatePopupPosition = () => {
          if (popupPositionRafIdRef.current !== null) return;
          popupPositionRafIdRef.current = window.requestAnimationFrame(() => {
            popupPositionRafIdRef.current = null;
            updatePopupPositionRef.current();
          });
        };

        // 지도가 움직일 때마다 팝업 픽셀좌표 재계산
        listeners = [
          map.addListener("idle", () => updatePopupPositionRef.current()),
          map.addListener("bounds_changed", scheduleUpdatePopupPosition),
          map.addListener("center_changed", scheduleUpdatePopupPosition),
          map.addListener("zoom_changed", () => updatePopupPositionRef.current()),
        ];

        // idle: 이동이 멈춘 시점 — 프로그램적 이동 잠금 해제.
        listeners.push(
          map.addListener("idle", () => {
            suppressUserMoveRef.current = false;
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

        // 지도가 준비됐음을 알린다. 마커 그리기/카메라 이동은 mapReady 를 가드로 하는
        // 아래 effect 들이 이 상태 변화에 반응해 수행한다.
        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(true);
        }
      });

    return () => {
      // 언마운트(또는 usePlaceholder 전환) 시에만 정리. 지도 인스턴스 자체는 컨테이너 DOM 이
      // 사라지면서 함께 제거되므로 별도 destroy 없이 리스너/overlay/마커만 해제한다.
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

  // ── Effect B. 마커 재그림 ───────────────────────────────────────────────
  // 의존성: [locations, activeLocation, mapReady, usePlaceholder].
  // 지도가 준비된 뒤 목록/활성위치가 바뀔 때마다 "기존 지도 인스턴스"에 마커를 다시 그리고,
  // 활성 마커 픽셀좌표를 재계산한다. 지도가 아직 없으면(가드) 아무것도 하지 않는다.
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

  // ── Effect C. 반경 Circle 갱신 ─────────────────────────────────────────
  // 의존성: [radiusOrigin, radiusMiles, boundsMode, mapReady, usePlaceholder].
  // Distance 필터를 바꾸면 즉시 원 반경이 조정된다(기획서 항목7). 인스턴스는 재생성하지 않고
  // setCenter/setRadius 로만 갱신한다. 아래 카메라 effect 가 circle.getBounds() 를 참조하므로
  // 반드시 카메라 effect 보다 먼저 선언돼 있어야 한다(effect 는 선언 순서대로 실행).
  useEffect(() => {
    if (usePlaceholder) {
      return;
    }
    const circle = circleRef.current;
    if (!mapReady || !circle) {
      return;
    }
    // 영역검색 모드에서는 반경필터가 결과에 영향을 주지 않으므로 원을 숨긴다(원과 목록 불일치 방지)
    if (boundsMode) {
      circle.setVisible(false);
      return;
    }
    circle.setVisible(true);
    circle.setCenter(radiusOrigin);
    circle.setRadius(radiusMiles * MILES_TO_METERS);
  }, [radiusOrigin, radiusMiles, boundsMode, mapReady, usePlaceholder]);

  // ── Effect D. 카메라 이동(fitBounds / 활성마커 자동팬) ─────────────────────
  // 의존성: [locations, activeLocation, isFiltered, boundsMode, mapReady, usePlaceholder].
  // 원본 지도-재생성 직후 카메라 로직을 "기존 인스턴스에 대한 명령형 갱신"으로 옮긴 것.
  // 규칙:
  //  - locationsChanged(목록 교체 = 새 검색/영역검색/데이터 도착) 인 렌더에서만 fitBounds 를 시도한다.
  //    카드 클릭처럼 locations 참조가 그대로면 fitBounds/버튼숨김을 건너뛴다.
  //  - 초기/미필터 상태(locationsChanged && !isFiltered && !boundsMode)에서는 활성마커 자동팬을 하지 않고
  //    반경 원 전체가 보이도록 fitBounds 한다 — 기획서 항목1의 "본사 중심 + 500mi 원" 초기 뷰를 지키기 위함.
  //    (자동팬을 그대로 두면 데이터 도착 직후 첫 카드로 mapActiveZoom 까지 줌인돼 원이 화면을 벗어난다.)
  //  - isFiltered && 결과 2건 이상일 때만 결과 범위로 fitBounds.
  //  - 이어서 활성마커로 자동 panTo. 단, "영역검색으로 목록이 막 교체된 렌더"(boundsMode && locationsChanged)
  //    에서는 자동팬을 1회 건너뛰어 사용자가 보던 카메라를 그대로 둔다.
  //  - fitBounds 뒤에 panTo 가 이어지므로, 활성위치가 있으면 최종 카메라는 활성마커 중심(mapActiveZoom)이 된다
  //    (원본과 동일한 우선순위).
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

    // 목록이 실제로 교체된 렌더에서는 이전 상태의 "이 지역에서 검색" 버튼을 숨긴다
    // (새 검색/영역검색이 반영된 직후엔 버튼이 떠 있으면 안 됨). 카드 클릭은 여기 해당 없음.
    if (locationsChanged) {
      setShowAreaButton(false);
    }

    const mappable = locations.filter(hasValidCoords);

    // 초기/미필터 상태에서 목록이 갱신된 렌더: 반경 원이 화면에 들어오도록 맞추고 자동팬은 건너뛴다.
    // (본사 중심 + 선택 반경 원이 보이는 초기 뷰 — 기획서 항목1)
    if (locationsChanged && !isFiltered && !boundsMode) {
      const circleBounds = circleRef.current?.getBounds();
      if (circleBounds) {
        suppressUserMoveRef.current = true;
        map.fitBounds(circleBounds);
      }
      return;
    }

    // 실제 검색/필터가 적용된 새 결과에 대해서만 fitBounds. 초기/미필터/영역검색 상태에서는
    // 카메라를 자동으로 움직이지 않는다.
    if (isFiltered && mappable.length > 1 && locationsChanged) {
      suppressUserMoveRef.current = true;
      const bounds = new maps.LatLngBounds();
      mappable.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }

    // 영역검색으로 목록이 막 교체된 렌더면 자동팬을 건너뛴다(사용자 뷰 유지).
    // 그 외(카드 클릭·일반 검색·데이터 도착)에는 활성마커로 자동 panTo.
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
