import type { SyntheticEvent } from "react";

export const NOIMAGE_SRC = "/img/company/press/list_01.png";

export function handleImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.src.endsWith(NOIMAGE_SRC)) return;
  img.onerror = null;
  img.src = NOIMAGE_SRC;
}
