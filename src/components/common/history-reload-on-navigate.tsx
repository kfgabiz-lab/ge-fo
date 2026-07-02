"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { dispatchGnbClose } from "@/lib/navigation/gnb-close-event";
import { isMainPath, isPageIndexPath } from "@/lib/navigation/cross-section-nav";
import {
  clearHistoryNavigationPending,
  isBackForwardNavigation,
  isHistoryNavigationPending,
  markHistoryNavigationPending,
} from "@/lib/navigation/history-navigation";

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
    pathnameRef.current = window.location.pathname;
  }, []);

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
      const previousPathname = pathnameRef.current;

      if (nextPathname === previousPathname) return;

      pathnameRef.current = nextPathname;

      if (isPageIndexPath(nextPathname)) {
        markHistoryNavigationPending();
        if (IS_DEV) {
          event.stopImmediatePropagation();
          runHardNavigation();
          return;
        }
        scheduleHardNavigation();
        return;
      }

      markHistoryNavigationPending();

      if (IS_DEV) {
        event.stopImmediatePropagation();
        runHardNavigation();
        return;
      }

      scheduleHardNavigation();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      const path = window.location.pathname;

      if (isPageIndexPath(path)) {
        if (event.persisted || isBackForwardNavigation() || isHistoryNavigationPending()) {
          markHistoryNavigationPending();
          scheduleHardNavigation();
        }
        return;
      }

      const pending = isHistoryNavigationPending();
      const onMainViaHistory = isMainPath(path) && isBackForwardNavigation();

      if (event.persisted || pending || onMainViaHistory) {
        markHistoryNavigationPending();
        scheduleHardNavigation();
      }
    };

    window.addEventListener("popstate", onPopState, true);
    window.addEventListener("pageshow", onPageShow, true);

    return () => {
      scheduleHardNavigationRef.current = () => {};
      if (reloadTimer !== null) clearTimeout(reloadTimer);
      window.removeEventListener("popstate", onPopState, true);
      window.removeEventListener("pageshow", onPageShow, true);
    };
  }, []);

  useEffect(() => {
    if (!isHistoryNavigationPending()) return;
    if (isMainPath(pathname) || isPageIndexPath(pathname)) {
      scheduleHardNavigationRef.current();
    }
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

      if (rawHref.startsWith("#") || isHashOnlyNavigation(targetUrl, currentUrl)) return;

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
