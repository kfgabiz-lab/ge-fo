declare namespace google.maps {
  class Map {
    constructor(el: HTMLElement, opts: MapOptions);
    setCenter(latLng: LatLngLiteral): void;
    setZoom(zoom: number): void;
    setMapTypeId(mapTypeId: string): void;
    panTo(latLng: LatLngLiteral): void;
    fitBounds(bounds: LatLngBounds): void;
  }

  class Marker {
    constructor(opts: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }

  class LatLngBounds {
    extend(latLng: LatLngLiteral): void;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
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
