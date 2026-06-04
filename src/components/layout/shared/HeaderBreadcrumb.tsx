"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBreadcrumbConfig } from "@/data/breadcrumbConfig";
import { isMainPath } from "@/lib/navigation/crossSectionNav";

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const { crumbs, current } = getBreadcrumbConfig(pathname);
  const showNav = Boolean(current);
  const showBar = showNav || isMainPath(pathname);

  if (!showBar) {
    return null;
  }

  return (
    <div className="markets_breadcrumb">
      <div className="inner">
        {showNav ? (
          <nav className="breadcrumb_nav" aria-label="Breadcrumb">
            <Link href="/main" prefetch={false} className="breadcrumb_home" aria-label="Home">
              <span className="ir">Home</span>
            </Link>
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
          </nav>
        ) : null}
        <div className="breadcrumb_links">
          <Link href="">Contact Us</Link>
          <Link href="">Where to buy</Link>
          <Link href="" className="breadcrumb_external">
            Customer Portal
            <span className="icon_external" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
