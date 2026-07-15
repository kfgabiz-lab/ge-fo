"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type WarrantyTableScrollProps = {
  children: ReactNode;
  /** Show mobile swipe hint overlay (Figma 6880:144915) */
  withSwipe?: boolean;
  /** Sticky first column + edge shadow (Figma 6880:144576) */
  stickyFirstCol?: boolean;
};

export default function WarrantyTableScroll({
  children,
  withSwipe = false,
  stickyFirstCol = false,
}: WarrantyTableScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeHidden, setSwipeHidden] = useState(!withSwipe);

  const hideSwipe = useCallback(() => {
    setSwipeHidden(true);
  }, []);

  useEffect(() => {
    if (!withSwipe) return;

    const el = scrollRef.current;
    if (!el) return;

    const syncOverflow = () => {
      if (el.scrollWidth <= el.clientWidth + 1) {
        hideSwipe();
      }
    };

    const onScroll = () => {
      if (el.scrollLeft > 0) {
        hideSwipe();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;

      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);

      /* horizontal swipe intent */
      if (dx > 8 && dx >= dy) {
        hideSwipe();
        touchStartRef.current = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > 0 || el.scrollLeft > 0) {
        hideSwipe();
      }
    };

    syncOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", syncOverflow);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", syncOverflow);
    };
  }, [hideSwipe, withSwipe]);

  return (
    <div
      className={
        stickyFirstCol
          ? "support_service_warranty_table-viewport support_service_warranty_table-viewport--sticky"
          : "support_service_warranty_table-viewport"
      }
    >
      <div ref={scrollRef} className="support_service_warranty_table-wrap">
        {children}
      </div>
      {withSwipe ? (
        <div
          className={
            swipeHidden
              ? "support_service_warranty_table-swipe is-hidden"
              : "support_service_warranty_table-swipe"
          }
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            className="support_service_warranty_table-swipe__icon"
            src="/ico/ico_swipe_70.svg"
            alt=""
          />
          <p className="support_service_warranty_table-swipe__label">Swipe</p>
        </div>
      ) : null}
    </div>
  );
}
