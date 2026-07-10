"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GNB_CLOSE_EVENT } from "@/lib/navigation/gnbCloseEvent";
import { createThrottledScrollHandler } from "@/lib/createThrottledScrollHandler";
import { getLenisInstance, scrollWindowTo } from "@/lib/lenisScroll";
import {
  GNB_SCROLL_THROTTLE_MS,
  resolveAtTop,
  resolveGnbScrollVisibility,
  type GnbScrollVisibility,
} from "@/lib/gnbScrollState";
import {
  getMegaPanelClassName,
  gnbMegaPanelComponents,
  isGnbMegaPanelNavId,
} from "@/components/layout/shared/gnb-mega";
import GnbGlobalTrigger, {
  GnbGlobalTriggerMainContent,
  GnbGlobalTriggerSubContent,
} from "@/components/layout/shared/GnbGlobalTrigger";
import GnbSearchPanel from "@/components/layout/shared/GnbSearchPanel";
import { gnbNavItems, isDevicesMegaMenu } from "@/data/gnb";
import { resolveDevicesMegaStateFromPath } from "@/data/gnb/mega/devices";

import "@/assets/css/components/gnb.css";

const SCROLL_THRESHOLD = 3;
const MEGA_TRANSITION_MS = 350;

export type GnbMenuVariant = "main" | "markets";

type GnbMenuProps = {
  variant?: GnbMenuVariant;
  logoHref?: string;
  /** SubHeader / MainHeader에서 스크롤 상태를 넘기면 내부 scroll 리스너 비활성 */
  isAtTop?: boolean;
  isHeaderHidden?: boolean;
  isHeaderRevealed?: boolean;
  onRevealHeader?: () => void;
  /** breadcrumb를 header 내부에 렌더 */
  breadcrumb?: ReactNode;
  /** main GNB에서 breadcrumb_nav(경로) 표시 — 기본 숨김, markets 서브 등에서 사용 */
  showBreadcrumbNav?: boolean;
  onMegaOpenChange?: (open: boolean) => void;
  onMobileMenuOpenChange?: (open: boolean) => void;
  onSearchOpenChange?: (open: boolean) => void;
};

