"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GNB_CLOSE_EVENT } from "@/lib/navigation/gnbCloseEvent";
import { createThrottledScrollHandler } from "@/lib/createThrottledScrollHandler";
import {
  focusFirstMegaContent,
  handleMegaPanelArrowKey,
} from "@/lib/gnbKeyboardNav";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { getWindowScrollY, lockPageScroll, unlockPageScroll } from "@/lib/lenisScroll";
import {
  GNB_SCROLL_THROTTLE_MS,
  resolveAtTop,
  resolveGnbScrollVisibility,
  type GnbScrollVisibility,
} from "@/lib/gnbScrollState";
import {
  getGnbMegaPanelComponent,
  getMegaPanelClassName,
} from "@/components/layout/shared/gnb-mega";
import GnbGlobalTrigger, {
  GnbGlobalTriggerMainContent,
  GnbGlobalTriggerSubContent,
} from "@/components/layout/shared/GnbGlobalTrigger";
import GnbMobileGlobalSelect from "@/components/layout/shared/GnbMobileGlobalSelect";
import GnbSearchPanel from "@/components/layout/shared/GnbSearchPanel";
import GnbMobileMenuPanel from "@/components/layout/shared/GnbMobileMenuPanel";
import {
  isDevicesMegaMenu,
  resolveGnbNavItems,
  type FoGnbMenuApiNode,
  type GnbDevicesMegaMenu,
  type GnbNavItem,
} from "@/data/gnb";

import "@/assets/css/components/gnb.css";

const SCROLL_THRESHOLD = 3;
const MEGA_TRANSITION_MS = 0;

export type GnbMenuVariant = "main" | "markets";

type GnbMenuProps = {
  variant?: GnbMenuVariant;
  logoHref?: string;
  gnbMenuData?: FoGnbMenuApiNode[];
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  isAtTop?: boolean;
  isHeaderHidden?: boolean;
  isHeaderRevealed?: boolean;
  onRevealHeader?: () => void;
  breadcrumb?: ReactNode;
  showBreadcrumbNav?: boolean;
  onMegaOpenChange?: (open: boolean) => void;
  onMobileMenuOpenChange?: (open: boolean) => void;
  onSearchOpenChange?: (open: boolean) => void;
};

function getDefaultMegaState(
  navItems: GnbNavItem[],
  navId: string,
  pathname: string,
) {
  const nav = navItems.find((item) => item.id === navId);
  const menu = nav?.megaMenu;

  if (menu && isDevicesMegaMenu(menu)) {
    for (const category of menu.categories) {
      const matchedDepth3 = category.children.find(
        (depth3) => depth3.href && pathname.startsWith(depth3.href),
      );
      if (matchedDepth3) {
        return { categoryId: category.id, depth3Id: matchedDepth3.id };
      }
    }

    const firstCategory = menu.categories[0];
    const firstDepth3 = firstCategory?.children[0];

    return {
      categoryId: firstCategory?.id ?? "",
      depth3Id: firstDepth3?.id ?? "",
    };
  }

  return {
    categoryId: "",
    depth3Id: "",
  };
}

function getHeaderClassName(
  variant: GnbMenuVariant,
  isAtTop: boolean,
  isHeaderHidden: boolean,
  hasBreadcrumb: boolean,
  isMegaActive: boolean,
  isSearchOpen: boolean,
  isMobileMenuOpen: boolean,
  isHeaderRevealed: boolean,
  showBreadcrumbNav: boolean,
) {
  if (variant === "main") {
    const classes = ["main_header"];

    if (showBreadcrumbNav) {
      classes.push("main_header--breadcrumb-nav");
    }

    if (isAtTop) {
      classes.push("is-top");
    } else {
      classes.push("is-invert");
    }

    if (isMegaActive) {
      classes.push("is-mega-open");
    }

    if (isSearchOpen) {
      classes.push("is-search-open");
    }

    if (isHeaderRevealed) {
      classes.push("is-gnb-revealed");
    }

    if (isHeaderHidden) {
      classes.push("is-gnb-hidden");
    }

    if (isMobileMenuOpen) {
      classes.push("is-mobile-open");
    }

    return classes.join(" ");
  }

  const classes = ["gnb_menu_wrap"];

  if (hasBreadcrumb) {
    classes.push("sub_header");
  }

  if (isAtTop) {
    classes.push("is-top");
  } else {
    classes.push("is-invert");
  }

  if (isMegaActive) {
    classes.push("is-mega-open");
  }

  if (isSearchOpen) {
    classes.push("is-search-open");
  }

  if (isHeaderRevealed) {
    classes.push("is-gnb-revealed");
  }

  if (hasBreadcrumb && isHeaderHidden) {
    classes.push("is-gnb-hidden");
  } else if (isHeaderHidden) {
    classes.push("is-hidden");
  }

  if (isMobileMenuOpen) {
    classes.push("is-mobile-open");
  }

  return classes.join(" ");
}

