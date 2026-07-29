
import { getClientSiteLocale } from "./clientSiteLocale";

type ImportLibraryFn = (name: string, ...rest: unknown[]) => Promise<unknown>;

type BootstrapMaps = {
  importLibrary?: ImportLibraryFn;
  __ib__?: (value?: void | PromiseLike<void>) => void;
  Map?: unknown;
  [key: string]: unknown;
};

let bootstrapInstalled = false;
let loadPromise: Promise<typeof google.maps> | null = null;
let geocodingPromise: Promise<typeof google.maps> | null = null;
let placesPromise: Promise<typeof google.maps> | null = null;

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

function installBootstrapLoader(g: Record<string, string>): void {
  const p = "The Google Maps JavaScript API";
  const c = "google";
  const l = "importLibrary";
  const q = "__ib__";
  const m = document;
  const w = window as unknown as { google?: { maps?: BootstrapMaps } };

  const googleObj = w.google || (w.google = {});
  const maps: BootstrapMaps = googleObj.maps || (googleObj.maps = {});
  const libraries = new Set<string>();
  const params = new URLSearchParams();

  let loaderPromise: Promise<void> | undefined;
  const bootstrap = (): Promise<void> =>
    loaderPromise ||
    (loaderPromise = new Promise<void>((resolve, reject) => {
      const a = m.createElement("script");
      params.set("libraries", [...libraries] + "");
      for (const k in g) {
        params.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
      }
      params.set("callback", c + ".maps." + q);
      a.src = `https://maps.${c}apis.com/maps/api/js?` + params;
      maps[q] = resolve;
      a.onerror = () => {
        loaderPromise = undefined;
        reject(new Error(p + " could not load."));
      };
      a.nonce =
        (m.querySelector("script[nonce]") as HTMLElement | null)?.nonce || "";
      m.head.append(a);
    }));

  if (maps[l]) {
    console.warn(p + " only loads once. Ignoring:", g);
    return;
  }

  maps[l] = (name: string, ...rest: unknown[]) =>
    libraries.add(name) &&
    bootstrap().then(() => (maps[l] as ImportLibraryFn)(name, ...rest));
}

export function loadGoogleMaps(apiKey: string): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  const currentMaps = window.google?.maps as BootstrapMaps | undefined;
  if (currentMaps?.Map) {
    return Promise.resolve(window.google!.maps);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    if (!bootstrapInstalled) {
      installBootstrapLoader({ key: apiKey, v: "weekly", language: getClientSiteLocale() });
      bootstrapInstalled = true;
    }
    await window.google!.maps.importLibrary("maps");
    return window.google!.maps;
  })().catch((error) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}

export function loadGoogleMapsGeocoding(
  apiKey: string,
): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  const currentMaps = window.google?.maps as
    | (BootstrapMaps & { Geocoder?: unknown })
    | undefined;
  if (currentMaps?.Geocoder) {
    return Promise.resolve(window.google!.maps);
  }

  if (geocodingPromise) {
    return geocodingPromise;
  }

  geocodingPromise = (async () => {
    await loadGoogleMaps(apiKey);
    await window.google!.maps.importLibrary("geocoding");
    return window.google!.maps;
  })().catch((error) => {
    geocodingPromise = null;
    throw error;
  });

  return geocodingPromise;
}

export function loadGoogleMapsPlaces(
  apiKey: string,
): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  const currentMaps = window.google?.maps as
    | (BootstrapMaps & { places?: unknown })
    | undefined;
  if (currentMaps?.places) {
    return Promise.resolve(window.google!.maps);
  }

  if (placesPromise) {
    return placesPromise;
  }

  placesPromise = (async () => {
    await loadGoogleMaps(apiKey);
    await window.google!.maps.importLibrary("places");
    return window.google!.maps;
  })().catch((error) => {
    placesPromise = null;
    throw error;
  });

  return placesPromise;
}
