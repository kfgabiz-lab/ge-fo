// Google Geocoding API 래퍼 (문자열 주소 → 좌표)
// 로더는 기존 loadGoogleMaps 부트스트랩을 재사용하는 loadGoogleMapsGeocoding 경유
import {
  getGoogleMapsApiKey,
  loadGoogleMapsGeocoding,
} from "@/lib/googleMaps/loadGoogleMaps";
import type { GeoCoord } from "./distance";

/**
 * 입력 문자열(city/state/zip 등)을 Google Geocoding 으로 좌표 변환.
 * - API 키 없음/빈 입력/결과 없음/에러는 모두 null 로 반환(호출부에서 "결과 없음" 처리).
 */
export async function geocodeAddress(query: string): Promise<GeoCoord | null> {
  const apiKey = getGoogleMapsApiKey();
  const trimmed = query.trim();
  if (!apiKey || !trimmed) {
    return null;
  }

  const maps = await loadGoogleMapsGeocoding(apiKey);
  const geocoder = new maps.Geocoder();

  return new Promise<GeoCoord | null>((resolve) => {
    geocoder.geocode({ address: trimmed }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        resolve(null);
      }
    });
  });
}
