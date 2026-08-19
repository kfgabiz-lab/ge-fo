import { useEffect, useRef } from "react";
import { getWindowScrollY, lockPageScroll, unlockPageScroll } from "@/lib/lenisScroll";

export function useModalDismiss(active: boolean, onClose?: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current?.();
    };

    const scrollY = getWindowScrollY();
    lockPageScroll(scrollY);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockPageScroll(scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);
}
