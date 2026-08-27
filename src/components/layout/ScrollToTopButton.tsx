"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenisInstance, scrollWindowTo } from "@/lib/lenisScroll";

const SCROLL_THRESHOLD_PX = 400;
const BASE_BOTTOM_DESKTOP_PX = 40;
const BASE_BOTTOM_MOBILE_PX = 20;
/** Pin relative to the footer’s bottom edge (allow sitting over the footer down to +40px). */
const FOOTER_SELECTOR = ".main_footer";

function getBaseBottomPx() {
  return window.matchMedia("(max-width: 780px)").matches
    ? BASE_BOTTOM_MOBILE_PX
    : BASE_BOTTOM_DESKTOP_PX;
}

function getFooterAwareBottomPx(baseBottom: number) {
  const footer = document.querySelector(FOOTER_SELECTOR);
  if (!footer) {
    return baseBottom;
  }

  // Stay at baseBottom until the footer bottom approaches the viewport bottom;
  // then keep baseBottom (40 desktop / 20 mobile) above the footer bottom.
  const footerBottom = footer.getBoundingClientRect().bottom;
  return Math.max(baseBottom, window.innerHeight - footerBottom + baseBottom);
}

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
  const rootRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef(BASE_BOTTOM_DESKTOP_PX);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const applyBottom = (nextBottom: number) => {
      const roundedBottom = Math.round(nextBottom);
      if (bottomRef.current === roundedBottom) {
        return;
      }

      bottomRef.current = roundedBottom;
      rootRef.current?.style.setProperty("bottom", `${roundedBottom}px`);
    };

    const update = () => {
      frameId = 0;
      const baseBottom = getBaseBottomPx();
      const visible = window.scrollY > SCROLL_THRESHOLD_PX;
      applyBottom(getFooterAwareBottomPx(baseBottom));
      setIsVisible((prev) => (prev === visible ? prev : visible));
    };

    const scheduleUpdate = () => {
      if (frameId !== 0) {
        return;
      }
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const handleClick = useCallback(() => {
    scrollToTopSmooth();
  }, []);

  return (
    <div
      ref={rootRef}
      className="scroll_to_top"
      hidden={!isVisible}
    >
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
