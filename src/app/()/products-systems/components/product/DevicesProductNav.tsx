"use client";

import { getLenisInstance } from "@/lib/lenisScroll";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { productDetailNavItems } from "../../data/productDetailContent";
import {
  getProductNavObserverRootMargin,
  isNearProductSection,
  resolveActiveProductSectionId,
  scrollToProductSection,
} from "../../lib/scrollToProductSection";

export type ProductNavItem = { id: string; label: string };

type ProductNavSectionId = string;

type DevicesProductNavProps = {
  navItems?: readonly ProductNavItem[];
};

const defaultNavItems: readonly ProductNavItem[] = productDetailNavItems;
const PENDING_LOCK_TIMEOUT_MS = 2500;

function readHashSectionId(sectionIds: ProductNavSectionId[]) {
  const hash = window.location.hash.replace(/^#/, "");
  return sectionIds.includes(hash) ? hash : null;
}

export default function DevicesProductNav({
  navItems = defaultNavItems,
}: DevicesProductNavProps) {
  const sectionIds: ProductNavSectionId[] = navItems.map((item) => item.id);
  const [activeId, setActiveId] = useState<ProductNavSectionId>(sectionIds[0]);
  const [hasSynced, setHasSynced] = useState(false);
  const pendingNavIdRef = useRef<ProductNavSectionId | null>(null);
  const pendingTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number | null>(null);

  const releasePendingLock = useCallback(() => {
    pendingNavIdRef.current = null;
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
  }, []);

  const lockPending = useCallback(
    (sectionId: ProductNavSectionId) => {
      releasePendingLock();
      pendingNavIdRef.current = sectionId;
      pendingTimeoutRef.current = window.setTimeout(
        releasePendingLock,
        PENDING_LOCK_TIMEOUT_MS,
      );
    },
    [releasePendingLock],
  );

  const syncActiveFromScroll = useCallback(
    (scrollDelta = 0) => {
      const pendingId = pendingNavIdRef.current;
      if (pendingId) {
        setActiveId((current) => (current === pendingId ? current : pendingId));
        return;
      }

      const next = resolveActiveProductSectionId(sectionIds, { scrollDelta });
      setActiveId((current) => (current === next ? current : next));
    },
    [sectionIds],
  );

  useLenis(
    useCallback(
      (lenis: Lenis) => {
        const current = lenis.scroll;
        const last = lastScrollYRef.current;
        lastScrollYRef.current = current;

        if (last === null) return;

        const scrollDelta = current - last;
        if (Math.abs(scrollDelta) < 0.5) return;

        syncActiveFromScroll(scrollDelta);
      },
      [syncActiveFromScroll],
    ),
  );

  useEffect(() => {
    const lenis = getLenisInstance();
    lastScrollYRef.current = lenis?.scroll ?? window.scrollY;
  }, []);

  useEffect(() => {
    return () => releasePendingLock();
  }, [releasePendingLock]);

  useEffect(() => {
    const syncFromHash = () => {
      const hashId = readHashSectionId(sectionIds);
      if (hashId) {
        releasePendingLock();
        setActiveId(hashId);
        return;
      }
      setActiveId(resolveActiveProductSectionId(sectionIds));
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [releasePendingLock, sectionIds]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) {
      setHasSynced(true);
      return;
    }

    syncActiveFromScroll();
    setHasSynced(true);

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(
        () => {
          syncActiveFromScroll();
        },
        {
          root: null,
          rootMargin: getProductNavObserverRootMargin(),
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );

      sections.forEach((section) => observer?.observe(section));
    } catch {
      return;
    }

    return () => observer?.disconnect();
  }, [sectionIds, syncActiveFromScroll]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: ProductNavSectionId,
  ) => {
    const navLink = event.currentTarget;
    event.preventDefault();
    setActiveId(sectionId);

    if (isNearProductSection(sectionId, 48, navLink)) {
      releasePendingLock();
      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, "", `#${sectionId}`);
      }
      return;
    }

    lockPending(sectionId);

    scrollToProductSection(sectionId, {
      navLink,
      onComplete: () => {
        setActiveId(sectionId);
        releasePendingLock();
      },
    });
  };

  return (
    <nav className="devices_product_nav" aria-label="Page sections">
      <ul className="devices_product_nav__list">
        {navItems.map((item) => {
          const isActive = hasSynced && activeId === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={
                  isActive
                    ? "devices_product_nav__link is-active"
                    : "devices_product_nav__link"
                }
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => handleNavClick(event, item.id)}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
