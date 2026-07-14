import Link from "next/link";
import type { GnbNavItem } from "@/data/gnb/types";
import { EXPLORE_ALL_PRODUCTS_PATH } from "@/data/gnbExploreAllProducts";

type GnbMobileDepth1MenuProps = {
  navItems: GnbNavItem[];
  onNavSelect: (navId: string) => void;
  onDirectNavigate?: () => void;
  onExploreClick?: () => void;
};

export default function GnbMobileDepth1Menu({
  navItems,
  onNavSelect,
  onDirectNavigate,
  onExploreClick,
}: GnbMobileDepth1MenuProps) {
  return (
    <>
      <ul className="gnb_mobile_list gnb_mobile_list--depth1">
        {navItems.map((item, index) => {
          const rowClassName =
            index === 0 ? "depth_1 depth_1--first" : "depth_1";

          const rowContent = (
            <>
              <span className="gnb_mobile_list__label">{item.label}</span>
              <span className="gnb_mobile_list__arrow" aria-hidden="true" />
            </>
          );

          if (item.megaMenu) {
            return (
              <li key={item.id} className={rowClassName}>
                <button
                  type="button"
                  className="link"
                  onClick={() => onNavSelect(item.id)}
                >
                  {rowContent}
                </button>
              </li>
            );
          }

          if (item.href) {
            return (
              <li key={item.id} className={rowClassName}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="link"
                  onClick={onDirectNavigate}
                >
                  {rowContent}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.id} className={rowClassName}>
              <button type="button" className="link" disabled>
                {rowContent}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="gnb_mobile_foot">
        <Link
          href={EXPLORE_ALL_PRODUCTS_PATH}
          prefetch={false}
          className="gnb_mobile_explore"
          onClick={onExploreClick}
        >
          Explore All Products
        </Link>
      </div>
    </>
  );
}
