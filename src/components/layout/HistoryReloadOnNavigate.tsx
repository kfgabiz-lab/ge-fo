"use client";

import { useEffect, useRef } from "react";
import { dispatchGnbClose } from "@/lib/navigation/gnbCloseEvent";
import { markBackForwardNavigation } from "@/lib/navigation/historyNavigation";

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

function isHashOnlyNavigation(target: URL, current: URL) {
  return (
    target.pathname === current.pathname &&
    target.search === current.search &&
    Boolean(target.hash) &&
    target.hash !== current.hash
  );
}

export default function HistoryReloadOnNavigate() {
  const pathnameRef = useRef<string>("");

  useEffect(() => {
    pathnameRef.current = window.location.pathname;
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const nextPathname = window.location.pathname;
      const previousPathname = pathnameRef.current;
      if (nextPathname === previousPathname) return;
      pathnameRef.current = nextPathname;
      markBackForwardNavigation();
      dispatchGnbClose();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        dispatchGnbClose();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

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
      window.location.href = targetUrl.href;
    };

    window.addEventListener("click", onDocumentClick, true);
    return () => window.removeEventListener("click", onDocumentClick, true);
  }, []);

  return null;
}
