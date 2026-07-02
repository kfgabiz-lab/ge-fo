"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isMainPath } from "@/lib/navigation/cross-section-nav";

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMainPath(pathname)) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMainPath(pathname) || window.location.hash) return;
    scrollToTop();
  }, [pathname]);

  return null;
}
