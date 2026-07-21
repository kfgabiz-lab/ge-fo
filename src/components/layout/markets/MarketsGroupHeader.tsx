"use client";

import { usePathname } from "next/navigation";
import MainHeader from "@/components/layout/main/MainHeader";
import SubHeader from "@/components/layout/markets/SubHeader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { FoGnbMenuApiNode, GnbDevicesMegaMenu } from "@/data/gnb";

const MARKETS_MOBILE_MQ = "(max-width: 780px)";

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
const COMMERCIAL_RESIDENTIAL_PATH = "/markets/commercial-residential";

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

type MarketsGroupHeaderProps = {
  /** 서버 레이아웃에서 조회한 GNB 트리 데이터 */
  gnbMenuData?: FoGnbMenuApiNode[];
  /** 서버 레이아웃에서 조회한 Products & Systems 메가메뉴(category-data 기반) */
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
};

export default function MarketsGroupHeader({
  gnbMenuData,
  devicesMegaMenu,
}: MarketsGroupHeaderProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery(MARKETS_MOBILE_MQ);
  const isCommercialResidential = matchesPath(
    pathname,
    COMMERCIAL_RESIDENTIAL_PATH,
  );
  const useMainGnb =
    MAIN_GNB_PATHS.some((path) => matchesPath(pathname, path)) &&
    !(isCommercialResidential && isMobile);
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
