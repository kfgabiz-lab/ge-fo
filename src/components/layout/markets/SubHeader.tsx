"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import GnbMenu from "@/components/common/gnb/gnb-menu";
import GnbBreadcrumb from "@/components/common/gnb/gnb-breadcrumb";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import {
  isDevicesProductDetailPath,
  MAIN_PATH,
} from "@/lib/navigation/cross-section-nav";
const SUB_TOP_THRESHOLD = 8;

export default function SubHeader() {
  const pathname = usePathname();
  const isProductDetail = isDevicesProductDetailPath(pathname);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [frozenWrapAtTop, setFrozenWrapAtTop] = useState<boolean | null>(null);

  const { isAtTop, isGnbHidden, isHeaderRevealed, revealHeader } =
    useHeaderScroll({
      hideGnbOnScroll: !isMobileMenuOpen && !isMegaOpen,
    });

  const resolvedIsAtTop =
    frozenWrapAtTop !== null ? frozenWrapAtTop : isAtTop;

  const handleMegaOpenChange = useCallback((open: boolean) => {
    if (open) {
      setFrozenWrapAtTop(
        (prev) => prev ?? window.scrollY <= SUB_TOP_THRESHOLD,
      );
    } else {
      setFrozenWrapAtTop(null);
    }
    setIsMegaOpen(open);
  }, []);

  const wrapClassName = useMemo(
    () =>
      [
        "sub_header-wrap",
        resolvedIsAtTop && "is-at-top",
        isGnbHidden && "is-gnb-hidden",
        isProductDetail && "is-product-detail",
      ]
        .filter(Boolean)
        .join(" "),
    [resolvedIsAtTop, isGnbHidden, isProductDetail],
  );

  return (
    <div className={wrapClassName}>
      <GnbMenu
        variant="markets"
        logoHref={MAIN_PATH}
        isAtTop={resolvedIsAtTop}
        isHeaderHidden={isGnbHidden}
        isHeaderRevealed={isHeaderRevealed}
        onRevealHeader={revealHeader}
        breadcrumb={<GnbBreadcrumb />}
        onMegaOpenChange={handleMegaOpenChange}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
