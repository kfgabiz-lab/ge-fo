"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_DURATION = 1600;

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function parseNumericStatValue(value: string) {
  const trimmed = value.trim();
  const useComma = trimmed.includes(",");
  const normalized = trimmed.replace(/,/g, "").replace(/\+$/, "");

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const target = Number(normalized);
  if (!Number.isFinite(target)) {
    return null;
  }

  const decimalPlaces = normalized.includes(".")
    ? normalized.split(".")[1]?.length ?? 0
    : 0;

  return { target, useComma, decimalPlaces };
}

export function formatAnimatedStatNumber(
  value: number,
  useComma: boolean,
  decimalPlaces: number,
) {
  if (decimalPlaces > 0) {
    return value.toFixed(decimalPlaces);
  }

  return useComma ? value.toLocaleString("en-US") : String(value);
}

export function useCountUp(target: number, isActive: boolean, delay = 0, decimalPlaces = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
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

        setValue(decimalPlaces > 0 ? Number(next.toFixed(decimalPlaces)) : Math.round(next));

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

export function useInViewOnce<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px 15% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isInView, threshold]);

  return { ref, isInView };
}
