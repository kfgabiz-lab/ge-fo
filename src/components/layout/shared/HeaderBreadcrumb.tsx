"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getBreadcrumbConfig,
  type BreadcrumbConfig,
  type BreadcrumbCrumb,
} from "@/data/breadcrumbConfig";
import {
  getBreadcrumbTitlesServerSnapshot,
  getBreadcrumbTitlesSnapshot,
  subscribeBreadcrumbTitles,
} from "./breadcrumbTitleStore";
import { CONNECT_PORTAL_EXTERNAL_URL } from "@/data/support/connectPortalContent";
import { isMainPath } from "@/lib/navigation/crossSectionNav";
import { resolveGnbNavItems, type FoGnbMenuApiNode } from "@/data/gnb";
import type {
  GnbDevicesMegaMenu,
  GnbMegaProduct,
  GnbNavItem,
} from "@/data/gnb/types";

/**
 * 브레드크럼을 SSR 시점에 실데이터 라벨로 덮어쓰기 위한 서버 오버라이드.
 * - 서버 레이아웃에서 산출해 prop 으로 내려주면, 현재 경로(pathname)가 일치할 때 정적 config 대신 사용한다.
 * - 서버에서 이미 확정된 값이라 SSR 최초 HTML 부터 실 라벨이 박히고, 하이드레이션 이후에도 동일 →
 *   클라이언트에서 텍스트가 바뀌는 순간(폴백 flash)이 없다.
 * - 두 종류 오버라이드를 담는다(주어진 경로는 둘 중 하나만 사용):
 *   · current: 마지막 항목(코스상세 1뎁스) 텍스트 교체 — 예: "Curriculum Detail" → 실 코스 제목.
 *   · crumb : 중간 크럼(세션상세 2뎁스의 "코스로 돌아가기" 링크) 라벨 교체. href 로 대상 크럼을 매칭.
 */
export type BreadcrumbServerOverride = {
  pathname: string;
  /** 코스상세(1뎁스): 마지막 current 텍스트 오버라이드 */
  current?: string;
  /** 세션상세(2뎁스): href 가 일치하는 중간 크럼의 라벨 오버라이드 */
  crumb?: { href: string; label: string };
} | null;

type HeaderBreadcrumbProps = {
  /** 서버 레이아웃에서 조회한 Products & Systems 메가메뉴 트리 — 있으면 브레드크럼을 동적 도출 */
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  /** 서버 레이아웃에서 조회한 GNB 트리 데이터 — devices 외 최상위(services/support/company 등) 서브아이템 매칭에 사용 */
  gnbMenuData?: FoGnbMenuApiNode[];
  /** 서버 레이아웃에서 산출한 오버라이드 — 경로 일치 시 정적 config 대신 SSR 반영 */
  serverOverride?: BreadcrumbServerOverride;
};

// Products & Systems 브랜치 브레드크럼의 고정 최상단 크럼(트리 depth1과 별개인 상위 레이블).
const PRODUCTS_ROOT_CRUMB: BreadcrumbCrumb = {
  label: "Products & Systems",
  href: "/products-category/lv-products-and-systems",
};

// product 필드(단일 | 배열 | 미지정)를 배열로 정규화.
function toProductList(
  product: GnbMegaProduct | GnbMegaProduct[] | undefined,
): GnbMegaProduct[] {
  if (!product) return [];
  return Array.isArray(product) ? product : [product];
}

// GNB devices 메가메뉴 트리에서 현재 pathname과 일치하는 노드를 찾아 브레드크럼을 도출.
// depth1(/products-category/{slug}) → depth2(/product-range/{slug}) → depth3(/product/{slug}) 순으로 검사.
// 매칭되는 노드가 없으면 null 반환(호출부가 정적 폴백 getBreadcrumbConfig 사용).
function getCrumbsFromMegaMenu(
  megaMenu: GnbDevicesMegaMenu,
  pathname: string,
): BreadcrumbConfig | null {
  for (const depth1 of megaMenu.categories) {
    // depth1 매칭
    if (depth1.href && depth1.href === pathname) {
      return {
        crumbs: [PRODUCTS_ROOT_CRUMB],
        current: depth1.label,
      };
    }

    for (const depth2 of depth1.children) {
      // depth2 매칭
      if (depth2.href && depth2.href === pathname) {
        return {
          crumbs: [PRODUCTS_ROOT_CRUMB, { label: depth1.label, href: depth1.href }],
          current: depth2.label,
        };
      }

      // depth3(제품) 매칭
      for (const product of toProductList(depth2.product)) {
        if (product.href && product.href === pathname) {
          return {
            crumbs: [
              PRODUCTS_ROOT_CRUMB,
              { label: depth1.label, href: depth1.href },
              { label: depth2.label, href: depth2.href },
            ],
            current: product.title,
          };
        }
      }
    }
  }

  return null;
}

