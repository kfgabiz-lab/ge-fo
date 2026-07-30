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

export type BreadcrumbServerOverride = {
  pathname: string;
  current?: string;
  crumb?: { href: string; label: string };
} | null;

export type BreadcrumbCategoryFallback = {
  pathname: string;
  categoryId: number;
} | null;

type HeaderBreadcrumbProps = {
  devicesMegaMenu?: GnbDevicesMegaMenu | null;
  gnbMenuData?: FoGnbMenuApiNode[];
  serverOverride?: BreadcrumbServerOverride;
  categoryFallback?: BreadcrumbCategoryFallback;
};

const PRODUCTS_ROOT_CRUMB: BreadcrumbCrumb = {
  label: "Products & Systems",
};

function toProductList(
  product: GnbMegaProduct | GnbMegaProduct[] | undefined,
): GnbMegaProduct[] {
  if (!product) return [];
  return Array.isArray(product) ? product : [product];
}

function getCrumbsFromMegaMenu(
  megaMenu: GnbDevicesMegaMenu,
  pathname: string,
  categoryId: number | null,
): BreadcrumbConfig | null {
  for (const depth1 of megaMenu.categories) {
    if (depth1.href && hrefPathname(depth1.href) === pathname) {
      return {
        crumbs: [PRODUCTS_ROOT_CRUMB],
        current: depth1.label,
      };
    }

    for (const depth2 of depth1.children) {
      if (categoryId !== null && depth2.categoryId !== categoryId) continue;

      if (depth2.href && hrefPathname(depth2.href) === pathname) {
        return {
          crumbs: [PRODUCTS_ROOT_CRUMB, { label: depth1.label, href: depth1.href }],
          current: depth2.label,
        };
      }

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

function getCrumbsFromGeneralNav(
  navItems: GnbNavItem[],
  pathname: string,
): BreadcrumbConfig | null {
  for (const item of navItems) {
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
  const urlCategoryId = parseCategoryContext(
    useSearchParams().get(CATEGORY_CONTEXT_PARAM),
  );
  const fallbackCategoryId =
    categoryFallback && categoryFallback.pathname === pathname
      ? categoryFallback.categoryId
      : null;
  const categoryId = urlCategoryId ?? fallbackCategoryId;
  const clientTitles = useSyncExternalStore(
    subscribeBreadcrumbTitles,
    getBreadcrumbTitlesSnapshot,
    getBreadcrumbTitlesServerSnapshot,
  );
  const clientOverride = clientTitles.get(pathname);
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
  const activeServerOverride =
    serverOverride && serverOverride.pathname === pathname ? serverOverride : null;
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
