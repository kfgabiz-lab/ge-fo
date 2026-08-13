export function pushDataLayerEvent(data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
