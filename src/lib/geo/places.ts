// Google Places Autocomplete 래퍼 (입력 문자열 → 주소 후보 목록 → placeId → 좌표)
// - 후보 조회: places 라이브러리의 클래식 AutocompleteService.getPlacePredictions
// - 좌표 확정: geocoding 라이브러리의 Geocoder 를 placeId 로 호출(기존 로더 재사용)
// - 로더는 loadGoogleMapsPlaces / loadGoogleMapsGeocoding 경유(직접 스크립트 삽입 금지)
import {
  getGoogleMapsApiKey,
  loadGoogleMapsGeocoding,
  loadGoogleMapsPlaces,
} from "@/lib/googleMaps/loadGoogleMaps";
import type { GeoCoord } from "./distance";

/** 자동완성 드롭다운 렌더용 최소 후보 형태 */
export type PlaceSuggestion = {
  placeId: string;
  description: string;
};

/** placeId → 주소 컴포넌트 파싱 결과(폼 자동 채움용). 파싱 못한 항목은 빈 문자열. */
export type PlaceAddress = {
  street: string; // 도로명(street_number + route)
  city: string; // 도시(locality 우선)
  state: string; // 주/도(administrative_area_level_1 short)
  zip: string; // 우편번호(postal_code)
};

// AutocompleteService 인스턴스 캐시(입력마다 재생성 방지)
let autocompleteService: google.maps.places.AutocompleteService | null = null;

/**
 * 입력 문자열에 대한 주소 후보 목록 조회.
 * - API 키 없음/빈 입력/결과 없음/에러는 모두 빈 배열로 반환(호출부에서 드롭다운 숨김 처리).
 */
export async function fetchPlaceSuggestions(
  input: string,
): Promise<PlaceSuggestion[]> {
  const apiKey = getGoogleMapsApiKey();
  const trimmed = input.trim();
  if (!apiKey || !trimmed) {
    return [];
  }

  const maps = await loadGoogleMapsPlaces(apiKey);
  if (!autocompleteService) {
    autocompleteService = new maps.places.AutocompleteService();
  }

  return new Promise<PlaceSuggestion[]>((resolve) => {
    autocompleteService!.getPlacePredictions(
      { input: trimmed },
      (predictions, status) => {
        if (status === "OK" && predictions) {
          resolve(
            predictions.map((prediction) => ({
              placeId: prediction.place_id,
              description: prediction.description,
            })),
          );
        } else {
          resolve([]);
        }
      },
    );
  });
}

/**
 * 자동완성 후보(placeId) → 좌표 확정.
 * - API 키 없음/빈 placeId/결과 없음/에러는 모두 null 로 반환.
 */
export async function geocodePlaceId(
  placeId: string,
): Promise<GeoCoord | null> {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey || !placeId) {
    return null;
  }

  const maps = await loadGoogleMapsGeocoding(apiKey);
  const geocoder = new maps.Geocoder();

  return new Promise<GeoCoord | null>((resolve) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        resolve(null);
      }
    });
  });
}

// address_components 에서 특정 type 값을 조회(없으면 빈 문자열). useShort=true 면 short_name.
function pickComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  useShort = false,
): string {
  const found = components.find((comp) => comp.types.includes(type));
  if (!found) return "";
  return useShort ? found.short_name : found.long_name;
}

/**
 * 자동완성 후보(placeId) → 주소 컴포넌트(street/city/state/zip) 파싱.
 * - Registration Form 주소 선택 시 City/State/ZIP 등을 자동 채우기 위한 용도.
 * - API 키 없음/빈 placeId/결과 없음/에러는 모두 null 로 반환(호출부에서 자동채움 스킵).
 * - geocodePlaceId 와 동일하게 loadGoogleMapsGeocoding 로더를 재사용한다.
 */
export async function fetchPlaceAddress(
  placeId: string,
): Promise<PlaceAddress | null> {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey || !placeId) {
    return null;
  }

  const maps = await loadGoogleMapsGeocoding(apiKey);
  const geocoder = new maps.Geocoder();

  return new Promise<PlaceAddress | null>((resolve) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const components = results[0].address_components;
        const streetNumber = pickComponent(components, "street_number");
        const route = pickComponent(components, "route");
        const street = [streetNumber, route].filter(Boolean).join(" ");
        // 도시: locality 우선, 없으면 대체 타입 순차 폴백
        const city =
          pickComponent(components, "locality") ||
          pickComponent(components, "postal_town") ||
          pickComponent(components, "sublocality") ||
          pickComponent(components, "administrative_area_level_2");
        const state = pickComponent(
          components,
          "administrative_area_level_1",
          true,
        );
        const zip = pickComponent(components, "postal_code");
        resolve({ street, city, state, zip });
      } else {
        resolve(null);
      }
    });
  });
}
