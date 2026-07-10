"use client";

import { useEffect, useState } from "react";

// 카운트업 애니메이션 지속 시간(ms)
const COUNT_DURATION = 1600;

// ease-out 3차 곡선 이징 함수
export function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

// target 값까지 0부터 카운트업하는 훅
// isActive가 true가 되면 delay(ms) 후 애니메이션 시작
export function useCountUp(target: number, isActive: boolean, delay = 0) {
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
        setValue(Math.round(easeOutCubic(progress) * target));

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
  }, [delay, isActive, target]);

  return value;
}
