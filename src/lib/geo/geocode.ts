import {
  getGoogleMapsApiKey,
  loadGoogleMapsGeocoding,
} from "@/lib/googleMaps/loadGoogleMaps";
import type { GeoCoord } from "./distance";

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
