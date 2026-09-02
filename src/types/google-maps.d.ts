declare namespace google.maps {
  function importLibrary(library: string): Promise<unknown>;

  class Map {
    constructor(el: HTMLElement, opts: MapOptions);
    setCenter(latLng: LatLngLiteral): void;
    setZoom(zoom: number): void;
    setMapTypeId(mapTypeId: string): void;
    panTo(latLng: LatLngLiteral): void;
    fitBounds(bounds: LatLngBounds): void;
    addListener(event: string, handler: () => void): MapsEventListener;
    getBounds(): LatLngBounds | undefined;
    getCenter(): LatLng | undefined;
    getZoom(): number | undefined;
  }

  interface MapsEventListener {
    remove(): void;
  }

  namespace event {
    function trigger(
      instance: object,
      eventName: string,
      ...args: unknown[]
    ): void;
  }

  class Marker {
    constructor(opts: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }

  class LatLngBounds {
    constructor(sw?: LatLngLiteral, ne?: LatLngLiteral);
    extend(latLng: LatLngLiteral): void;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    contains(latLng: LatLngLiteral): boolean;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Circle {
    constructor(opts: CircleOptions);
    setMap(map: Map | null): void;
    setCenter(center: LatLngLiteral): void;
    setRadius(radius: number): void;
    setVisible(visible: boolean): void;
    getBounds(): LatLngBounds | null;
  }

  interface CircleOptions {
    map?: Map;
    center?: LatLngLiteral;
    radius?: number;
    clickable?: boolean;
    visible?: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    zIndex?: number;
  }

  class OverlayView {
    setMap(map: Map | null): void;
    getProjection(): MapCanvasProjection | null;
    onAdd?: () => void;
    draw?: () => void;
    onRemove?: () => void;
  }

  interface MapCanvasProjection {
    fromLatLngToContainerPixel(latLng: LatLng): Point | null;
    fromLatLngToDivPixel(latLng: LatLng): Point | null;
  }

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
    placeId?: string;
  }

  interface GeocoderGeometry {
    location: LatLng;
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  interface GeocoderResult {
    geometry: GeocoderGeometry;
    formatted_address?: string;
    address_components: GeocoderAddressComponent[];
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  namespace places {
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
