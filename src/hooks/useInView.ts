"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// 요소가 뷰포트에 최초 1회 진입했는지 감지하는 훅
// 내부에서 ref를 생성해 반환하며, 진입 감지 후 옵저버를 해제한다
// rootMargin을 지정하면 진입 감지 여백을 조정할 수 있다(미지정 시 기본 동작)
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
