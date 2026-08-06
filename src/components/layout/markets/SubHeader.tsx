"use client";

import { useState } from "react";
import GnbMenu from "@/components/layout/shared/GnbMenu";
import HeaderBreadcrumb, {
  type BreadcrumbCategoryFallback,
  type BreadcrumbServerOverride,
} from "@/components/layout/shared/HeaderBreadcrumb";
import { useHeaderScroll } from "@/components/layout/shared/useHeaderScroll";
import { MAIN_PATH } from "@/lib/navigation/crossSectionNav";
import type { FoGnbMenuApiNode, GnbDevicesMegaMenu } from "@/data/gnb";

type SubHeaderProps = {
  gnbMenuData?: FoGnbMenuApiNode[];
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  breadcrumbOverride?: BreadcrumbServerOverride;
  breadcrumbCategoryFallback?: BreadcrumbCategoryFallback;
};

export default function SubHeader({
  gnbMenuData,
  devicesMegaMenu,
  breadcrumbOverride,
  breadcrumbCategoryFallback,
}: SubHeaderProps) {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAtTop, isGnbHidden: scrollGnbHidden, isHeaderRevealed, revealHeader } =
    useHeaderScroll({
      hideGnbOnScroll: !isMobileMenuOpen && !isMegaOpen && !isSearchOpen,
    });

  const isGnbHidden = scrollGnbHidden && !isSearchOpen && !isMegaOpen;

  return (
    <div
      className={[
        "sub_header-wrap",
        isAtTop ? "is-at-top" : "",
        isGnbHidden ? "is-gnb-hidden" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <GnbMenu
        logoHref={MAIN_PATH}
        gnbMenuData={gnbMenuData}
        devicesMegaMenu={devicesMegaMenu}
        isAtTop={isAtTop}
        isHeaderHidden={isGnbHidden}
        isHeaderRevealed={isHeaderRevealed}
        onRevealHeader={revealHeader}
        breadcrumb={
          <HeaderBreadcrumb
            devicesMegaMenu={devicesMegaMenu}
            gnbMenuData={gnbMenuData}
            serverOverride={breadcrumbOverride}
            categoryFallback={breadcrumbCategoryFallback}
          />
        }
        onMegaOpenChange={setIsMegaOpen}
        onSearchOpenChange={setIsSearchOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
