"use client";

import { useState } from "react";
import GnbMenu from "@/components/layout/shared/GnbMenu";
import HeaderBreadcrumb from "@/components/layout/shared/HeaderBreadcrumb";
import { useHeaderScroll } from "@/components/layout/shared/useHeaderScroll";
import { MAIN_PATH } from "@/lib/navigation/crossSectionNav";
import type { FoGnbMenuApiNode, GnbDevicesMegaMenu } from "@/data/gnb";

type SubHeaderProps = {
  /** 서버 레이아웃에서 조회한 GNB 트리 데이터 */
  gnbMenuData?: FoGnbMenuApiNode[];
  /** 서버 레이아웃에서 조회한 Products & Systems 메가메뉴(category-data 기반) */
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
};

export default function SubHeader({ gnbMenuData, devicesMegaMenu }: SubHeaderProps) {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAtTop, isGnbHidden, isHeaderRevealed, revealHeader } =
    useHeaderScroll({
      hideGnbOnScroll: !isMobileMenuOpen && !isMegaOpen,
    });

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
        breadcrumb={<HeaderBreadcrumb />}
        onMegaOpenChange={setIsMegaOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
