"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useSyncExternalStore } from "react";
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
import {
  CATEGORY_CONTEXT_PARAM,
  hrefPathname,
  parseCategoryContext,
} from "@/lib/navigation/categoryContext";
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

/**
 * 컨텍스트(?category=) 없이 들어온 Lv2/제품 경로에서 "본문이 실제로 고른 레코드"의 소속 Lv2 id.
 * - 서버 레이아웃이 본문과 동일한 조회로 산출해 내려준다(추가 왕복 없음).
 * - pathname 을 함께 담아, 공유 레이아웃이 재실행되지 않는 소프트 내비게이션에서 낡은 값이
 *   다른 경로에 잘못 적용되는 것을 막는다(serverOverride 와 동일한 방어).
 */
export type BreadcrumbCategoryFallback = {
  pathname: string;
  categoryId: number;
} | null;

type HeaderBreadcrumbProps = {
  /** 서버 레이아웃에서 조회한 Products & Systems 메가메뉴 트리 — 있으면 브레드크럼을 동적 도출 */
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  /** 서버 레이아웃에서 조회한 GNB 트리 데이터 — devices 외 최상위(services/support/company 등) 서브아이템 매칭에 사용 */
  gnbMenuData?: FoGnbMenuApiNode[];
  /** 서버 레이아웃에서 산출한 오버라이드 — 경로 일치 시 정적 config 대신 SSR 반영 */
  serverOverride?: BreadcrumbServerOverride;
  /** URL 에 ?category= 가 없을 때 쓸 카테고리 컨텍스트 폴백(본문이 고른 레코드 기준) */
  categoryFallback?: BreadcrumbCategoryFallback;
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
//
// ⚠️ 트리 href 에는 중복 slug 해소용 ?category={Lv2 id} 가 붙어 있고 usePathname() 은 쿼리를 포함하지
//    않으므로, 비교는 반드시 hrefPathname()(쿼리 제거)으로 한다. 원시 href 와 pathname 을 직접 비교하면
//    devices 하위 전 경로에서 매칭이 실패해 브레드크럼 바가 통째로 사라진다.
//
// categoryId: URL 의 ?category= 컨텍스트. 지정하면 "그 id 를 가진 Lv2" 만 후보로 삼아
//   slug 가 같은 다른 Lv2 가 먼저 걸리는 일을 막는다(예: variable-frequency-drive 587 vs 607).
//   null 이면 기존처럼 slug 기준 첫 매칭(컨텍스트 없는 진입 하위호환).
function getCrumbsFromMegaMenu(
  megaMenu: GnbDevicesMegaMenu,
  pathname: string,
  categoryId: number | null,
): BreadcrumbConfig | null {
  for (const depth1 of megaMenu.categories) {
    // depth1(Lv1) 매칭 — Lv1 은 slug 중복이 없어 카테고리 컨텍스트와 무관하게 판정한다.
    if (depth1.href && hrefPathname(depth1.href) === pathname) {
      return {
        crumbs: [PRODUCTS_ROOT_CRUMB],
        current: depth1.label,
      };
    }

    for (const depth2 of depth1.children) {
      // 컨텍스트가 주어졌으면 그 id 의 Lv2 만 본다 → 이 Lv2 와 그 하위 제품의 조상 체인이 정확해진다.
      if (categoryId !== null && depth2.categoryId !== categoryId) continue;

      // depth2(Lv2) 매칭
      if (depth2.href && hrefPathname(depth2.href) === pathname) {
        return {
          crumbs: [PRODUCTS_ROOT_CRUMB, { label: depth1.label, href: depth1.href }],
          current: depth2.label,
        };
      }

      // depth3(제품) 매칭
      for (const product of toProductList(depth2.product)) {
        if (product.href && hrefPathname(product.href) === pathname) {
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
// current는 매칭된 서브아이템 title. sections 레이아웃은 매칭된 섹션의 label을 중간 크럼으로 추가한다
// (단 섹션 label이 current와 같으면 중복이라 생략 — 예: /company/articles 자체는 섹션명과 항목명이 동일).
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
            const sectionCrumb: BreadcrumbCrumb[] =
              section.label && section.label !== sub.title
                ? [{ label: section.label }]
                : [];
            return { crumbs: [topCrumb, ...sectionCrumb], current: sub.title };
          }
        }
      }
    }
  }

  return null;
}

// useSearchParams() 는 정적 프리렌더 경로에서 Suspense 경계를 요구한다(없으면 빌드 실패).
// 이 컴포넌트를 렌더하는 레이아웃은 대부분 no-store fetch 로 동적이지만 app/not-found.tsx 만
// 예외(정적 프리렌더)라, 호출부 3곳을 고치는 대신 여기서 경계를 세워 한 곳에서 보장한다.
export default function HeaderBreadcrumb(props: HeaderBreadcrumbProps) {
  return (
    <Suspense fallback={null}>
      <HeaderBreadcrumbContent {...props} />
    </Suspense>
  );
}

function HeaderBreadcrumbContent({
  devicesMegaMenu,
  gnbMenuData,
  serverOverride,
  categoryFallback,
}: HeaderBreadcrumbProps) {
  const pathname = usePathname();
  // 카테고리 컨텍스트 결정 순서:
  //   ① URL 의 ?category={Lv2 id} — 클릭해서 들어온 경우. "원래 카테고리 구조"대로 표시한다.
  //   ② 서버 폴백 — URL 로 직접 들어온 경우. 본문이 고른 레코드(조회 첫 건)의 소속 Lv2 를 따라가
  //      본문과 브레드크럼이 서로 다른 중복 항목을 가리키지 않게 한다.
  //   ③ 둘 다 없으면 null → 트리에서 slug 첫 매칭(기존 동작).
  // 동적 렌더 경로에서는 ①②가 SSR 시점에 이미 확정돼 최초 HTML 부터 정확하다(폴백 flash 없음).
  const urlCategoryId = parseCategoryContext(
    useSearchParams().get(CATEGORY_CONTEXT_PARAM),
  );
  const fallbackCategoryId =
    categoryFallback && categoryFallback.pathname === pathname
      ? categoryFallback.categoryId
      : null;
  const categoryId = urlCategoryId ?? fallbackCategoryId;
  // 소프트 내비게이션(목록 카드 클릭 등) 대비 클라이언트 오버라이드 스토어 구독.
  // - getServerSnapshot 은 항상 고정 EMPTY_MAP → SSR/CSR 최초 스냅샷 일치(hydration mismatch 없음).
  const clientTitles = useSyncExternalStore(
    subscribeBreadcrumbTitles,
    getBreadcrumbTitlesSnapshot,
    getBreadcrumbTitlesServerSnapshot,
  );
  const clientOverride = clientTitles.get(pathname);
  // 우선순위: devices 트리 매칭 → 일반 GNB(non-devices) 서브아이템 매칭 → 정적 폴백(getBreadcrumbConfig).
  // devices 트리는 2패스다:
  //   1패스 — 카테고리 컨텍스트가 있으면 그 id 의 노드로 한정해 정확한 조상 체인을 얻는다.
  //   2패스 — 컨텍스트가 없거나(기존 URL·북마크) 그 id 로 못 찾으면(파라미터가 낡거나 잘못됨)
  //           기존과 동일한 slug 기준 첫 매칭으로 폴백한다 → 어떤 경우에도 바가 사라지지 않는다.
  const fromMegaMenu = devicesMegaMenu
    ? (categoryId !== null
        ? getCrumbsFromMegaMenu(devicesMegaMenu, pathname, categoryId)
        : null) ?? getCrumbsFromMegaMenu(devicesMegaMenu, pathname, null)
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
