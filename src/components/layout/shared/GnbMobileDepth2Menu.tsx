import Link from "next/link";
import GnbMobileBack from "@/components/layout/shared/GnbMobileBack";
import type { GnbMobileDepth2Item } from "@/data/gnb/mobileNavItems";

type GnbMobileDepth2MenuProps = {
  items: GnbMobileDepth2Item[];
  onBack: () => void;
  onItemSelect: (itemId: string) => void;
  onItemNavigate?: () => void;
};

export default function GnbMobileDepth2Menu({
  items,
  onBack,
  onItemSelect,
  onItemNavigate,
}: GnbMobileDepth2MenuProps) {
  return (
    <div className="gnb_mobile_depth2">
      <GnbMobileBack label="Back" onBack={onBack} />
      <ul className="gnb_mobile_list gnb_mobile_list--depth2">
        {items.map((item, index) => {
          const rowClassName =
            index === 0 ? "depth_2 depth_2--first" : "depth_2";

          const rowContent = (
            <>
              <span className="gnb_mobile_list__label">{item.label}</span>
              {item.hasSubmenu ? (
                <span className="gnb_mobile_list__arrow" aria-hidden="true" />
              ) : null}
            </>
          );

          if (item.disabled) {
            return (
              <li key={item.id} className={rowClassName}>
                <span className="link is-disabled" aria-disabled="true">
                  {rowContent}
                </span>
              </li>
            );
          }

          if (item.hasSubmenu) {
            return (
              <li key={item.id} className={rowClassName}>
                <button
                  type="button"
                  className="link"
                  onClick={() => onItemSelect(item.id)}
                >
                  {rowContent}
                </button>
              </li>
            );
          }

          if (item.href) {
            if (item.external) {
              return (
                <li key={item.id} className={rowClassName}>
                  <a
                    href={item.href}
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onItemNavigate}
                  >
                    {rowContent}
                  </a>
                </li>
              );
            }

            return (
              <li key={item.id} className={rowClassName}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="link"
                  onClick={onItemNavigate}
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
    </div>
  );
}
