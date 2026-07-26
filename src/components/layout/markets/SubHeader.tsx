"use client";

import { useState } from "react";
import GnbMenu from "@/components/layout/shared/GnbMenu";
import HeaderBreadcrumb, {
  type BreadcrumbServerOverride,
} from "@/components/layout/shared/HeaderBreadcrumb";
import { useHeaderScroll } from "@/components/layout/shared/useHeaderScroll";
import { MAIN_PATH } from "@/lib/navigation/crossSectionNav";
import type { FoGnbMenuApiNode, GnbDevicesMegaMenu } from "@/data/gnb";

type SubHeaderProps = {
  /** 서버 레이아웃에서 조회한 GNB 트리 데이터 */
  gnbMenuData?: FoGnbMenuApiNode[];
  /** 서버 레이아웃에서 조회한 Products & Systems 메가메뉴(category-data 기반) */
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  /** 서버 레이아웃에서 산출한 브레드크럼 오버라이드(트레이닝 코스상세 current / 세션상세 크럼 라벨). SSR 반영용 */
  breadcrumbOverride?: BreadcrumbServerOverride;
};

export default function SubHeader({
  gnbMenuData,
  devicesMegaMenu,
  breadcrumbOverride,
}: SubHeaderProps) {
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
        breadcrumb={
          <HeaderBreadcrumb
            devicesMegaMenu={devicesMegaMenu}
            gnbMenuData={gnbMenuData}
            serverOverride={breadcrumbOverride}
          />
        }
        onMegaOpenChange={setIsMegaOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
