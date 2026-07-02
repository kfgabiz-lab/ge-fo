const GOOGLE_MAPS_SCRIPT_ID = "google-maps-script";

let loadPromise: Promise<typeof google.maps> | null = null;

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

export function loadGoogleMaps(
  apiKey: string,
): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
          return;
        }
        reject(new Error("Google Maps failed to initialize."));
      });
      existing.addEventListener("error", () => {
        reject(new Error("Google Maps script failed to load."));
      });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }
      reject(new Error("Google Maps failed to initialize."));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Google Maps script failed to load."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
