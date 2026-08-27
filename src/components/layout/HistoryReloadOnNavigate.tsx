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
      // 링크 클릭과 동일하게 뒤로/앞으로가기도 하드 리로드시킨다 — Next.js 소프트
      // 네비게이션이 이전 컴포넌트 인스턴스를 그대로 재사용해 목록 페이지의
      // 검색어/페이지 복원 로직(마운트 시 1회 실행)이 아예 실행되지 않는 문제 때문.
      window.location.reload();
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
