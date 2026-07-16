// 좌표/거리 관련 순수 유틸 (Google Maps 등 외부 의존성 없음 — 서버/클라이언트 공용)

/** 위경도 좌표 */
export type GeoCoord = { lat: number; lng: number };

// 지구 평균 반지름(mile). haversine 거리 계산 상수
const EARTH_RADIUS_MILES = 3958.8;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * 두 좌표 간 대권거리(great-circle distance)를 mile 단위로 반환하는 haversine 순수함수.
 * 반경필터에서 원점(검색좌표/내위치)과 각 지점 사이 거리를 재는 데 사용한다.
 */
export function haversineMiles(origin: GeoCoord, target: GeoCoord): number {
  const dLat = toRad(target.lat - origin.lat);
  const dLng = toRad(target.lng - origin.lng);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(target.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_MILES * c;
}
