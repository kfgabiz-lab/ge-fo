"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GNB_CLOSE_EVENT } from "@/lib/navigation/gnbCloseEvent";
import {
  getMegaPanelClassName,
  gnbMegaPanelComponents,
  isGnbMegaPanelNavId,
} from "@/components/layout/shared/gnb-mega";
import {
  getFirstSimpleMegaItemId,
  isDevicesMegaMenu,
  isSimpleMegaMenu,
} from "@/data/gnb";
import { devicesMegaMenu } from "@/data/gnb/mega/devices";
import { marketsMegaMenu } from "@/data/gnb/mega/markets";
import type { GnbNavItem, GnbSimpleMegaItem } from "@/data/gnb/types";
import { fetchGnbMenus } from "@/lib/api/fo/gnbApi";
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
  onMegaOpenChange?: (open: boolean) => void;
  onMobileMenuOpenChange?: (open: boolean) => void;
};

function getDefaultMegaState(navId: string, navItems: GnbNavItem[]) {
  const nav = navItems.find((item) => item.id === navId);
  const menu = nav?.megaMenu;

  if (menu && isSimpleMegaMenu(menu)) {
    return {
      categoryId: "",
      depth3Id: "",
      simpleItemId: getFirstSimpleMegaItemId(menu),
    };
  }

  if (menu && isDevicesMegaMenu(menu)) {
    const firstCategory = menu.categories[0];
    const firstDepth3 = firstCategory?.children[0];

    return {
      categoryId: firstCategory?.id ?? "",
      depth3Id: firstDepth3?.id ?? "",
      simpleItemId: "",
    };
  }

  return {
    categoryId: "",
    depth3Id: "",
    simpleItemId: "",
  };
}

