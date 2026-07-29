import type { GeoCoord } from "./distance";

export type GeolocationErrorReason =
  | "unsupported"
  | "denied"
  | "unavailable"
  | "timeout";

export class BrowserLocationError extends Error {
  reason: GeolocationErrorReason;

  constructor(reason: GeolocationErrorReason, message: string) {
    super(message);
    this.name = "BrowserLocationError";
    this.reason = reason;
  }
}

export function getBrowserLocation(): Promise<GeoCoord> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(
        new BrowserLocationError(
          "unsupported",
          "Geolocation is not supported in this browser.",
        ),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        const reason: GeolocationErrorReason =
          error.code === error.PERMISSION_DENIED
            ? "denied"
            : error.code === error.TIMEOUT
              ? "timeout"
              : "unavailable";
        reject(new BrowserLocationError(reason, error.message));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  });
}