// GNB 일반(non-devices) 최상위 항목들의 서브아이템에서 현재 pathname과 일치하는 항목을 찾아 브레드크럼을 도출.
// devices 트리 매칭이 실패한 뒤 두 번째로 시도한다(둘 다 실패해야 정적 폴백).
// 최상위 크럼은 item.label(예: Services), href는 top nav href(대부분 빈 문자열 → span으로 렌더),
// current는 매칭된 서브아이템 title. 섹션 label 자체는 크럼에 쓰지 않는다(참고 마크업에 섹션명 없음).
// 매칭되는 항목이 없으면 null 반환.
function getCrumbsFromGeneralNav(
  navItems: GnbNavItem[],
  pathname: string,
): BreadcrumbConfig | null {
  for (const item of navItems) {
    // devices는 별도 트리 매칭(getCrumbsFromMegaMenu)에서 최우선 처리하므로 제외
    if (item.id === "devices") continue;

    const megaMenu = item.megaMenu;
    if (!megaMenu || megaMenu.type !== "simple") continue;

    const topCrumb: BreadcrumbCrumb = {
      label: item.label,
      href: item.href || undefined,
    };

    if (megaMenu.layout === "grid") {
      for (const sub of megaMenu.items) {
        if (sub.href && sub.href === pathname) {
          return { crumbs: [topCrumb], current: sub.title };
        }
      }
    } else {
      for (const section of megaMenu.sections) {
        for (const sub of section.items) {
          if (sub.href && sub.href === pathname) {
            return { crumbs: [topCrumb], current: sub.title };
          }
        }
      }
    }
  }

  return null;
}

export default function HeaderBreadcrumb({
  devicesMegaMenu,
  gnbMenuData,
  serverOverride,
}: HeaderBreadcrumbProps) {
  const pathname = usePathname();
  // 소프트 내비게이션(목록 카드 클릭 등) 대비 클라이언트 오버라이드 스토어 구독.
  // - getServerSnapshot 은 항상 고정 EMPTY_MAP → SSR/CSR 최초 스냅샷 일치(hydration mismatch 없음).
  const clientTitles = useSyncExternalStore(
    subscribeBreadcrumbTitles,
    getBreadcrumbTitlesSnapshot,
    getBreadcrumbTitlesServerSnapshot,
  );
  const clientOverride = clientTitles.get(pathname);
  // 우선순위: devices 트리 매칭 → 일반 GNB(non-devices) 서브아이템 매칭 → 정적 폴백(getBreadcrumbConfig).
  const fromMegaMenu = devicesMegaMenu
    ? getCrumbsFromMegaMenu(devicesMegaMenu, pathname)
    : null;
  const fromGeneralNav = fromMegaMenu
    ? null
    : getCrumbsFromGeneralNav(
        resolveGnbNavItems(gnbMenuData, devicesMegaMenu),
        pathname,
      );
  const {
    crumbs,
    current: baseCurrent,
    homeOnly,
  } = fromMegaMenu ?? fromGeneralNav ?? getBreadcrumbConfig(pathname);
  // 현재 경로와 일치하는 서버 오버라이드만 활성화(코스상세 current / 세션상세 crumb 라벨 공용).
  const activeServerOverride =
    serverOverride && serverOverride.pathname === pathname ? serverOverride : null;
  // 코스상세 current 우선순위: 서버 오버라이드(SSR 확정) → 클라이언트 seed(소프트 이동) → 정적 폴백.
  // - 세션상세는 서버 오버라이드에 current 가 없으므로(crumb 만 사용) 정적 "Session" 이 그대로 유지된다.
  const current = activeServerOverride?.current ?? clientOverride ?? baseCurrent;
  const showNav = Boolean(current) || homeOnly;
  const showPath = Boolean(current);
  const showBar = showNav || isMainPath(pathname);

  if (!showBar) {
    return null;
  }

  return (
    <div className="sub_breadcrumb">
      <div className="inner">
        {showNav ? (
          <nav className="breadcrumb_nav" aria-label="Breadcrumb">
            <Link href="/main" prefetch={false} className="breadcrumb_home" aria-label="Home">
              <span className="ir">Home</span>
            </Link>
            {showPath ? (
              <>
                {crumbs.map((crumb) => {
                  // 세션상세: 서버 오버라이드의 crumb.href 와 일치하는 중간 크럼("코스로 돌아가기")의
                  // 라벨을 실 코스 제목으로 교체(SSR 확정 → 무플래시). 미일치/미주입이면 정적 라벨 유지.
                  const crumbLabel =
                    activeServerOverride?.crumb &&
                    activeServerOverride.crumb.href === crumb.href
                      ? activeServerOverride.crumb.label
                      : crumb.label;
                  return (
                    <span key={crumb.label} className="breadcrumb_nav__group">
                      <span className="breadcrumb_sep" aria-hidden="true" />
                      {crumb.href ? (
                        <Link href={crumb.href} prefetch={false}>{crumbLabel}</Link>
                      ) : (
                        <span>{crumbLabel}</span>
                      )}
                    </span>
                  );
                })}
                <span className="breadcrumb_sep" aria-hidden="true" />
                <span className="breadcrumb_current" aria-current="page">
                  {current}
                </span>
              </>
            ) : null}
          </nav>
        ) : null}
        <div className="breadcrumb_links">
          <Link href="/support/contact-us" prefetch={false}>
            Contact Us
          </Link>
          <Link href="/support/where-to-buy" prefetch={false}>
            Where to buy
          </Link>
          <a
            href={CONNECT_PORTAL_EXTERNAL_URL}
            className="breadcrumb_external"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect Portal
            <span className="icon_external" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