function getHeaderClassName(
  variant: GnbMenuVariant,
  isAtTop: boolean,
  isHeaderHidden: boolean,
  hasBreadcrumb: boolean,
  isMegaActive: boolean,
  isMobileMenuOpen: boolean,
  isHeaderRevealed: boolean,
) {
  if (variant === "main") {
    const classes = ["main_header"];

    if (isAtTop) {
      classes.push("is-top");
    } else {
      classes.push("is-invert");
    }

    if (isMegaActive) {
      classes.push("is-mega-open");
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

  const classes = ["gnb_menu_wrap", "markets"];

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
  onMegaOpenChange,
  onMobileMenuOpenChange,
}: GnbMenuProps) {
  const pathname = usePathname();
  const isMain = variant === "main";
  const hasBreadcrumb = Boolean(breadcrumb);
  const isScrollControlled =
    isAtTopProp !== undefined && isHeaderHiddenProp !== undefined;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [internalAtTop, setInternalAtTop] = useState(true);
  const [internalHeaderHidden, setInternalHeaderHidden] = useState(false);

  // API 기반 GNB 탭 목록 — DB에 등록된 메뉴만 표시
  const [navItems, setNavItems] = useState<GnbNavItem[]>([]);
  // Markets 하위 메뉴 — API children을 GnbSimpleMegaItem 형태로 변환
  const [marketApiItems, setMarketApiItems] = useState<GnbSimpleMegaItem[]>([]);

  useEffect(() => {
    fetchGnbMenus()
      .then((menus) => {
        const items: GnbNavItem[] = menus.map((menu) => {
          const name = menu.name.toLowerCase();

          if (name.includes('devices')) {
            // Devices: hover 시 열리는 드롭다운은 기존 하드코딩 유지
            return { id: 'devices', label: menu.name, href: menu.url ?? '', megaMenu: devicesMegaMenu };
          }

          if (name.includes('market')) {
            // Markets: API children으로 드롭다운 구성
            const children: GnbSimpleMegaItem[] = menu.children.map((child) => ({
              id: String(child.id),
              title: child.name,
              href: child.url ?? '',
            }));
            setMarketApiItems(children);
            return { id: 'markets', label: menu.name, href: menu.url ?? '', megaMenu: marketsMegaMenu };
          }

          // 그 외: 단순 링크
          return { id: String(menu.id), label: menu.name, href: menu.url ?? '' };
        });

        setNavItems(items);
      })
      .catch(() => {
        // API 실패 시 빈 GNB 유지
      });
  }, []);
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeDepth3Id, setActiveDepth3Id] = useState("");
  const [activeSimpleItemId, setActiveSimpleItemId] = useState("");
  const [megaView, setMegaView] = useState<"category" | "explore-all">(
    "category",
  );
  const lastScrollYRef = useRef(0);
  const megaOpenScrollYRef = useRef(0);
  const ignoreMegaScrollCloseUntilRef = useRef(0);
  const [isMegaActive, setIsMegaActive] = useState(false);
  const [isDimMounted, setIsDimMounted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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

  const mobileMenuId = isMain
    ? "main-header-mobile-menu"
    : "gnb-mobile-menu-markets";

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
      onMegaOpenChange?.(true);
      megaOpenScrollYRef.current = window.scrollY;
      ignoreMegaScrollCloseUntilRef.current = Date.now() + 400;

      const defaults = getDefaultMegaState(navId, navItems);
      setIsPanelOpen(false);
      setIsMegaActive(true);
      setActiveNavId(navId);
      setActiveCategoryId(defaults.categoryId);
      setActiveDepth3Id(defaults.depth3Id);
      setActiveSimpleItemId(defaults.simpleItemId);
      setMegaView("category");
      requestAnimationFrame(() => {
        setIsPanelOpen(true);
      });
    },
    [onMegaOpenChange, onRevealHeader],
  );

  const closeMega = useCallback(() => {
    if (!activeNavId && !isMegaActive) return;

    setIsPanelOpen(false);
    setActiveNavId(null);
    setActiveCategoryId("");
    setActiveDepth3Id("");
    setActiveSimpleItemId("");
    setMegaView("category");
    setIsMegaActive(false);
    onMegaOpenChange?.(false);
  }, [activeNavId, isMegaActive, onMegaOpenChange]);

  const closeAllGnbMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsPanelOpen(false);
    setActiveNavId(null);
    setActiveCategoryId("");
    setActiveDepth3Id("");
    setActiveSimpleItemId("");
    setMegaView("category");
    setIsMegaActive(false);
    onMegaOpenChange?.(false);
    onMobileMenuOpenChange?.(false);
  }, [onMegaOpenChange, onMobileMenuOpenChange]);

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

  const openExploreAll = useCallback(() => {
    setMegaView("explore-all");
  }, []);

  const backToCategoryMega = useCallback(() => {
    setMegaView("category");
  }, []);

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
    closeAllGnbMenus();
  }, [pathname, closeAllGnbMenus]);

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
    if (isMegaActive) {
      setIsDimMounted(true);
      return;
    }

    const timer = setTimeout(() => setIsDimMounted(false), MEGA_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [isMegaActive]);

  useEffect(() => {
    if (!showMegaPanel) {
      setIsPanelOpen(false);
      return;
    }

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
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMegaActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (megaView === "explore-all") {
          backToCategoryMega();
        } else {
          closeMega();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [backToCategoryMega, closeMega, isMegaActive, megaView]);

  useEffect(() => {
    if (!isMegaActive) return;

    const syncScrollAnchor = () => {
      megaOpenScrollYRef.current = window.scrollY;
    };

    syncScrollAnchor();
    const frame = requestAnimationFrame(syncScrollAnchor);

    const handleScroll = () => {
      if (Date.now() < ignoreMegaScrollCloseUntilRef.current) {
        return;
      }

      /* 레이아웃 변화·미세 스크롤 무시 — 실제 페이지 스크롤만 닫기 */
      if (Math.abs(window.scrollY - megaOpenScrollYRef.current) < 8) {
        return;
      }
      closeMega();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeMega, isMegaActive]);

  useEffect(() => {
    if (isScrollControlled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = isMain ? 80 : SCROLL_THRESHOLD;
      const atTop = currentScrollY <= threshold;

      setInternalAtTop(atTop);

      if (isMobileMenuOpen) {
        setInternalHeaderHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (atTop) {
        setInternalHeaderHidden(false);
      } else if (currentScrollY > lastScrollYRef.current) {
        setInternalHeaderHidden(true);
        closeMega();
      } else if (currentScrollY < lastScrollYRef.current) {
        setInternalHeaderHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [closeMega, isMain, isMobileMenuOpen, isScrollControlled]);

  const navList = (
    <ul className={isMain ? "main_header__nav-list" : "gnb_nav_list"}>
      {navItems.map((item) => {
        const hasMega = Boolean(item.megaMenu);
        const isActive = activeNavId === item.id;
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
                aria-expanded={isActive}
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
              src="/img/logo_white.png"
              alt=""
              className="main_header__logo-img main_header__logo-img--white"
              aria-hidden
            />
            <img loading="eager" decoding="async"
              src="/img/logo.png"
              alt="LS ELECTRIC"
              className="main_header__logo-img main_header__logo-img--dark"
            />
          </Link>
        </h1>

        <nav className="main_header__nav" aria-label="주 메뉴">
          {navList}
        </nav>

        <div className="main_header__actions main_header__actions--desktop">
          <button type="button" className="main_header__btn-search">
            <span className="ir">search</span>
          </button>
          <button type="button" className="main_header__btn-global">
            <span className="ir">global</span>
          </button>
        </div>

        <div className="main_header__actions main_header__actions--mobile">
          <button type="button" className="main_header__btn-search">
            <span className="ir">search</span>
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
            <img loading="eager" decoding="async" src="/img/logo.png" alt="LS ELECTRIC" />
          </Link>
        </h1>

        <nav className="gnb_nav_wrap" aria-label="주 메뉴">
          {navList}
        </nav>

        <div className="btn_area btn_area--desktop">
          <button type="button" className="btn_search">
            <p className="ir">search</p>
            <span className="icon_search" />
          </button>
          <button type="button" className="btn_global">
            <p className="ir">global</p>
            <span className="icon_global" />
          </button>
        </div>

        <div className="btn_area btn_area--mobile">
          <button type="button" className="btn_search">
            <p className="ir">search</p>
            <span className="icon_search" />
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
          {navItems.map((item) => (
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
          {navItems.map((item) => (
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
        className={getMegaPanelClassName(megaMenu, megaView, isPanelOpen)}
      >
        {isDevicesMegaMenu(megaMenu) ? (
          <PanelComponent
            activeCategoryId={activeCategoryId}
            activeDepth3Id={activeDepth3Id}
            onCategoryChange={setActiveCategoryId}
            onDepth3Change={setActiveDepth3Id}
            megaView={megaView}
            onExploreAllClick={openExploreAll}
            onExploreAllBack={backToCategoryMega}
            onLinkClick={handleGnbLinkClick}
          />
        ) : (
          <PanelComponent
            activeItemId={activeSimpleItemId}
            onItemEnter={setActiveSimpleItemId}
            onItemClick={handleGnbLinkClick}
            // markets 패널에 API items 전달 (있을 때만)
            {...(activeNavId === 'markets' && marketApiItems.length > 0
              ? { items: marketApiItems }
              : {})}
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
          isMobileMenuOpen,
          isHeaderRevealed,
        )}
      >
        {gnbRow}

        {breadcrumb}

        {megaPanel}

        {mobileMenu}
      </header>

      {isDimMounted ? (
        <button
          type="button"
          className={isMegaActive ? "gnb_mega_dim is-open" : "gnb_mega_dim"}
          aria-label="메뉴 닫기"
          onClick={closeMega}
        />
      ) : null}
    </>
  );
}
