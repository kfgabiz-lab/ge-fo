"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollWindowTo } from "@/lib/lenisScroll";
import {
  consumeBackForwardNavigation,
  isBackForwardNavigation,
} from "@/lib/navigation/historyNavigation";

function scrollToTop() {
  scrollWindowTo(0, { immediate: true });
}

function scrollToTopUnlessHash() {
  if (window.location.hash) {
    return;
  }

  scrollToTop();
  requestAnimationFrame(scrollToTop);
}

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }

    if (!isBackForwardNavigation()) {
      scrollToTopUnlessHash();
    }
  }, []);

  useLayoutEffect(() => {
    if (!consumeBackForwardNavigation()) {
      scrollToTopUnlessHash();
    }
  }, [pathname]);

  return null;
}
