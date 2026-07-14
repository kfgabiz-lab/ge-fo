import Link from "next/link";
import GnbMobileBack from "@/components/layout/shared/GnbMobileBack";
import type { GnbMobileDepth2Section } from "@/data/gnb/mobileNavItems";

type GnbMobileDepth2SectionsMenuProps = {
  sections: GnbMobileDepth2Section[];
  onBack: () => void;
  onItemNavigate?: () => void;
};

function SectionItemCard({
  item,
  onItemNavigate,
}: {
  item: GnbMobileDepth2Section["items"][number];
  onItemNavigate?: () => void;
}) {
  const rowContent = (
    <>
      <div className="gnb_mobile_depth2__card-text">
        <p className="gnb_mobile_depth2__card-tit">{item.label}</p>
        {item.description ? (
          <p className="gnb_mobile_depth2__card-desc-line">{item.description}</p>
        ) : null}
      </div>
      {item.externalIcon ? (
        <span className="gnb_mobile_depth2__external" aria-hidden="true" />
      ) : null}
    </>
  );

  if (item.disabled) {
    return (
      <span className="gnb_mobile_depth2__card gnb_mobile_depth2__card--row is-disabled" aria-disabled="true">
        {rowContent}
      </span>
    );
  }

  if (item.href) {
    if (item.external) {
      return (
        <a
          href={item.href}
          className="gnb_mobile_depth2__card gnb_mobile_depth2__card--row"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onItemNavigate}
        >
          {rowContent}
        </a>
      );
    }

    return (
      <Link
        href={item.href}
        prefetch={false}
        className="gnb_mobile_depth2__card gnb_mobile_depth2__card--row"
        onClick={onItemNavigate}
      >
        {rowContent}
      </Link>
    );
  }

  return (
    <span className="gnb_mobile_depth2__card gnb_mobile_depth2__card--row is-disabled" aria-disabled="true">
      {rowContent}
    </span>
  );
}

export default function GnbMobileDepth2SectionsMenu({
  sections,
  onBack,
  onItemNavigate,
}: GnbMobileDepth2SectionsMenuProps) {
  return (
    <div className="gnb_mobile_depth2 gnb_mobile_depth2--sections">
      <GnbMobileBack label="Back" onBack={onBack} />
      <div className="gnb_mobile_depth2__sections">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="gnb_mobile_depth2__section-block">
            <div className="gnb_mobile_depth2__section">
              <p className="gnb_mobile_depth2__section-label">{section.label}</p>
              <ul className="gnb_mobile_depth2__section-list">
                {section.items.map((item) => (
                  <li key={item.id} className="gnb_mobile_depth2__section-item">
                    <SectionItemCard item={item} onItemNavigate={onItemNavigate} />
                  </li>
                ))}
              </ul>
            </div>
            {sectionIndex < sections.length - 1 ? (
              <hr className="gnb_mobile_depth2__divider" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
