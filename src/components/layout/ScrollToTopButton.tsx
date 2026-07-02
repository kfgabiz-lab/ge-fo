"use client";

import { useCallback, useEffect, useState } from "react";
import { getLenisInstance, scrollWindowTo } from "@/lib/lenisScroll";

const SCROLL_THRESHOLD_PX = 400;

function scrollToTopSmooth() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) {
    scrollWindowTo(0, { immediate: true });
    return;
  }

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, { lerp: 0.12, duration: 1.1 });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback(() => {
    scrollToTopSmooth();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="scroll_to_top">
      <button
        type="button"
        className="scroll_to_top__btn"
        aria-label="Scroll to top"
        onClick={handleClick}
      >
        <span className="scroll_to_top__icon" aria-hidden="true" />
      </button>
    </div>
  );
}