function getDefaultMegaState(navId: string, pathname: string) {
  const nav = gnbNavItems.find((item) => item.id === navId);
  const menu = nav?.megaMenu;

  if (menu && isDevicesMegaMenu(menu)) {
    const fromPath = resolveDevicesMegaStateFromPath(pathname);
    if (fromPath) {
      return fromPath;
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

  return classes.join(" ");
}

export default function GnbMenu({
  variant = "markets",
  logoHref = "/main",
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
  const isMain = variant === "main";
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
  const ignoreMegaScrollCloseUntilRef = useRef(0);
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

  const activeNav = gnbNavItems.find((item) => item.id === activeNavId);
  const megaMenu = activeNav?.megaMenu;
  const showMegaPanel = Boolean(activeNavId && megaMenu);
  const isOverlayOpen = isMegaActive || isSearchOpen;
  const isDimMounted = isOverlayOpen || holdMegaDim;

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
      const nav = gnbNavItems.find((item) => item.id === navId);
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
      onMegaOpenChange?.(true);
      megaOpenScrollYRef.current = window.scrollY;
      ignoreMegaScrollCloseUntilRef.current = Date.now() + 400;

      const defaults = getDefaultMegaState(navId, pathname);
      setIsPanelOpen(false);
      setIsMegaActive(true);
      setActiveNavId(navId);
      setActiveCategoryId(defaults.categoryId);
      setActiveDepth3Id(defaults.depth3Id);
      requestAnimationFrame(() => {
        setIsPanelOpen(true);
      });
    },
    [onMegaOpenChange, onRevealHeader, onSearchOpenChange, pathname],
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
    const scrollY = window.scrollY;
    megaOpenScrollYRef.current = scrollY;
    ignoreMegaScrollCloseUntilRef.current = Date.now() + 400;
    setIsSearchOpen(true);
    requestAnimationFrame(() => {
      if (window.scrollY !== scrollY) {
        scrollWindowTo(scrollY, { immediate: true });
      }
    });
  }, [closeGlobal, closeMega, closeSearch, isSearchOpen]);

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

  const closeMobileMenu = useCallback(() => {
    closeAllGnbMenus();
  }, [closeAllGnbMenus]);

  const handleGnbLinkClick = useCallback(() => {
    closeAllGnbMenus();
  }, [closeAllGnbMenus]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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

    const frame = requestAnimationFrame(() => {
      setIsPanelOpen(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [showMegaPanel, activeNavId]);

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

    document.body.style.overflow = "hidden";
    const lenis = getLenisInstance();
    lenis?.stop();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMegaActive) return;

    const scrollY = window.scrollY;
    const lenis = getLenisInstance();
    lenis?.stop();

    document.documentElement.classList.add("is-mega-open-scroll-lock");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.classList.remove("is-mega-open-scroll-lock");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      scrollWindowTo(scrollY, { immediate: true });
      lenis?.start();
    };
  }, [isMegaActive]);

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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("is-gnb-overlay-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeMega,
    closeSearch,
    isDimMounted,
    isSearchOpen,
  ]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const syncScrollAnchor = () => {
      megaOpenScrollYRef.current = window.scrollY;
    };

    syncScrollAnchor();
    const frame = requestAnimationFrame(syncScrollAnchor);

    const handleScroll = createThrottledScrollHandler(() => {
      if (Date.now() < ignoreMegaScrollCloseUntilRef.current) {
        return;
      }

      /* 레이아웃 변화·미세 스크롤 무시 — 실제 페이지 스크롤만 닫기 */
      if (Math.abs(window.scrollY - megaOpenScrollYRef.current) < 8) {
        return;
      }
      closeSearch();
    }, GNB_SCROLL_THROTTLE_MS);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeSearch, isSearchOpen]);

  useEffect(() => {
    if (isScrollControlled) return;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const threshold = isMain ? 80 : SCROLL_THRESHOLD;

      if (isMobileMenuOpen) {
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
  }, [closeMega, isMain, isMobileMenuOpen, isScrollControlled]);

  const navList = (
    <ul className={isMain ? "main_header__nav-list" : "gnb_nav_list"}>
      {gnbNavItems.map((item) => {
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
                onClick={() => toggleMega(item.id)}
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
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const gnbRow = isMain ? (
    <div className="main_header__gnb-row">
      <div className="main_header__inner">
        <h1 className="main_header__logo">
          <Link href={logoHref} prefetch={false} onClick={handleGnbLinkClick}>
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
        </h1>

        <nav className="main_header__nav" aria-label="주 메뉴">
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

        <div className="main_header__actions main_header__actions--mobile">
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
            className={
              isMobileMenuOpen
                ? "main_header__btn-menu is-active"
                : "main_header__btn-menu"
            }
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={toggleMobileMenu}
          >
            <span className="ir">
              {isMobileMenuOpen ? "close menu" : "open menu"}
            </span>
            <span className="main_header__icon-menu" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="sub_header__gnb-row">
      <div className="gnb_menu_inner">
        <h1 className="logo">
          <Link href={logoHref} prefetch={false} onClick={handleGnbLinkClick}>
            <img loading="eager" decoding="async" src="/img/logo.svg" alt="LS ELECTRIC" />
          </Link>
        </h1>

        <nav className="gnb_nav_wrap" aria-label="주 메뉴">
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

        <div className="btn_area btn_area--mobile">
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
            className={isMobileMenuOpen ? "btn_menu is-active" : "btn_menu"}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={toggleMobileMenu}
          >
            <p className="ir">{isMobileMenuOpen ? "close menu" : "open menu"}</p>
            <span className="icon_menu" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const mobileMenu = isMain ? (
    <>
      <nav
        id={mobileMenuId}
        className={
          isMobileMenuOpen
            ? "main_header__mobile-menu is-open"
            : "main_header__mobile-menu"
        }
        aria-label="모바일 메뉴"
        aria-hidden={!isMobileMenuOpen}
      >
        <ul className="main_header__mobile-list">
          {gnbNavItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                prefetch={false}
                className="main_header__mobile-link"
                onClick={handleGnbLinkClick}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {isMobileMenuOpen ? (
        <button
          type="button"
          className="main_header__mobile-dim"
          aria-label="메뉴 닫기"
          onClick={closeMobileMenu}
        />
      ) : null}
    </>
  ) : (
    <>
      <nav
        id={mobileMenuId}
        className={
          isMobileMenuOpen ? "gnb_mobile_menu is-open" : "gnb_mobile_menu"
        }
        aria-label="모바일 메뉴"
        aria-hidden={!isMobileMenuOpen}
      >
        <ul className="gnb_mobile_list">
          {gnbNavItems.map((item) => (
            <li key={item.id} className="depth_1">
              <Link href={item.href} prefetch={false} className="link" onClick={handleGnbLinkClick}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {isMobileMenuOpen ? (
        <button
          type="button"
          className="gnb_mobile_dim"
          aria-label="메뉴 닫기"
          onClick={closeMobileMenu}
        />
      ) : null}
    </>
  );

  let megaPanel: ReactNode = null;

  if (
    showMegaPanel &&
    megaMenu &&
    activeNavId &&
    isGnbMegaPanelNavId(activeNavId)
  ) {
    const PanelComponent = gnbMegaPanelComponents[activeNavId];

    megaPanel = (
      <div
        id={megaMenu.panelId}
        role="region"
        aria-label={`${activeNav?.label ?? ""} menu`}
        className={getMegaPanelClassName(megaMenu, isPanelOpen)}
      >
        {isDevicesMegaMenu(megaMenu) ? (
          <PanelComponent
            activeCategoryId={activeCategoryId}
            activeDepth3Id={activeDepth3Id}
            onCategoryChange={setActiveCategoryId}
            onDepth3Change={setActiveDepth3Id}
            onLinkClick={handleGnbLinkClick}
          />
        ) : (
          <PanelComponent onItemClick={handleGnbLinkClick} />
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
        {gnbRow}

        {breadcrumb}

        {megaPanel}

        {mobileMenu}
      </header>

      {isSearchOpen ? <GnbSearchPanel onNavigate={closeSearch} /> : null}

      {isDimMounted ? (
        <button
          type="button"
          className={isOverlayOpen ? "gnb_mega_dim is-open" : "gnb_mega_dim"}
          aria-label="메뉴 닫기"
          onClick={() => {
            closeMega();
            closeSearch();
          }}
        />
      ) : null}
    </>
  );
}
