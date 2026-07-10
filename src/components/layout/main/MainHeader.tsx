"use client";

import { useCallback, useMemo, useState } from "react";
import GnbMenu from "@/components/layout/shared/GnbMenu";
import HeaderBreadcrumb from "@/components/layout/shared/HeaderBreadcrumb";
import { useHeaderScroll } from "@/components/layout/shared/useHeaderScroll";

const MAIN_TOP_THRESHOLD = 80;

type MainHeaderProps = {
  showBreadcrumbNav?: boolean;
};

export default function MainHeader({ showBreadcrumbNav = false }: MainHeaderProps) {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [frozenWrapAtTop, setFrozenWrapAtTop] = useState<boolean | null>(null);

  const { isAtTop, isGnbHidden: scrollGnbHidden, isHeaderRevealed, revealHeader } =
    useHeaderScroll({
      topThreshold: MAIN_TOP_THRESHOLD,
      hideGnbOnScroll: !isMobileMenuOpen && !isMegaOpen,
    });

  const isGnbHidden = scrollGnbHidden && !isSearchOpen;
  const resolvedIsAtTop =
    frozenWrapAtTop !== null ? frozenWrapAtTop : isAtTop;

  const handleMegaOpenChange = useCallback((open: boolean) => {
    if (open) {
      setFrozenWrapAtTop(
        (prev) => prev ?? window.scrollY <= MAIN_TOP_THRESHOLD,
      );
    } else if (!isSearchOpen) {
      setFrozenWrapAtTop(null);
    }
    setIsMegaOpen(open);
  }, [isSearchOpen]);

  const handleSearchOpenChange = useCallback((open: boolean) => {
    if (open) {
      setFrozenWrapAtTop(
        (prev) => prev ?? window.scrollY <= MAIN_TOP_THRESHOLD,
      );
    } else if (!isMegaOpen) {
      setFrozenWrapAtTop(null);
    }
    setIsSearchOpen(open);
  }, [isMegaOpen]);

  const wrapClassName = useMemo(
    () =>
      [
        "main_header-wrap",
        resolvedIsAtTop && "is-at-top",
        isGnbHidden && "is-gnb-hidden",
        isSearchOpen && "is-search-open",
      ]
        .filter(Boolean)
        .join(" "),
    [resolvedIsAtTop, isGnbHidden, isSearchOpen],
  );

  return (
    <div className={wrapClassName}>
      <GnbMenu
        variant="main"
        logoHref="/main"
        showBreadcrumbNav={showBreadcrumbNav}
        isAtTop={resolvedIsAtTop}
        isHeaderHidden={isGnbHidden}
        isHeaderRevealed={isHeaderRevealed}
        onRevealHeader={revealHeader}
        breadcrumb={<HeaderBreadcrumb />}
        onMegaOpenChange={handleMegaOpenChange}
        onSearchOpenChange={handleSearchOpenChange}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