export default function GnbMenu({
  variant = "markets",
  logoHref = "/main",
  gnbMenuData,
  devicesMegaMenu,
  isAtTop: isAtTopProp,
  isHeaderHidden: isHeaderHiddenProp,
  isHeaderRevealed: isHeaderRevealedProp,
  onRevealHeader,
  breadcrumb,
  showBreadcrumbNav = false,
  onMegaOpenChange,
  onMobileMenuOpenChange,
  onSearchOpenChange,
}: GnbMenuProps) {
  const pathname = usePathname();
  const navItems = useMemo(
    () => resolveGnbNavItems(gnbMenuData, devicesMegaMenu),
    [gnbMenuData, devicesMegaMenu],
  );
  const isMain = variant === "main";
  const logoIsH1 = pathname === "/main";
  const LogoTag = logoIsH1 ? "h1" : "div";
  const hasBreadcrumb = Boolean(breadcrumb);
  const isScrollControlled =
    isAtTopProp !== undefined && isHeaderHiddenProp !== undefined;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [internalAtTop, setInternalAtTop] = useState(true);
  const [internalHeaderHidden, setInternalHeaderHidden] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeDepth3Id, setActiveDepth3Id] = useState("");
  const internalAtTopRef = useRef(true);
  const scrollAnchorYRef = useRef(0);
  const scrollVisibilityRef = useRef<GnbScrollVisibility>("visible");
  const scrollModeChangeAtRef = useRef(0);
  const megaOpenScrollYRef = useRef(0);
  const navListRef = useRef<HTMLUListElement>(null);
  const megaPanelRef = useRef<HTMLDivElement>(null);
  const mobileShellRef = useRef<HTMLDivElement>(null);
  const megaTriggerRef = useRef<HTMLElement | null>(null);
  const focusMegaOnOpenRef = useRef(false);
  const [isMegaActive, setIsMegaActive] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [holdMegaDim, setHoldMegaDim] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [prevMegaActive, setPrevMegaActive] = useState(isMegaActive);
  const [prevSearchOpen, setPrevSearchOpen] = useState(isSearchOpen);
  const [prevShowMegaPanel, setPrevShowMegaPanel] = useState(false);

  const isAtTop = isScrollControlled ? isAtTopProp : internalAtTop;
  const isHeaderHidden = isScrollControlled
    ? isHeaderHiddenProp
    : internalHeaderHidden;
  const isHeaderRevealed = isScrollControlled
    ? (isHeaderRevealedProp ?? !isHeaderHidden)
    : !internalHeaderHidden;

  const activeNav = navItems.find((item) => item.id === activeNavId);
  const megaMenu = activeNav?.megaMenu;
  const showMegaPanel = Boolean(activeNavId && megaMenu);
  const isOverlayOpen = isMegaActive || isSearchOpen;
  const isDimMounted = isOverlayOpen || holdMegaDim;

  useModalFocusTrap(megaPanelRef, isMegaActive && showMegaPanel, {
    autoFocus: false,
    restoreFocus: false,
    additionalRefs: [navListRef],
  });

  useModalFocusTrap(mobileShellRef, isMobileMenuOpen, {
    autoFocus: true,
    restoreFocus: true,
  });

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsPanelOpen(false);
    setActiveNavId(null);
    setActiveCategoryId("");
    setActiveDepth3Id("");
    setIsMegaActive(false);
    setIsSearchOpen(false);
    setIsGlobalOpen(false);
    setHoldMegaDim(false);
    onMegaOpenChange?.(false);
    onSearchOpenChange?.(false);
    onMobileMenuOpenChange?.(false);
  }

  if (isMegaActive !== prevMegaActive) {
    setPrevMegaActive(isMegaActive);
    if (isMegaActive) {
      setHoldMegaDim(false);
    } else if (!isSearchOpen) {
      setHoldMegaDim(true);
    }
  }

  if (isSearchOpen !== prevSearchOpen) {
    setPrevSearchOpen(isSearchOpen);
    if (isSearchOpen) {
      setHoldMegaDim(false);
    } else if (!isMegaActive) {
      setHoldMegaDim(true);
    }
  }

  if (showMegaPanel !== prevShowMegaPanel) {
    setPrevShowMegaPanel(showMegaPanel);
    if (!showMegaPanel) {
      setIsPanelOpen(false);
    }
  }

  const mobileMenuId = isMain
    ? "main-header-mobile-menu"
    : "gnb-mobile-menu-sub";

  const openMega = useCallback(
    (navId: string) => {
      const nav = navItems.find((item) => item.id === navId);
      if (!nav?.megaMenu) {
        setIsMegaActive(false);
        setActiveNavId(null);
        onMegaOpenChange?.(false);
        return;
      }

      onRevealHeader?.();
      setIsSearchOpen(false);
      setIsGlobalOpen(false);
      onSearchOpenChange?.(false);

      const scrollY = getWindowScrollY();
      megaOpenScrollYRef.current = scrollY;
      lockPageScroll(scrollY);

      onMegaOpenChange?.(true);

      const defaults = getDefaultMegaState(navItems, navId, pathname);
      setIsMegaActive(true);
      setActiveNavId(navId);
      setActiveCategoryId(defaults.categoryId);
      setActiveDepth3Id(defaults.depth3Id);
      setIsPanelOpen(true);
    },
    [navItems, onMegaOpenChange, onRevealHeader, onSearchOpenChange, pathname],
  );

  const closeMega = useCallback(() => {
    if (!activeNavId && !isMegaActive) return;

    setIsPanelOpen(false);
    setActiveNavId(null);
    setActiveCategoryId("");
    setActiveDepth3Id("");
    setIsMegaActive(false);
    onMegaOpenChange?.(false);
  }, [activeNavId, isMegaActive, onMegaOpenChange]);

  const closeSearch = useCallback(() => {
    if (!isSearchOpen) return;
    setIsSearchOpen(false);
  }, [isSearchOpen]);

  const closeGlobal = useCallback(() => {
    if (!isGlobalOpen) return;
    setIsGlobalOpen(false);
  }, [isGlobalOpen]);

  const closeAllGnbMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsPanelOpen(false);
    setActiveNavId(null);
    setActiveCategoryId("");
    setActiveDepth3Id("");
    setIsMegaActive(false);
    setIsSearchOpen(false);
    setIsGlobalOpen(false);
    onMegaOpenChange?.(false);
    onSearchOpenChange?.(false);
    onMobileMenuOpenChange?.(false);
  }, [onMegaOpenChange, onMobileMenuOpenChange, onSearchOpenChange]);

  const toggleGlobal = useCallback(() => {
    if (isGlobalOpen) {
      closeGlobal();
      return;
    }

    closeMega();
    closeSearch();
    setIsMobileMenuOpen(false);
    onRevealHeader?.();
    setIsGlobalOpen(true);
  }, [
    closeGlobal,
    closeMega,
    closeSearch,
    isGlobalOpen,
    onRevealHeader,
  ]);

  const toggleSearch = useCallback(() => {
    if (isSearchOpen) {
      closeSearch();
      return;
    }

    closeMega();
    closeGlobal();
    setIsMobileMenuOpen(false);
    onRevealHeader?.();
    const scrollY = getWindowScrollY();
    megaOpenScrollYRef.current = scrollY;
    lockPageScroll(scrollY);
    setIsSearchOpen(true);
  }, [closeGlobal, closeMega, closeSearch, isSearchOpen, onRevealHeader]);

  const toggleMega = useCallback(
    (navId: string) => {
      if (activeNavId === navId) {
        closeMega();
        return;
      }
      openMega(navId);
    },
    [activeNavId, closeMega, openMega],
  );

  const getDepth1Items = useCallback(() => {
    if (!navListRef.current) return [] as HTMLElement[];
    return Array.from(
      navListRef.current.querySelectorAll<HTMLElement>(
        ":scope > li > button, :scope > li > a",
      ),
    );
  }, []);

  const focusMegaTrigger = useCallback(() => {
    const trigger = megaTriggerRef.current;
    if (!trigger) return;
    requestAnimationFrame(() => {
      trigger.focus();
    });
  }, []);

  const handleDepth1KeyDown = useCallback(
    (
      event: ReactKeyboardEvent<HTMLElement>,
      item: GnbNavItem,
      index: number,
    ) => {
      const items = getDepth1Items();

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + delta + items.length) % items.length;
        const nextEl = items[nextIndex];
        const nextItem = navItems[nextIndex];
        nextEl?.focus();

        if (isMegaActive) {
          if (nextItem?.megaMenu) {
            megaTriggerRef.current = nextEl;
            focusMegaOnOpenRef.current = true;
            openMega(nextItem.id);
          } else {
            closeMega();
          }
        }
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        items[0]?.focus();
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1]?.focus();
        return;
      }

      if (event.key === "ArrowDown" && item.megaMenu) {
        event.preventDefault();
        megaTriggerRef.current = event.currentTarget;
        if (activeNavId === item.id) {
          focusFirstMegaContent(megaPanelRef.current);
        } else {
          focusMegaOnOpenRef.current = true;
          openMega(item.id);
        }
        return;
      }

      if (event.key === "Escape" && isMegaActive) {
        event.preventDefault();
        closeMega();
        event.currentTarget.focus();
      }
    },
    [
      activeNavId,
      closeMega,
      getDepth1Items,
      isMegaActive,
      navItems,
      openMega,
    ],
  );

  const handleMegaPanelKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMega();
        focusMegaTrigger();
        return;
      }

      const result = handleMegaPanelArrowKey(event.nativeEvent);
      if (result === "trigger") {
        closeMega();
        focusMegaTrigger();
      }
    },
    [closeMega, focusMegaTrigger],
  );

  const closeMobileMenu = useCallback(() => {
    closeAllGnbMenus();
  }, [closeAllGnbMenus]);

  const handleGnbLinkClick = useCallback(() => {
    closeAllGnbMenus();
  }, [closeAllGnbMenus]);

  /** /main 에서만 로고 클릭 → 클라이언트 라우팅 대신 하드 리프레시 */
  const handleLogoClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      handleGnbLinkClick();
      if (pathname !== "/main") {
        return;
      }
      event.preventDefault();
      window.location.reload();
    },
    [handleGnbLinkClick, pathname],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;

      if (next) {
        closeMega();
        closeSearch();
        closeGlobal();
        const scrollY = getWindowScrollY();
        megaOpenScrollYRef.current = scrollY;
        lockPageScroll(scrollY);
      }

      return next;
    });
  }, [closeGlobal, closeMega, closeSearch]);

  useEffect(() => {
    onMegaOpenChange?.(isMegaActive);
  }, [isMegaActive, onMegaOpenChange]);

  useEffect(() => {
    onSearchOpenChange?.(isSearchOpen);
  }, [isSearchOpen, onSearchOpenChange]);

  useEffect(() => {
    if (!isGlobalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGlobal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeGlobal, isGlobalOpen]);

  useEffect(() => {
    const onGnbClose = () => {
      closeAllGnbMenus();
    };

    window.addEventListener(GNB_CLOSE_EVENT, onGnbClose);

    return () => {
      window.removeEventListener(GNB_CLOSE_EVENT, onGnbClose);
    };
  }, [closeAllGnbMenus]);

  useEffect(() => {
    if (isOverlayOpen || !holdMegaDim) return;

    const timer = setTimeout(() => setHoldMegaDim(false), MEGA_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [holdMegaDim, isOverlayOpen]);

  useEffect(() => {
    if (!showMegaPanel) return;

    setIsPanelOpen(true);
  }, [showMegaPanel, activeNavId]);

  useEffect(() => {
    if (!showMegaPanel || !isPanelOpen || !focusMegaOnOpenRef.current) return;

    focusMegaOnOpenRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      focusFirstMegaContent(megaPanelRef.current);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [showMegaPanel, isPanelOpen, activeNavId]);

  useEffect(() => {
    onMobileMenuOpenChange?.(isMobileMenuOpen);
  }, [isMobileMenuOpen, onMobileMenuOpenChange]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  useLayoutEffect(() => {
    const shouldLock = isOverlayOpen || isMobileMenuOpen;
    if (!shouldLock) return;

    const scrollY = megaOpenScrollYRef.current;
    lockPageScroll(scrollY);

    return () => {
      unlockPageScroll(scrollY);
    };
  }, [isMobileMenuOpen, isOverlayOpen]);

  useEffect(() => {
    if (!isDimMounted) return;

    document.body.classList.add("is-gnb-overlay-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (isSearchOpen) {
        closeSearch();
        return;
      }

      closeMega();
      focusMegaTrigger();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("is-gnb-overlay-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeMega,
    closeSearch,
    focusMegaTrigger,
    isDimMounted,
    isSearchOpen,
  ]);

  useEffect(() => {
    if (isScrollControlled) return;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const threshold = isMain ? 80 : SCROLL_THRESHOLD;

      if (isMobileMenuOpen || isOverlayOpen) {
        const atTop = resolveAtTop(
          currentScrollY,
          internalAtTopRef.current,
          threshold,
        );
        internalAtTopRef.current = atTop;
        setInternalAtTop(atTop);
        setInternalHeaderHidden(false);
        scrollVisibilityRef.current = "visible";
        scrollAnchorYRef.current = currentScrollY;
        return;
      }

      const previousVisibility = scrollVisibilityRef.current;
      const result = resolveGnbScrollVisibility({
        currentScrollY,
        anchorScrollY: scrollAnchorYRef.current,
        topThreshold: threshold,
        hideOnScroll: true,
        currentVisibility: previousVisibility,
        lastModeChangeAt: scrollModeChangeAtRef.current,
        wasAtTop: internalAtTopRef.current,
      });

      scrollAnchorYRef.current = result.anchorScrollY;
      scrollModeChangeAtRef.current = result.lastModeChangeAt;
      scrollVisibilityRef.current = result.visibility;
      internalAtTopRef.current = result.isAtTop;
      setInternalAtTop(result.isAtTop);
      setInternalHeaderHidden(result.visibility === "hidden");

      if (result.visibility === "hidden" && previousVisibility !== "hidden") {
        closeMega();
      }
    };

    internalAtTopRef.current = resolveAtTop(
      window.scrollY,
      internalAtTopRef.current,
      isMain ? 80 : SCROLL_THRESHOLD,
    );
    scrollAnchorYRef.current = window.scrollY;
    updateScrollState();
    const handleScroll = createThrottledScrollHandler(
      updateScrollState,
      GNB_SCROLL_THROTTLE_MS,
    );
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeMega, isMain, isMobileMenuOpen, isOverlayOpen, isScrollControlled]);

  const navList = (
    <ul
      ref={navListRef}
      className={isMain ? "main_header__nav-list" : "gnb_nav_list"}
    >
      {navItems.map((item, index) => {
        const hasMega = Boolean(item.megaMenu);
        const isMegaOpen = activeNavId === item.id;
        const isActive = hasMega && isMegaOpen;
        const itemClass = isMain
          ? isActive
            ? "main_header__nav-item is-active"
            : "main_header__nav-item"
          : isActive
            ? "depth_1 is-active"
            : "depth_1";

        if (hasMega) {
          const panelId = item.megaMenu?.panelId;

          return (
            <li key={item.id} className={itemClass}>
              <button
                type="button"
                className={isMain ? "main_header__nav-link" : "link"}
                aria-expanded={isMegaOpen}
                aria-haspopup="true"
                aria-controls={panelId}
                onPointerDown={() => onRevealHeader?.()}
                onClick={(event) => {
                  megaTriggerRef.current = event.currentTarget;
                  toggleMega(item.id);
                }}
                onKeyDown={(event) => handleDepth1KeyDown(event, item, index)}
              >
                {item.label}
              </button>
            </li>
          );
        }

        return (
          <li key={item.id} className={itemClass}>
            <Link
              href={item.href}
              prefetch={false}
              className={isMain ? "main_header__nav-link" : "link"}
              onClick={handleGnbLinkClick}
              onKeyDown={(event) => handleDepth1KeyDown(event, item, index)}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderGnbRow = (placement: "fixed" | "panel") => {
    const isPanel = placement === "panel";

    if (isMain) {
      const rowClassName = isPanel
        ? "main_header__gnb-row gnb_mobile_panel__gnb-row"
        : "main_header__gnb-row";

      return (
        <div className={rowClassName}>
          <div className="main_header__inner">
            {!isPanel ? (
              <LogoTag className="main_header__logo">
                <Link href={logoHref} prefetch={false} onClick={handleLogoClick}>
                  <img loading="eager" decoding="async"
                    src="/img/logo_white.svg"
                    alt=""
                    className="main_header__logo-img main_header__logo-img--white"
                    aria-hidden
                  />
                  <img loading="eager" decoding="async"
                    src="/img/logo.svg"
                    alt="LS ELECTRIC"
                    className="main_header__logo-img main_header__logo-img--dark"
                  />
                </Link>
              </LogoTag>
            ) : (
              <div className="gnb_mobile_global-slot">
                <GnbMobileGlobalSelect />
              </div>
            )}

            {!isPanel ? (
              <>
                <nav className="main_header__nav" aria-label="Main menu">
                  {navList}
                </nav>

                <div className="main_header__actions main_header__actions--desktop">
                  <button
                    type="button"
                    className={
                      isSearchOpen
                        ? "main_header__btn-search is-close"
                        : "main_header__btn-search"
                    }
                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                    aria-expanded={isSearchOpen}
                    aria-controls="gnb-search-panel"
                    onClick={toggleSearch}
                  >
                    <span className="ir">{isSearchOpen ? "close search" : "search"}</span>
                  </button>
                  <GnbGlobalTrigger
                    isOpen={isGlobalOpen}
                    onToggle={toggleGlobal}
                    onClose={closeGlobal}
                    wrapClassName="main_header__global-wrap"
                    buttonClassName="main_header__btn-global"
                  >
                    <GnbGlobalTriggerMainContent />
                  </GnbGlobalTrigger>
                </div>
              </>
            ) : null}

            <div className="main_header__actions main_header__actions--mobile">
              {!isPanel ? (
                <>
                  <button
                    type="button"
                    className={
                      isSearchOpen
                        ? "main_header__btn-search is-close"
                        : "main_header__btn-search"
                    }
                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                    aria-expanded={isSearchOpen}
                    aria-controls="gnb-search-panel"
                    onClick={toggleSearch}
                  >
                    <span className="ir">{isSearchOpen ? "close search" : "search"}</span>
                  </button>
                  <button
                    type="button"
                    className="btn_menu"
                    aria-label="Open menu"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls={mobileMenuId}
                    onClick={toggleMobileMenu}
                  >
                    <span className="ir">open menu</span>
                    <span className="icon_menu" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={
                      isSearchOpen
                        ? "main_header__btn-search is-close"
                        : "main_header__btn-search"
                    }
                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                    aria-expanded={isSearchOpen}
                    aria-controls="gnb-search-panel"
                    onClick={toggleSearch}
                  >
                    <span className="ir">{isSearchOpen ? "close search" : "search"}</span>
                  </button>
                  <button
                    type="button"
                    className="gnb_mobile_close"
                    aria-label="Close menu"
                    onClick={closeMobileMenu}
                  >
                    <span className="ir">close menu</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    const rowClassName = isPanel
      ? "sub_header__gnb-row gnb_mobile_panel__gnb-row"
      : "sub_header__gnb-row";

    return (
      <div className={rowClassName}>
        <div className="gnb_menu_inner">
          {!isPanel ? (
            <div className="logo">
              <Link href={logoHref} prefetch={false} onClick={handleGnbLinkClick}>
                <img loading="eager" decoding="async" src="/img/logo.svg" alt="LS ELECTRIC" />
              </Link>
            </div>
          ) : (
            <div className="gnb_mobile_global-slot">
              <GnbMobileGlobalSelect />
            </div>
          )}

          {!isPanel ? (
            <>
              <nav className="gnb_nav_wrap" aria-label="Main menu">
                {navList}
              </nav>

              <div className="btn_area btn_area--desktop">
                <button
                  type="button"
                  className={isSearchOpen ? "btn_search is-close" : "btn_search"}
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                  aria-expanded={isSearchOpen}
                  aria-controls="gnb-search-panel"
                  onClick={toggleSearch}
                >
                  <p className="ir">{isSearchOpen ? "close search" : "search"}</p>
                  <span className="icon_search" aria-hidden />
                </button>
                <GnbGlobalTrigger
                  isOpen={isGlobalOpen}
                  onToggle={toggleGlobal}
                  onClose={closeGlobal}
                  wrapClassName="gnb_global_wrap"
                  buttonClassName="btn_global"
                >
                  <GnbGlobalTriggerSubContent />
                </GnbGlobalTrigger>
              </div>
            </>
          ) : null}

          <div className="btn_area btn_area--mobile">
            {!isPanel ? (
              <>
                <button
                  type="button"
                  className={isSearchOpen ? "btn_search is-close" : "btn_search"}
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                  aria-expanded={isSearchOpen}
                  aria-controls="gnb-search-panel"
                  onClick={toggleSearch}
                >
                  <p className="ir">{isSearchOpen ? "close search" : "search"}</p>
                  <span className="icon_search" aria-hidden />
                </button>
                <button
                  type="button"
                  className="btn_menu"
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls={mobileMenuId}
                  onClick={toggleMobileMenu}
                >
                  <p className="ir">open menu</p>
                  <span className="icon_menu" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={isSearchOpen ? "btn_search is-close" : "btn_search"}
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                  aria-expanded={isSearchOpen}
                  aria-controls="gnb-search-panel"
                  onClick={toggleSearch}
                >
                  <p className="ir">{isSearchOpen ? "close search" : "search"}</p>
                  <span className="icon_search" aria-hidden />
                </button>
                <button
                  type="button"
                  className="gnb_mobile_close"
                  aria-label="Close menu"
                  onClick={closeMobileMenu}
                >
                  <p className="ir">close menu</p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const gnbMobilePanel = (
    <div
      ref={mobileShellRef}
      className={
        isMobileMenuOpen ? "gnb_mobile_shell is-open" : "gnb_mobile_shell"
      }
      aria-hidden={!isMobileMenuOpen}
    >
      {renderGnbRow("panel")}
      <nav
        id={mobileMenuId}
        className={
          isMobileMenuOpen ? "gnb_mobile_menu is-open" : "gnb_mobile_menu"
        }
        aria-label="Mobile menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <GnbMobileMenuPanel
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          navItems={navItems}
        />
      </nav>
    </div>
  );

  let megaPanel: ReactNode = null;

  if (showMegaPanel && megaMenu && activeNavId) {
    const PanelComponent = getGnbMegaPanelComponent(megaMenu);

    megaPanel = (
      <div
        ref={megaPanelRef}
        id={megaMenu.panelId}
        role="region"
        aria-label={`${activeNav?.label ?? ""} menu`}
        className={getMegaPanelClassName(megaMenu, isPanelOpen)}
        data-gnb-mega-root
        onKeyDown={handleMegaPanelKeyDown}
      >
        {isDevicesMegaMenu(megaMenu) ? (
          <PanelComponent
            categories={megaMenu.categories}
            activeCategoryId={activeCategoryId}
            activeDepth3Id={activeDepth3Id}
            onCategoryChange={setActiveCategoryId}
            onDepth3Change={setActiveDepth3Id}
            onLinkClick={handleGnbLinkClick}
            onClose={() => {
              closeMega();
              focusMegaTrigger();
            }}
          />
        ) : (
          <PanelComponent
            title={activeNav?.label ?? ""}
            menu={megaMenu}
            onItemClick={handleGnbLinkClick}
            onClose={() => {
              closeMega();
              focusMegaTrigger();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <header
        className={getHeaderClassName(
          variant,
          isAtTop,
          isHeaderHidden,
          hasBreadcrumb,
          isMegaActive,
          isSearchOpen,
          isMobileMenuOpen,
          isHeaderRevealed,
          showBreadcrumbNav,
        )}
      >
        {renderGnbRow("fixed")}

        {breadcrumb}

        {megaPanel}

        {gnbMobilePanel}

        {isMobileMenuOpen ? (
          <button
            type="button"
            className="gnb_mobile_dim"
            aria-label="Close menu"
            data-lenis-prevent
            onWheel={(event) => event.preventDefault()}
            onTouchMove={(event) => event.preventDefault()}
            onClick={closeMobileMenu}
          />
        ) : null}
      </header>

      <GnbSearchPanel isOpen={isSearchOpen} onNavigate={closeSearch} />

      {isDimMounted ? (
        <button
          type="button"
          className={isOverlayOpen ? "gnb_mega_dim is-open" : "gnb_mega_dim"}
          aria-label="Close menu"
          tabIndex={-1}
          data-lenis-prevent
          onWheel={(event) => event.preventDefault()}
          onTouchMove={(event) => event.preventDefault()}
          onClick={() => {
            closeMega();
            closeSearch();
          }}
        />
      ) : null}
    </>
  );
}
