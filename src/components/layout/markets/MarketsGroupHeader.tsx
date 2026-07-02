"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/header";
import SubHeader from "@/components/layout/markets/SubHeader";
import { useMediaQuery } from "@/hooks/use-media-query";

const MARKETS_MOBILE_MQ = "(max-width: 780px)";

const MAIN_GNB_PATHS = [
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

export default function MarketsGroupHeader() {
  const pathname = usePathname();
  const isMobile = useMediaQuery(MARKETS_MOBILE_MQ);
  const isCommercialResidential = matchesPath(pathname, COMMERCIAL_RESIDENTIAL_PATH);
  const useMainGnb =
    MAIN_GNB_PATHS.some((path) => matchesPath(pathname, path)) &&
    !(isCommercialResidential && isMobile);
  return useMainGnb ? <Header /> : <SubHeader />;
}
