"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 가로 스크롤 테이블의 "Swipe" 힌트 오버레이 표시 로직 (스크롤/터치/휠 감지 시 숨김).
// TrainingSessionDetailTableScroll(Agenda 표)와 WarrantyTableScroll에서 동일하게 사용.
// 마크업/클래스명은 기능별 BEM 네임스페이스가 달라 각 컴포넌트가 보유하고,
// 공통 동작(오버플로 감지 + 스와이프 인텐트 시 힌트 숨김)만 이 훅으로 승격.
export function useTableSwipeHint(enabled = true) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  // 힌트 미사용(enabled=false)이면 처음부터 숨김
  const [swipeHidden, setSwipeHidden] = useState(!enabled);

  const hideSwipe = useCallback(() => {
    setSwipeHidden(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const el = scrollRef.current;
    if (!el) return;

    // 가로 오버플로가 없으면 힌트 불필요 → 숨김
    const syncOverflow = () => {
      if (el.scrollWidth <= el.clientWidth + 1) {
        hideSwipe();
      }
    };

    const onScroll = () => {
      if (el.scrollLeft > 0) hideSwipe();
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;

      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);

      // 가로 스와이프 의도로 판단되면 힌트 숨김
      if (dx > 8 && dx >= dy) {
        hideSwipe();
        touchStartRef.current = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > 0 || el.scrollLeft > 0) {
        hideSwipe();
      }
    };

    syncOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", syncOverflow);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", syncOverflow);
    };
  }, [enabled, hideSwipe]);

  return { scrollRef, swipeHidden };
}
