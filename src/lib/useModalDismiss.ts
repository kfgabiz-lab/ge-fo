import { useEffect } from "react";
import { getWindowScrollY, lockPageScroll, unlockPageScroll } from "@/lib/lenisScroll";

export function useModalDismiss(active: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };

    const scrollY = getWindowScrollY();
    lockPageScroll(scrollY);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockPageScroll(scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onClose]);
}
