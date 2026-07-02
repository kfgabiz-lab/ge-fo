"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createRafScrollHandler } from "@/lib/createThrottledScrollHandler";
import {
  resolveAtTop,
  resolveGnbScrollVisibility,
  type GnbScrollVisibility,
} from "@/lib/gnbScrollState";

const DEFAULT_TOP_THRESHOLD = 8;

export type HeaderMode = "full" | "hidden" | "revealed";

type UseHeaderScrollOptions = {
  /** 스크롤 이하 구간에서 투명(최상단) 상태 — main: 80 */
  topThreshold?: number;
  /** false면 모바일처럼 GNB 숨김 없이 full / revealed만 사용 */
  hideGnbOnScroll?: boolean;
};

function toHeaderMode(isAtTop: boolean, visibility: GnbScrollVisibility): HeaderMode {
  if (isAtTop) return "full";
  return visibility === "hidden" ? "hidden" : "revealed";
}

export function useHeaderScroll(options?: UseHeaderScrollOptions) {
  const topThreshold = options?.topThreshold ?? DEFAULT_TOP_THRESHOLD;
  const hideGnbOnScroll = options?.hideGnbOnScroll ?? true;
  const [isAtTop, setIsAtTop] = useState(true);
  const [headerMode, setHeaderMode] = useState<HeaderMode>("full");
  const isAtTopRef = useRef(true);
  const headerModeRef = useRef<HeaderMode>("full");
  const visibilityRef = useRef<GnbScrollVisibility>("visible");
  const anchorScrollYRef = useRef(0);
  const lastModeChangeAtRef = useRef(0);
  const hideGnbRef = useRef(hideGnbOnScroll);

  hideGnbRef.current = hideGnbOnScroll;

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const atTop = resolveAtTop(currentScrollY, isAtTopRef.current, topThreshold);

    if (atTop !== isAtTopRef.current) {
      isAtTopRef.current = atTop;
      setIsAtTop(atTop);
    }

    if (atTop) {
      visibilityRef.current = "visible";
      anchorScrollYRef.current = currentScrollY;
      lastModeChangeAtRef.current = Date.now();

      if (headerModeRef.current !== "full") {
        headerModeRef.current = "full";
        setHeaderMode("full");
      }
      return;
    }

    const result = resolveGnbScrollVisibility({
      currentScrollY,
      anchorScrollY: anchorScrollYRef.current,
      topThreshold,
      hideOnScroll: hideGnbRef.current,
      currentVisibility: visibilityRef.current,
      lastModeChangeAt: lastModeChangeAtRef.current,
      wasAtTop: isAtTopRef.current,
    });

    anchorScrollYRef.current = result.anchorScrollY;
    lastModeChangeAtRef.current = result.lastModeChangeAt;
    visibilityRef.current = result.visibility;

    const nextMode = toHeaderMode(false, result.visibility);
    if (nextMode !== headerModeRef.current) {
      headerModeRef.current = nextMode;
      setHeaderMode(nextMode);
    }
  }, [topThreshold]);

  useEffect(() => {
    isAtTopRef.current = resolveAtTop(
      window.scrollY,
      isAtTopRef.current,
      topThreshold,
    );
    anchorScrollYRef.current = window.scrollY;
    lastModeChangeAtRef.current = 0;
    setIsAtTop(isAtTopRef.current);
    updateScrollState();

    const handleScroll = createRafScrollHandler(updateScrollState);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [topThreshold, updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [hideGnbOnScroll, updateScrollState]);

  const revealHeader = useCallback(() => {
    if (headerModeRef.current === "hidden") {
      const now = Date.now();
      headerModeRef.current = "revealed";
      visibilityRef.current = "visible";
      anchorScrollYRef.current = window.scrollY;
      lastModeChangeAtRef.current = now;
      setHeaderMode("revealed");
    }
  }, []);

  return {
    headerMode,
    isAtTop,
    isGnbHidden: hideGnbOnScroll && headerMode === "hidden",
    isHeaderRevealed:
      headerMode === "revealed" || headerMode === "full",
    revealHeader,
  };
}
