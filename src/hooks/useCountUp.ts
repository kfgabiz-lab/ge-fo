"use client";

import { useEffect, useState } from "react";

const COUNT_DURATION = 1600;

export function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useCountUp(
  target: number,
  isActive: boolean,
  delay = 0,
  decimalPlaces = 0,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
    }

    const format = (next: number) =>
      decimalPlaces > 0
        ? Number(next.toFixed(decimalPlaces))
        : Math.round(next);

    if (prefersReducedMotion()) {
      const delayTimeout = window.setTimeout(() => {
        setValue(format(target));
      }, delay);
      return () => window.clearTimeout(delayTimeout);
    }

    let frameId = 0;
    let startTime: number | null = null;

    const delayTimeout = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / COUNT_DURATION, 1);
        const next = easeOutCubic(progress) * target;

        setValue(format(next));

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };

      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(delayTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [decimalPlaces, delay, isActive, target]);

  return value;
}
