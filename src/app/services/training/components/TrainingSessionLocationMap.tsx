"use client";

import { useEffect, useRef, useState } from "react";
import { geocodeAddress } from "@/lib/geo/geocode";
import {
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "@/lib/googleMaps/loadGoogleMaps";

// Training 세션 상세 LOCATION 지도(단일 마커).
// - WhereToBuyMap 의 지도 생성/마커 패턴을 단순화(단일 마커, 영역검색/팝업/인터랙션 없음).
// - 주소 문자열 → geocodeAddress 로 좌표 변환 후 loadGoogleMaps 로 지도 표시.
// - API 키 없음/좌표 변환 실패/로드 실패 시 지도 미노출(그레이스풀).

// 지도 컨테이너 채움 스타일(인라인 — WhereToBuyMap 과 동일 방식, 별도 CSS 의존 없음)
const mapBoxStyle = {
  width: "100%",
  height: "220px",
} as const;

// 단일 위치 표시용 기본 줌
const DEFAULT_ZOOM = 15;

export default function TrainingSessionLocationMap({
  address,
}: {
  address: string;
}) {
  const apiKey = getGoogleMapsApiKey();
  const canvasRef = useRef<HTMLDivElement>(null);
  // 좌표 변환/로드 실패 시 컨테이너까지 숨기기 위한 플래그(그레이스풀)
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = address.trim();
    if (!apiKey || !query || !canvasRef.current) return;

    let cancelled = false;
    let marker: google.maps.Marker | null = null;

    (async () => {
      // 좌표 변환 실패(결과 없음/키 없음) → 지도 미노출
      const coord = await geocodeAddress(query);
      if (cancelled) return;
      if (!coord) {
        setFailed(true);
        return;
      }
      const maps = await loadGoogleMaps(apiKey);
      if (cancelled || !canvasRef.current) return;

      const map = new maps.Map(canvasRef.current, {
        center: coord,
        zoom: DEFAULT_ZOOM,
        disableDefaultUI: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        gestureHandling: "cooperative",
      });
      // 단일 마커
      marker = new maps.Marker({ map, position: coord, title: query });
    })().catch(() => {
      // 로드/변환 예외는 무시하고 지도 미노출
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      marker?.setMap(null);
      marker = null;
    };
  }, [address, apiKey]);

  // API 키 없음/주소 없음/실패 시 미노출
  if (!apiKey || !address.trim() || failed) return null;

  return (
    <div
      ref={canvasRef}
      className="support_service_training_session_detail__map"
      style={mapBoxStyle}
      role="application"
      aria-label={`Map showing training location: ${address}`}
    />
  );
}
