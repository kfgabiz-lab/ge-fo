import Link from "next/link";
import GnbMobileBack from "@/components/layout/shared/GnbMobileBack";
import type { GnbMobileDepth2Item } from "@/data/gnb/mobileNavItems";

type GnbMobileDepth2GridMenuProps = {
  items: GnbMobileDepth2Item[];
  onBack: () => void;
  onItemNavigate?: () => void;
};

export default function GnbMobileDepth2GridMenu({
  items,
  onBack,
  onItemNavigate,
}: GnbMobileDepth2GridMenuProps) {
  return (
    <div className="gnb_mobile_depth2 gnb_mobile_depth2--grid">
      <GnbMobileBack label="Back" onBack={onBack} />
      <ul className="gnb_mobile_depth2__grid">
        {items.map((item, index) => {
          const rowClassName =
            index === 0
              ? "gnb_mobile_depth2__grid-item is-first"
              : "gnb_mobile_depth2__grid-item";

          const rowContent = (
            <div className="gnb_mobile_depth2__card-text">
              <p className="gnb_mobile_depth2__card-tit">{item.label}</p>
              {item.descriptionLines?.length ? (
                <div className="gnb_mobile_depth2__card-desc">
                  {item.descriptionLines.map((line, lineIndex) => (
                    <p key={`${item.id}-desc-${lineIndex}`}>{line}</p>
                  ))}
                </div>
              ) : null}
            </div>
          );

          if (item.disabled) {
            return (
              <li key={item.id} className={rowClassName}>
                <span className="gnb_mobile_depth2__card is-disabled" aria-disabled="true">
                  {rowContent}
                </span>
              </li>
            );
          }

          if (item.href) {
            if (item.external) {
              return (
                <li key={item.id} className={rowClassName}>
                  <a
                    href={item.href}
                    className="gnb_mobile_depth2__card"
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
                  className="gnb_mobile_depth2__card"
                  onClick={onItemNavigate}
                >
                  {rowContent}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.id} className={rowClassName}>
              <span className="gnb_mobile_depth2__card is-disabled" aria-disabled="true">
                {rowContent}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
