"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { dispatchGnbClose } from "@/lib/navigation/gnbCloseEvent";
import { isMainPath } from "@/lib/navigation/crossSectionNav";
import {
  clearHistoryNavigationPending,
  isBackForwardNavigation,
  isHistoryNavigationPending,
  markHistoryNavigationPending,
} from "@/lib/navigation/historyNavigation";

const IS_DEV = process.env.NODE_ENV === "development";
const HISTORY_RELOAD_DELAY_MS = 200;

function shouldIgnoreLinkClick(event: MouseEvent, anchor: HTMLAnchorElement) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    Boolean(anchor.target && anchor.target !== "_self") ||
    anchor.hasAttribute("download")
  );
}

function runHardNavigation() {
  clearHistoryNavigationPending();
  dispatchGnbClose();

  if (IS_DEV) {
    window.location.reload();
    return;
  }

  window.location.replace(window.location.href);
}

/**
 * 동일 출처 링크: location.href 전체 로드 (soft route 비활성).
 * 앞/뒤로: prod 200ms 후 replace / dev 즉시 reload.
 */
function isHashOnlyNavigation(target: URL, current: URL) {
  return (
    target.pathname === current.pathname &&
    target.search === current.search &&
    Boolean(target.hash) &&
    target.hash !== current.hash
  );
}

export default function HistoryReloadOnNavigate() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const scheduleHardNavigationRef = useRef<() => void>(() => {});

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    let reloadTimer: number | null = null;

    const scheduleHardNavigation = () => {
      if (IS_DEV) {
        runHardNavigation();
        return;
      }

      if (reloadTimer !== null) return;

      reloadTimer = window.setTimeout(() => {
        reloadTimer = null;
        runHardNavigation();
      }, HISTORY_RELOAD_DELAY_MS);
    };

    scheduleHardNavigationRef.current = scheduleHardNavigation;

    const onPopState = (event: Event) => {
      const nextPathname = window.location.pathname;
      if (nextPathname === pathnameRef.current) {
        return;
      }
      pathnameRef.current = nextPathname;

      markHistoryNavigationPending();

      if (IS_DEV) {
        event.stopImmediatePropagation();
        runHardNavigation();
        return;
      }

      scheduleHardNavigation();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      const pending = isHistoryNavigationPending();
      const onMainViaHistory =
        isMainPath(window.location.pathname) && isBackForwardNavigation();

      if (event.persisted || pending || onMainViaHistory) {
        markHistoryNavigationPending();
        scheduleHardNavigation();
      }
    };

    window.addEventListener("popstate", onPopState, true);
    window.addEventListener("pageshow", onPageShow, true);

    return () => {
      scheduleHardNavigationRef.current = () => {};
      if (reloadTimer !== null) {
        clearTimeout(reloadTimer);
      }
      window.removeEventListener("popstate", onPopState, true);
      window.removeEventListener("pageshow", onPageShow, true);
    };
  }, []);

  useEffect(() => {
    if (!isMainPath(pathname)) return;
    if (!isHistoryNavigationPending()) return;

    scheduleHardNavigationRef.current();
  }, [pathname]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (shouldIgnoreLinkClick(event, anchor)) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      let targetUrl: URL;
      try {
        targetUrl = new URL(rawHref, window.location.href);
      } catch {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;

      const currentUrl = new URL(window.location.href);

      if (rawHref.startsWith("#") || isHashOnlyNavigation(targetUrl, currentUrl)) {
        return;
      }

      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search &&
        targetUrl.hash === currentUrl.hash
      ) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      dispatchGnbClose();
      window.location.href = targetUrl.href;
    };

    window.addEventListener("click", onDocumentClick, true);
    return () => window.removeEventListener("click", onDocumentClick, true);
  }, []);

  return null;
}
