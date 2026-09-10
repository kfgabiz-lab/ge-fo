/**
 * 구 사이트(WordPress, lselectricamerica.com) → 신규 URL 구조 매핑.
 * 사이트 개편 전 외부에 노출/색인된 레거시 경로를 신규 경로로 영구 이동(308)시킨다.
 * next.config.ts 의 redirects() 에서 spread 하여 사용.
 *
 * 규칙
 * - [source, destination] 튜플. 도메인 제외 경로만.
 * - destination 의 `?category=` 쿼리는 신규 앱 라우팅이 요구하는 값이라 그대로 유지.
 * - 끝 슬래시(`/dc-mc/`)는 Next 기본 trailingSlash:false 정규화에 위임
 *   (이 파일 다른 redirects 및 next.config.ts 기존 항목과 동일한 방식).
 * - 자기 자신 매핑(`/`, `/privacy-policy`)은 무한 루프라 목록에서 제외.
 * - 중복 원본(`/download-center`, `/support-services/buy-now`)은 1건으로 정리.
 */

type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

// prettier-ignore
const legacyPathMap: ReadonlyArray<readonly [source: string, destination: string]> = [
  // --- Panel & Controls ---
  ["/all-products",                                                 "/"],
  ["/all-products/panel-controls",                                  "/product-category/568/lv-products-and-systems"],
  ["/all-products/panel-controls/metasol-ms",                       "/product/1675/metasol-ms?category=583"],
  ["/all-products/panel-controls/gmp",                              "/product/1678/gmp?category=585"],
  ["/all-products/panel-controls/dmpi",                             "/product/1679/dmpi?category=585"],
  ["/all-products/panel-controls/imp",                              "/product/1680/imp?category=585"],
  ["/all-products/panel-controls/mmp",                              "/product/1681/mmp?category=585"],
  ["/all-products/panel-controls/metasol-mms",                      "/product-range/586/manual-motor-starter?category=586"],
  ["/all-products/panel-controls/mcb",                              "/product-range/576/miniature-circuit-breaker?category=576"],
  ["/all-products/panel-controls/susol-ul-mccb",                    "/product/1665/susol-ul-mccb?category=575"],
  ["/all-products/panel-controls/din-spd-bk-series",                "/product-range/577/surge-protective-device?category=577"],
  ["/soft-starter",                                                 "/product-category/568/lv-products-and-systems"],

  // --- Industrial Automation & Control ---
  ["/all-products/automation-4",                                    "/product-category/572/industrial-automation-and-control"],
  ["/all-products/automation-4/exp-series",                         "/product/1707/exp2?category=604"],
  ["/all-products/automation-4/exp-series-2",                       "/product/exp2"],
  ["/all-products/automation-4/ixp-series",                         "/product/1708/ixp3?category=604"],
  ["/all-products/automation-4/ixp2-series",                        "/product/ixp3"],
  ["/all-products/automation-4/plc",                                "/product/1711/safety-plc?category=605"],
  ["/all-products/automation-4/servo-motion",                       "/product-range/606/motion-servo?category=606"],
  ["/all-products/automation-4/g100",                               "/product/1685/g100?category=587"],
  ["/all-products/automation-4/h100plus",                           "/product/1683/h100-plus?category=587"],
  ["/all-products/automation-4/is7",                                "/product/1688/is7?category=587"],
  ["/all-products/automation-4/m100",                               "/product/1686/m100?category=587"],
  ["/all-products/automation-4/s100",                               "/product/1687/s100?category=587"],
  ["/all-products/automation-4/sp100",                              "/product/1684/sp100?category=587"],
  ["/s100-nema4x",                                                  "/"],

  // --- Power Distribution ---
  ["/all-products/power-distribution",                              "/"],
  ["/all-products/power-distribution/mcsg-metal-clad-switchgear",   "/product-range/590/metal-clad-switchgear?category=590"],
  ["/all-products/power-distribution/ul-lv-swgr",                   "/"],
  ["/all-products/power-distribution/ul891-switchboard-solution-2", "/product-range/580/ul891-switchboard?category=580"],
  ["/all-products/power-distribution/cast-resin-transformer",       "/product/1694/cast-resin-transformer?category=593"],
  ["/all-products/power-distribution/susol-vcb-for-ansi-type",      "/product/1689/susol-ul-vcb?category=588"],
  ["/all-products/power-distribution/susol-ul-acb",                 "/product/1664/susol-ul-acb?category=574"],
  ["/all-products/power-distribution/susol-ul-mccb",                "/product/susol-ul-mccb"],

  // --- Renewable Energy / DC Devices ---
  ["/all-products/renewable-energy",                                "/product-category/571/dc-devices"],
  ["/dc-mc",                                                        "/product-category/dc-devices"],
  ["/dc-mcb",                                                       "/product/1703/dc-miniature-circuit-breaker-mcb?category=600"],
  ["/susol-dc-mccb-switch-disconnector-2",                          "/product/1702/dc-mccb-disconnect-1500-v-dc-up-to-600-a?category=599"],
  ["/dc-acb-switch-disconnector",                                   "/product/1699/iec-dc-acb-and-switch-disconnector?category=596"],
  ["/all-products/dc-compact-switch-disconnector",                  "/product-range/597/dc-compact-switch-disconnector?category=597"],
  ["/all-products/dc-relay",                                        "/product/1705/dc-relay?category=602"],
  ["/dc-spd",                                                       "/product/1704/dc-surge-protective-device-ul-1449?category=601"],
  ["/dc-ul-switch-disconnector",                                    "/product/1701/ul-dc-switch-disconnector?category=598"],

  // --- Support / Company / Services ---
  ["/download-center",                                              "/support/download-center"],
  ["/support-services/buy-now",                                     "/support/where-to-buy"],
  ["/about-us/contact-us",                                          "/support/contact-us"],
  ["/contact-us",                                                   "/support/contact-us"],
  ["/blogs",                                                        "/company/blog"],
  ["/history",                                                      "/company/ls-electric"],
  ["/magazine-articles",                                            "/company/articles"],
  ["/training",                                                     "/services/training/service"],
  ["/training-request",                                             "/services/training/request"],
  ["/favorites",                                                    "/"],
];

export const legacyRedirects: LegacyRedirect[] = legacyPathMap.map(
  ([source, destination]): LegacyRedirect => ({
    source,
    destination,
    permanent: true,
  }),
);
