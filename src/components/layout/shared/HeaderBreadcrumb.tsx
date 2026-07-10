"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBreadcrumbConfig } from "@/data/breadcrumbConfig";
import { CONNECT_PORTAL_EXTERNAL_URL } from "@/data/support/connectPortalContent";
import { isMainPath } from "@/lib/navigation/crossSectionNav";

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const { crumbs, current, homeOnly } = getBreadcrumbConfig(pathname);
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
