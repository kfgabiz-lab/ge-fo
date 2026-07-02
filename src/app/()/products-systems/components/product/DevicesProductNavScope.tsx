import type { ReactNode } from "react";
import DevicesProductNav, { type ProductNavItem } from "./DevicesProductNav";

type DevicesProductNavScopeProps = {
  children: ReactNode;
  navItems?: readonly ProductNavItem[];
};

/** Key Feature(#product-key-feature) 이하 구간에서만 사이드 네비 sticky */
export default function DevicesProductNavScope({
  children,
  navItems,
}: DevicesProductNavScopeProps) {
  return (
    <div className="devices_product_nav-scope">
      <DevicesProductNav navItems={navItems} />
      <div className="devices_product_nav-scope__content">{children}</div>
    </div>
  );
}
