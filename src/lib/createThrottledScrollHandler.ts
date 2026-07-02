const DEFAULT_THROTTLE_MS = 100;

/** scroll 이벤트를 rAF + 시간 쓰로틀로 묶어 GNB 상태 갱신 빈도를 제한 */
export function createThrottledScrollHandler(
  handler: () => void,
  throttleMs = DEFAULT_THROTTLE_MS,
) {
  let lastRunAt = 0;
  let timeoutId: number | null = null;
  let rafId = 0;

  const invoke = () => {
    lastRunAt = Date.now();
    timeoutId = null;
    rafId = 0;
    handler();
  };

  const schedule = (delay: number) => {
    if (timeoutId !== null) return;

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      rafId = requestAnimationFrame(invoke);
    }, delay);
  };

  const throttled = () => {
    const now = Date.now();
    const elapsed = now - lastRunAt;

    if (elapsed >= throttleMs) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      rafId = requestAnimationFrame(invoke);
      return;
    }

    schedule(throttleMs - elapsed);
  };

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  return throttled;
}

export type ThrottledScrollHandler = ReturnType<typeof createThrottledScrollHandler>;

/** scroll 이벤트를 rAF로 묶어 is-at-top 등 즉시 반영이 필요한 상태에 사용 */
export function createRafScrollHandler(handler: () => void) {
  let rafId = 0;

  const scheduled = () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      rafId = 0;
      handler();
    });
  };

  scheduled.cancel = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  return scheduled;
}

export type RafScrollHandler = ReturnType<typeof createRafScrollHandler>;
