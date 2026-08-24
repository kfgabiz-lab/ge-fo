"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TableScrollbarMetrics = {
  scrollable: boolean;
  thumbWidthPct: number;
  thumbLeftPct: number;
};

const INITIAL_SCROLLBAR: TableScrollbarMetrics = {
  scrollable: false,
  thumbWidthPct: 100,
  thumbLeftPct: 0,
};

export function useTableSwipeHint(enabled = true) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeHidden, setSwipeHidden] = useState(!enabled);
  const [scrollbar, setScrollbar] =
    useState<TableScrollbarMetrics>(INITIAL_SCROLLBAR);

  const hideSwipe = useCallback(() => {
    setSwipeHidden(true);
  }, []);

  const updateScrollbar = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth > clientWidth + 1;
    const thumbWidthPct = scrollable ? (clientWidth / scrollWidth) * 100 : 100;
    const thumbLeftPct = scrollable ? (scrollLeft / scrollWidth) * 100 : 0;

    setScrollbar({ scrollable, thumbWidthPct, thumbLeftPct });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const syncOverflow = () => {
      if (enabled && el.scrollWidth <= el.clientWidth + 1) {
        hideSwipe();
      }
      updateScrollbar();
    };

    const onScroll = () => {
      if (enabled && el.scrollLeft > 0) hideSwipe();
      updateScrollbar();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!enabled) return;
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!enabled) return;
      const start = touchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;

      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);

      if (dx > 8 && dx >= dy) {
        hideSwipe();
        touchStartRef.current = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!enabled) return;
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

    const resizeObserver = new ResizeObserver(syncOverflow);
    resizeObserver.observe(el);
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", syncOverflow);
      resizeObserver.disconnect();
    };
  }, [enabled, hideSwipe, updateScrollbar]);

  return { scrollRef, swipeHidden, scrollbar };
}
