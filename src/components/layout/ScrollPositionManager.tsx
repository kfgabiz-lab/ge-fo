"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createThrottledScrollHandler } from "@/lib/createThrottledScrollHandler";
import { getLenisInstance, getWindowScrollY, scrollWindowTo } from "@/lib/lenisScroll";
import {
  consumeBackForwardNavigation,
  isBackForwardNavigation,
} from "@/lib/navigation/historyNavigation";
import {
  consumeScrollReturnIntent,
  getSavedScrollPosition,
  saveScrollPosition,
} from "@/lib/navigation/scrollPositionMemory";

// 이 앱은 이동이 거의 다 하드 리로드라서, 매 페이지 로드마다 Next가 설정하는
// history.scrollRestoration("manual")과 브라우저 네이티브 복원이 서로 경쟁하고,
// 그 타이밍은 로드마다 달라 복원이 아예 무산되기도 한다(특히 콘텐츠를 client fetch로
// 늦게 채우는 목록 페이지). 그래서 네이티브 복원에 기대지 않고 이 컴포넌트가 직접
// 스크롤 위치를 저장해 뒀다가 복원한다.
const SAVE_THROTTLE_MS = 200;
const RESTORE_POLL_MS = 150;
const RESTORE_MAX_ATTEMPTS = 30; // 약 4.5초
const RESTORE_SETTLE_EPSILON = 2;

function currentPathWithSearch() {
  return window.location.pathname + window.location.search;
}

function scrollToTopUnlessHash() {
  if (window.location.hash) {
    return;
  }

  restoreScrollWhenReady(0);
}

/**
 * 목표 위치로 즉시 스크롤을 시도하고, 콘텐츠가 client fetch로 늦게 채워지는
 * 페이지를 위해 문서 높이가 목표에 도달할 때까지(또는 시간 제한까지) 재시도한다.
 * target이 0(top)이어도 동일한 메커니즘을 타는데, Lenis가 준비되기 전
 * scrollTo(0) 단발 호출이 조용히 씹혀 그 자리에 남아있는 경우가 있어서다.
 * 사용자가 직접 스크롤/터치를 하면 그 의도를 존중해 즉시 포기한다.
 */
