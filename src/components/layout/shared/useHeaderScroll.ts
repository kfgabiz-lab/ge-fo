"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createRafScrollHandler } from "@/lib/createThrottledScrollHandler";
import { getWindowScrollY } from "@/lib/lenisScroll";
import {
  resolveAtTop,
  resolveGnbScrollVisibility,
  type GnbScrollVisibility,
} from "@/lib/gnbScrollState";

const DEFAULT_TOP_THRESHOLD = 8;

export type HeaderMode = "full" | "hidden" | "revealed";

type UseHeaderScrollOptions = {
  topThreshold?: number;
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
    if (!hideGnbRef.current) return;

    const currentScrollY = getWindowScrollY();
    const wasAtTop = isAtTopRef.current;
    const atTop = resolveAtTop(currentScrollY, wasAtTop, topThreshold);

    if (atTop !== wasAtTop) {
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

    if (wasAtTop) {
      const now = Date.now();
      visibilityRef.current = "hidden";
      anchorScrollYRef.current = currentScrollY;
      lastModeChangeAtRef.current = now;

      if (headerModeRef.current !== "hidden") {
        headerModeRef.current = "hidden";
        setHeaderMode("hidden");
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
      wasAtTop: false,
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
    isAtTopRef.current = true;
    headerModeRef.current = "full";
    visibilityRef.current = "visible";
    anchorScrollYRef.current = getWindowScrollY();
    lastModeChangeAtRef.current = 0;
    setIsAtTop(true);
    setHeaderMode("full");
    updateScrollState();

    const handleScroll = createRafScrollHandler(updateScrollState);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [topThreshold, updateScrollState]);

  useEffect(() => {
    if (!hideGnbOnScroll) return;
    updateScrollState();
  }, [hideGnbOnScroll, updateScrollState]);

  const revealHeader = useCallback(() => {
    if (headerModeRef.current === "hidden") {
      const now = Date.now();
      headerModeRef.current = "revealed";
      visibilityRef.current = "visible";
      anchorScrollYRef.current = getWindowScrollY();
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
