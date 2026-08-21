"use client";

import { usePathname } from "next/navigation";
import MainHeader from "@/components/layout/main/MainHeader";
import SubHeader from "@/components/layout/markets/SubHeader";
import type { FoGnbMenuApiNode, GnbDevicesMegaMenu } from "@/data/gnb";

const MAIN_GNB_PATHS = [
  "/markets/data-center",
  "/markets/commercial-residential",
  "/markets/public-infrastructure",
  "/markets/oil-gas-mining",
  "/markets/power-grid",
  "/markets/industrial",
];
const BREADCRUMB_NAV_PATHS = [
  "/markets/data-center",
  "/markets/commercial-residential",
  "/markets/public-infrastructure",
  "/markets/oil-gas-mining",
  "/markets/power-grid",
  "/markets/industrial",
];

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

type MarketsGroupHeaderProps = {
  gnbMenuData?: FoGnbMenuApiNode[];
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
};

export default function MarketsGroupHeader({
  gnbMenuData,
  devicesMegaMenu,
}: MarketsGroupHeaderProps) {
  const pathname = usePathname();
  // Key-visual markets (incl. commercial-residential MO) — MainHeader is-top white GNB
  // Figma 9609:218641 GNB property1=White over dark hero
  const useMainGnb = MAIN_GNB_PATHS.some((path) => matchesPath(pathname, path));
  const showBreadcrumbNav = BREADCRUMB_NAV_PATHS.some((path) =>
    matchesPath(pathname, path),
  );

  return useMainGnb ? (
    <MainHeader
      showBreadcrumbNav={showBreadcrumbNav}
      gnbMenuData={gnbMenuData}
      devicesMegaMenu={devicesMegaMenu}
    />
  ) : (
    <SubHeader gnbMenuData={gnbMenuData} devicesMegaMenu={devicesMegaMenu} />
  );
}
