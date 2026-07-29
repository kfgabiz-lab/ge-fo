import {
  getGoogleMapsApiKey,
  loadGoogleMapsGeocoding,
  loadGoogleMapsPlaces,
} from "@/lib/googleMaps/loadGoogleMaps";
import type { GeoCoord } from "./distance";

export type PlaceSuggestion = {
  placeId: string;
  description: string;
};

export type PlaceAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

let autocompleteService: google.maps.places.AutocompleteService | null = null;

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

function pickComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  useShort = false,
): string {
  const found = components.find((comp) => comp.types.includes(type));
  if (!found) return "";
  return useShort ? found.short_name : found.long_name;
}

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
