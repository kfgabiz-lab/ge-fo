"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getBreadcrumbConfig,
  type BreadcrumbConfig,
  type BreadcrumbCrumb,
} from "@/data/breadcrumbConfig";
import { CONNECT_PORTAL_EXTERNAL_URL } from "@/data/support/connectPortalContent";
import { isMainPath } from "@/lib/navigation/crossSectionNav";
import { resolveGnbNavItems, type FoGnbMenuApiNode } from "@/data/gnb";
import type {
  GnbDevicesMegaMenu,
  GnbMegaProduct,
  GnbNavItem,
} from "@/data/gnb/types";

type HeaderBreadcrumbProps = {
  /** 서버 레이아웃에서 조회한 Products & Systems 메가메뉴 트리 — 있으면 브레드크럼을 동적 도출 */
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  /** 서버 레이아웃에서 조회한 GNB 트리 데이터 — devices 외 최상위(services/support/company 등) 서브아이템 매칭에 사용 */
  gnbMenuData?: FoGnbMenuApiNode[];
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
}: HeaderBreadcrumbProps) {
  const pathname = usePathname();
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
  const { crumbs, current, homeOnly } =
    fromMegaMenu ?? fromGeneralNav ?? getBreadcrumbConfig(pathname);
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
                {crumbs.map((crumb) => (
                  <span key={crumb.label} className="breadcrumb_nav__group">
                    <span className="breadcrumb_sep" aria-hidden="true" />
                    {crumb.href ? (
                      <Link href={crumb.href} prefetch={false}>{crumb.label}</Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </span>
                ))}
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
