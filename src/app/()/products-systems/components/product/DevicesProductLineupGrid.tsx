"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type DevicesProductLineupGridProps = {
  modifier: "type1" | "type2";
  layout?: "mccb" | "spec" | "metasol";
  children: ReactNode;
};

type ScrollbarMetrics = {
  scrollable: boolean;
  thumbWidthPct: number;
  thumbLeftPct: number;
};

const INITIAL_SCROLLBAR: ScrollbarMetrics = {
  scrollable: false,
  thumbWidthPct: 100,
  thumbLeftPct: 0,
};

export default function DevicesProductLineupGrid({
  modifier,
  layout,
  children,
}: DevicesProductLineupGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [swipeHidden, setSwipeHidden] = useState(false);
  const [scrollbar, setScrollbar] = useState<ScrollbarMetrics>(INITIAL_SCROLLBAR);

  const updateScrollbar = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth > clientWidth + 1;
    const thumbWidthPct = scrollable ? (clientWidth / scrollWidth) * 100 : 100;
    const thumbLeftPct = scrollable ? (scrollLeft / scrollWidth) * 100 : 0;

    setScrollbar({ scrollable, thumbWidthPct, thumbLeftPct });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollLeft > 0) {
      setSwipeHidden(true);
    }

    updateScrollbar();
  }, [updateScrollbar]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const sync = () => {
      if (el.scrollWidth <= el.clientWidth + 1) {
        setSwipeHidden(true);
      }
      updateScrollbar();
    };

    sync();
    el.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(el);
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    window.addEventListener("resize", sync);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [handleScroll, updateScrollbar, children]);

  const layoutAttr = modifier === "type1" ? layout ?? "mccb" : undefined;

  return (
    <div
      className={`devices_product_lineup__grid devices_product_lineup__grid--${modifier}`}
      data-layout={layoutAttr}
    >
      <div className="devices_product_lineup__grid-viewport">
        <div
          ref={scrollRef}
          className="devices_product_lineup__grid-scroll"
          tabIndex={0}
          role="region"
          aria-label="Product lineup. Swipe or scroll horizontally to see more."
        >
          {children}
        </div>
        {scrollbar.scrollable ? (
          <div
            className="devices_product_lineup__scrollbar"
            aria-hidden="true"
          >
            <div className="devices_product_lineup__scrollbar-track">
              <div
                className="devices_product_lineup__scrollbar-thumb"
                style={{
                  width: `${scrollbar.thumbWidthPct}%`,
                  left: `${scrollbar.thumbLeftPct}%`,
                }}
              />
            </div>
          </div>
        ) : null}
        <div
          className={
            swipeHidden
              ? "devices_product_lineup__swipe is-hidden"
              : "devices_product_lineup__swipe"
          }
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            className="devices_product_lineup__swipe-icon"
            src="/ico/ico_swipe_70.svg"
            alt=""
          />
          <p className="devices_product_lineup__swipe-label">Swipe</p>
        </div>
      </div>
    </div>
  );
}
