"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_TOP_THRESHOLD = 8;
const SCROLL_DIRECTION_DELTA = 12;

export type HeaderMode = "full" | "hidden" | "revealed";

type UseHeaderScrollOptions = {
  /** 스크롤 이하 구간에서 투명(최상단) 상태 — main: 80 */
  topThreshold?: number;
  /** false면 모바일처럼 GNB 숨김 없이 full / revealed만 사용 */
  hideGnbOnScroll?: boolean;
};

export function useHeaderScroll(options?: UseHeaderScrollOptions) {
  const topThreshold = options?.topThreshold ?? DEFAULT_TOP_THRESHOLD;
  const hideGnbOnScroll = options?.hideGnbOnScroll ?? true;
  const [headerMode, setHeaderMode] = useState<HeaderMode>("full");
  const headerModeRef = useRef<HeaderMode>("full");
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const hideGnbRef = useRef(hideGnbOnScroll);

  hideGnbRef.current = hideGnbOnScroll;

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;

    tickingRef.current = true;

    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      let nextMode: HeaderMode = headerModeRef.current;

      if (currentScrollY <= topThreshold) {
        nextMode = "full";
      } else if (!hideGnbRef.current) {
        nextMode = "revealed";
      } else if (delta < 0) {
        /* 스크롤 업 시 즉시 GNB 노출 — 소량 스크롤에도 클릭 가능 */
        nextMode = "revealed";
      } else if (delta >= SCROLL_DIRECTION_DELTA) {
        nextMode = "hidden";
      }

      if (nextMode !== headerModeRef.current) {
        headerModeRef.current = nextMode;
        setHeaderMode(nextMode);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    });
  }, [topThreshold]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    handleScroll();
  }, [hideGnbOnScroll, handleScroll]);

  const revealHeader = useCallback(() => {
    if (headerModeRef.current === "hidden") {
      headerModeRef.current = "revealed";
      setHeaderMode("revealed");
      lastScrollYRef.current = window.scrollY;
    }
  }, []);

  return {
    headerMode,
    isAtTop: headerMode === "full",
    isGnbHidden: hideGnbOnScroll && headerMode === "hidden",
    isHeaderRevealed:
      headerMode === "revealed" || headerMode === "full",
    revealHeader,
  };
}
