"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";
import {
  isMarketsHeroSnapping,
  scrollToMarketsHeroNextSection,
} from "../lib/scrollToMarketsHeroNextSection";

export default function MarketsHeroScrollDown() {
  const lenis = useLenis();
  const isSnappingRef = useRef(false);

  const handleClick = () => {
    if (isSnappingRef.current || isMarketsHeroSnapping()) return;

    isSnappingRef.current = true;
    scrollToMarketsHeroNextSection({
      lenis,
      onComplete: () => {
        isSnappingRef.current = false;
      },
    });
  };

  return (
    <button
      type="button"
      className="markets_hero__scroll-down"
      onClick={handleClick}
      aria-label="Scroll down"
    >
      <img
        src="/ico/ico_scroll_down_30.svg"
        alt=""
        width={30}
        height={32}
        decoding="async"
        aria-hidden="true"
      />
    </button>
  );
}
