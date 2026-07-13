import Link from "next/link";
import GnbMobileBack from "@/components/layout/shared/GnbMobileBack";
import type { GnbMobileDepth3Item } from "@/data/gnb/mobileNavItems";

type GnbMobileDepth3MenuProps = {
  items: GnbMobileDepth3Item[];
  backLabel: string;
  onBack: () => void;
  onItemSelect: (itemId: string) => void;
  onItemNavigate?: () => void;
};

export default function GnbMobileDepth3Menu({
  items,
  backLabel,
  onBack,
  onItemSelect,
  onItemNavigate,
}: GnbMobileDepth3MenuProps) {
  return (
    <div className="gnb_mobile_depth3">
      <GnbMobileBack label={backLabel} onBack={onBack} />
      <ul className="gnb_mobile_list gnb_mobile_list--depth3">
        {items.map((item, index) => {
          const rowClassName =
            index === 0 ? "depth_3 depth_3--first" : "depth_3";

          const rowContent = (
            <>
              <span className="gnb_mobile_list__label">{item.label}</span>
              <span
                className="gnb_mobile_list__arrow gnb_mobile_list__arrow--18"
                aria-hidden="true"
              />
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
