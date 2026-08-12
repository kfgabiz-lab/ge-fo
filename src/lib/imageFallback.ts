import type { SyntheticEvent } from "react";

export const NOIMAGE_SRC = "/img/devices/product/list_no_data.svg";

export function handleImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.src.endsWith(NOIMAGE_SRC)) return;
  img.onerror = null;
  img.src = NOIMAGE_SRC;
}