function restoreScrollWhenReady(targetY: number) {
  let attempts = 0;
  let cancelled = false;
  let observer: MutationObserver | null = null;
  let timeoutId: number | null = null;

  const cancel = () => {
    if (cancelled) return;
    cancelled = true;
    observer?.disconnect();
    if (timeoutId != null) window.clearTimeout(timeoutId);
    window.removeEventListener("wheel", onUserInteraction);
    window.removeEventListener("touchstart", onUserInteraction);
  };

  const onUserInteraction = () => cancel();

  const driveScroll = () => {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const clampedTarget = Math.min(targetY, maxScroll);

    // 네이티브 scrollTo를 먼저 직접 적용한다 — Lenis가 초기화 시점의(짧았던) 문서
    // 높이로 캐싱해 둔 범위 때문에 프로그래매틱 scrollTo를 조용히 무시하는 경우가
    // 있어(특히 하드 리로드 직후), 실제 브라우저 스크롤 위치부터 확실히 옮겨 둔다.
    window.scrollTo({ top: clampedTarget, behavior: "auto" });
    scrollWindowTo(clampedTarget, { immediate: true });

    return { maxScroll, clampedTarget };
  };

  let scheduled = false;

  // MutationObserver는 DOM이 바뀔 때마다(문서 안 어디서든) 콜백을 촉발하는데,
  // resize()/scrollTo 자체가 클래스나 속성 변화를 유발하면 attempt→mutation→attempt로
  // 서로를 즉시 재호출하는 피드백 루프가 생겨 실제 스크롤이 한 번도 안착할 시간을 못 얻는다.
  // 그래서 트리거 방식과 무관하게 실제 attempt 실행은 최소 간격을 두고 한 번만 예약한다.
  const scheduleAttempt = (delay: number) => {
    if (cancelled || scheduled) return;
    scheduled = true;
    timeoutId = window.setTimeout(() => {
      scheduled = false;
      attempt();
    }, delay);
  };

  const attempt = () => {
    if (cancelled) return;
    attempts += 1;

    // requestAnimationFrame은 백그라운드/숨김 탭에서 아예 멈출 수 있어(브라우저가
    // rAF를 완전히 정지시킴) 여기서는 쓰지 않는다 — setTimeout은 그런 탭에서도
    // (느려지더라도) 결국 실행된다.
    getLenisInstance()?.resize();
    const { maxScroll, clampedTarget } = driveScroll();

    // 두 가지를 모두 만족해야 "도달"로 본다: (1) 문서가 실제로 목표 지점을 담을
    // 만큼 자랐는가(그렇지 않으면 clampedTarget=0 등으로 조용히 클램프된 걸
    // 성공으로 오인함 — 특히 목록이 아직 client fetch로 안 채워진 첫 시도에서),
    // (2) 실제 스크롤 위치가 그 지점에 붙었는가(Lenis가 아직 준비 안 됐을 수 있음).
    const reached =
      maxScroll + RESTORE_SETTLE_EPSILON >= targetY &&
      Math.abs(getWindowScrollY() - clampedTarget) <= RESTORE_SETTLE_EPSILON;

    if (reached || attempts >= RESTORE_MAX_ATTEMPTS) {
      cancel();
      return;
    }

    scheduleAttempt(RESTORE_POLL_MS);
  };

  window.addEventListener("wheel", onUserInteraction, { passive: true, once: true });
  window.addEventListener("touchstart", onUserInteraction, { passive: true, once: true });

  observer = new MutationObserver(() => {
    scheduleAttempt(RESTORE_POLL_MS);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  attempt();
}

function handleEntry(isReturning: boolean) {
  if (isReturning) {
    const saved = getSavedScrollPosition(currentPathWithSearch());
    if (saved != null && saved > 0) {
      restoreScrollWhenReady(saved);
      return;
    }
  }

  scrollToTopUnlessHash();
}

export default function ScrollPositionManager() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // consumeScrollReturnIntent()는 플래그를 소모하므로 단락 평가로 건너뛰지
    // 않도록 항상 먼저 호출한다.
    const hasReturnIntent = consumeScrollReturnIntent();
    handleEntry(isBackForwardNavigation() || hasReturnIntent);
  }, []);

  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const hasReturnIntent = consumeScrollReturnIntent();
    handleEntry(consumeBackForwardNavigation() || hasReturnIntent);
  }, [pathname]);

  // beforeunload/pagehide 타이밍에만 기대지 않고, 스크롤할 때마다 현재 위치를 계속 기억해 둔다.
  useEffect(() => {
    const save = () => saveScrollPosition(currentPathWithSearch(), getWindowScrollY());
    const throttledSave = createThrottledScrollHandler(save, SAVE_THROTTLE_MS);

    window.addEventListener("scroll", throttledSave, { passive: true });
    window.addEventListener("pagehide", save);

    return () => {
      throttledSave.cancel();
      window.removeEventListener("scroll", throttledSave);
      window.removeEventListener("pagehide", save);
    };
  }, [pathname]);

  // 이미 이 페이지에 있는 채로 GNB 등에서 같은 URL을 다시 클릭하면
  // HistoryReloadOnNavigate가 "이미 그 페이지"라고 보고 아무 것도 안 하고 넘겨버려
  // (리로드도 리마운트도 없음) 스크롤이 그 자리에 그대로 남는다. 그 클릭을 여기서
  // 직접 감지해 새로 진입한 것처럼 top으로 되돌린다.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      let targetUrl: URL;
      try {
        targetUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.hash) return; // 페이지 내 앵커 이동은 top으로 되돌리지 않는다.
      if (
        targetUrl.pathname !== window.location.pathname ||
        targetUrl.search !== window.location.search
      ) {
        return;
      }

      saveScrollPosition(currentPathWithSearch(), 0);
      scrollToTopUnlessHash();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return null;
}
