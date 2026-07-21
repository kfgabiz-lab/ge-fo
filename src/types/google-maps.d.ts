declare namespace google.maps {
  // loading=async 방식에서 필요한 라이브러리를 명시적으로 로드하는 공식 API
  function importLibrary(library: string): Promise<unknown>;

  class Map {
    constructor(el: HTMLElement, opts: MapOptions);
    setCenter(latLng: LatLngLiteral): void;
    setZoom(zoom: number): void;
    setMapTypeId(mapTypeId: string): void;
    panTo(latLng: LatLngLiteral): void;
    fitBounds(bounds: LatLngBounds): void;
    addListener(event: string, handler: () => void): MapsEventListener;
    // 현재 지도 뷰포트/카메라 조회("이 지역에서 검색" 영역필터 + 뷰 복원용)
    getBounds(): LatLngBounds | undefined;
    getCenter(): LatLng | undefined;
    getZoom(): number | undefined;
  }

  // addListener 반환값 — 리스너 해제용
  interface MapsEventListener {
    remove(): void;
  }

  class Marker {
    constructor(opts: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }

  class LatLngBounds {
    extend(latLng: LatLngLiteral): void;
    // 영역(bounds) 조회 — 북동/남서 모서리 및 포함여부 판정
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    contains(latLng: LatLngLiteral): boolean;
  }

  class Size {
    constructor(width: number, height: number);
  }

  // ---- OverlayView (importLibrary("maps") 로 로드) — 마커 화면 픽셀좌표 계산용 ----
  class OverlayView {
    setMap(map: Map | null): void;
    getProjection(): MapCanvasProjection | null;
    onAdd?: () => void;
    draw?: () => void;
    onRemove?: () => void;
  }

  // OverlayView.getProjection() 이 제공하는 좌표 변환기
  interface MapCanvasProjection {
    // 지도 컨테이너(map div) 좌상단 기준 픽셀 좌표
    fromLatLngToContainerPixel(latLng: LatLng): Point | null;
    // 지도 내부 오버레이 div 기준 픽셀 좌표
    fromLatLngToDivPixel(latLng: LatLng): Point | null;
  }

  // ---- Geocoding (importLibrary("geocoding") 로 로드) ----
  class Geocoder {
    geocode(
      request: GeocoderRequest,
      callback: (
        results: GeocoderResult[] | null,
        status: GeocoderStatus,
      ) => void,
    ): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  // Geocoding 응답 상태 코드
  type GeocoderStatus =
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "UNKNOWN_ERROR"
    | "ERROR";

  interface GeocoderRequest {
    address?: string;
    // placeId 로 지오코딩(Places 자동완성 후보 → 좌표 확정용)
    placeId?: string;
  }

  interface GeocoderGeometry {
    location: LatLng;
  }

  interface GeocoderResult {
    geometry: GeocoderGeometry;
    formatted_address?: string;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  // ---- Places (importLibrary("places") 로 로드) — 주소 자동완성 ----
  namespace places {
    // 신규 웹컴포넌트가 아닌 클래식 자동완성 서비스(직접 드롭다운 UI 구성용)
    class AutocompleteService {
      getPlacePredictions(
        request: AutocompletionRequest,
        callback: (
          predictions: AutocompletePrediction[] | null,
          status: PlacesServiceStatus,
        ) => void,
      ): void;
    }

    interface AutocompletionRequest {
      input: string;
      types?: string[];
      componentRestrictions?: { country: string | string[] };
    }

    interface AutocompletePrediction {
      place_id: string;
      description: string;
    }

    type PlacesServiceStatus =
      | "OK"
      | "ZERO_RESULTS"
      | "OVER_QUERY_LIMIT"
      | "REQUEST_DENIED"
      | "INVALID_REQUEST"
      | "NOT_FOUND"
      | "UNKNOWN_ERROR";
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center?: LatLngLiteral;
    zoom?: number;
    disableDefaultUI?: boolean;
    mapTypeControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    streetViewControl?: boolean;
    gestureHandling?: string;
    mapTypeId?: string;
  }

  interface MarkerOptions {
    map?: Map;
    position?: LatLngLiteral;
    title?: string;
    icon?: MarkerIcon | string;
    zIndex?: number;
  }

  interface MarkerIcon {
    url: string;
    scaledSize?: Size;
    anchor?: Point;
  }
}

interface Window {
  google?: {
    maps: typeof google.maps;
  };
}
