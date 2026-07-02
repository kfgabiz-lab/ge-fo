"use client";

import { useMemo, useState } from "react";
import GnbMenu from "@/components/common/gnb/gnb-menu";
import GnbBreadcrumb from "@/components/common/gnb/gnb-breadcrumb";
import { useHeaderScroll } from "@/hooks/use-header-scroll";

export default function Header() {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAtTop, isGnbHidden, isHeaderRevealed, revealHeader } = useHeaderScroll({
    topThreshold: 80,
    hideGnbOnScroll: !isMobileMenuOpen && !isMegaOpen,
  });

  const wrapClassName = useMemo(
    () =>
      ["main_header-wrap", isAtTop && "is-at-top", isGnbHidden && "is-gnb-hidden"]
        .filter(Boolean)
        .join(" "),
    [isAtTop, isGnbHidden],
  );

  return (
    <div className={wrapClassName}>
      <GnbMenu
        variant="main"
        logoHref="/main"
        isAtTop={isAtTop}
        isHeaderHidden={isGnbHidden}
        isHeaderRevealed={isHeaderRevealed}
        onRevealHeader={revealHeader}
        breadcrumb={<GnbBreadcrumb />}
        onMegaOpenChange={setIsMegaOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
