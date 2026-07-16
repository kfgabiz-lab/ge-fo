// 브라우저 Geolocation API 래퍼 (navigator.geolocation → Promise<GeoCoord>)
import type { GeoCoord } from "./distance";

/** 위치 획득 실패 사유 — 사용자 알림 문구 분기에 사용 */
export type GeolocationErrorReason =
  | "unsupported" // 브라우저가 Geolocation 미지원
  | "denied" // 사용자가 권한 거부
  | "unavailable" // 위치 확인 불가
  | "timeout"; // 시간 초과

/** getBrowserLocation 실패 시 던지는 에러(사유 코드 포함) */
export class BrowserLocationError extends Error {
  reason: GeolocationErrorReason;

  constructor(reason: GeolocationErrorReason, message: string) {
    super(message);
    this.name = "BrowserLocationError";
    this.reason = reason;
  }
}

/**
 * 현재 브라우저 위치를 1회 획득해 GeoCoord로 반환.
 * 실패 시 BrowserLocationError(reason) 로 reject 한다.
 */
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
