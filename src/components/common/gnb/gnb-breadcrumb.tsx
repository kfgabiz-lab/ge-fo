"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMainPath } from "@/lib/navigation/cross-section-nav";

export default function GnbBreadcrumb() {
  const pathname = usePathname();
  const showBar = isMainPath(pathname);

  if (!showBar) return null;

  return (
    <div className="sub_breadcrumb">
      <div className="inner">
        <div className="breadcrumb_links">
          <Link href="/support/contact-us" prefetch={false}>Contact Us</Link>
          <Link href="/support/where-to-buy" prefetch={false}>Where to buy</Link>
          <Link href="/support/connect-portal" prefetch={false} className="breadcrumb_external">
            Connect Portal
            <span className="icon_external" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
