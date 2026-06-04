export const GNB_CLOSE_EVENT = "gnb:close";

export function dispatchGnbClose() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GNB_CLOSE_EVENT));
}
