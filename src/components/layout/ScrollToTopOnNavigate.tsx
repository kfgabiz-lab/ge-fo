"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollWindowTo } from "@/lib/lenisScroll";

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

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    scrollToTopUnlessHash();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        scrollToTopUnlessHash();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    scrollToTopUnlessHash();
  }, [pathname]);

  return null;
}
