"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function useInView<T extends HTMLElement>(
  threshold = 0.25,
  rootMargin?: string,
): { ref: RefObject<T | null>; isInView: boolean } {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isInView };
}
