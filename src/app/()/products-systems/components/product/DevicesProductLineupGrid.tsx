"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type DevicesProductLineupGridProps = {
  modifier: "type1" | "type2";
  /** type1: mccb · spec(Figma 6788:7576) · metasol(Figma 6788:8458) */
  layout?: "mccb" | "spec" | "metasol";
  children: ReactNode;
};

export default function DevicesProductLineupGrid({
  modifier,
  layout,
  children,
}: DevicesProductLineupGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [swipeHidden, setSwipeHidden] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollLeft > 0) {
      setSwipeHidden(true);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollWidth <= el.clientWidth + 1) {
      setSwipeHidden(true);
    }

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const layoutAttr = modifier === "type1" ? layout ?? "mccb" : undefined;

  return (
    <div
      className={`devices_product_lineup__grid devices_product_lineup__grid--${modifier}`}
      data-layout={layoutAttr}
    >
      <div className="devices_product_lineup__grid-viewport">
        <div ref={scrollRef} className="devices_product_lineup__grid-scroll">
          {children}
        </div>
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
