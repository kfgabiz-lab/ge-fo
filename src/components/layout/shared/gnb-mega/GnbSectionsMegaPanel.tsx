"use client";

import GnbMegaItemLink from "@/components/layout/shared/gnb-mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/layout/shared/gnb-mega/types";
import type { GnbSimpleMegaSection } from "@/data/gnb";

export default function GnbSectionsMegaPanel({
  title,
  menu,
  onItemClick,
  onClose,
}: GnbMegaSimplePanelStateProps) {
  const sections = menu.layout === "sections" ? menu.sections : [];

  return (
    <div className="gnb_mega__inner gnb_mega__inner--sections">
      {onClose ? (
        <button
          type="button"
          className="gnb_mega__close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <span className="ir">close menu</span>
        </button>
      ) : null}
      <div className="gnb_mega__head">
        <h2 className="gnb_mega__tit">{title}</h2>
      </div>
      <div className="gnb_mega__divider" aria-hidden />
      <div className="gnb_mega__columns">
        {sections.map((section, index) => (
          <SectionsColumn
            key={section.id}
            section={section}
            colIndex={index}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

function SectionsColumn({
  section,
  colIndex,
  onItemClick,
}: {
  section: GnbSimpleMegaSection;
  colIndex: number;
  onItemClick?: () => void;
}) {
  return (
    <section
      className="gnb_mega__col"
      aria-label={section.label}
      data-gnb-col={colIndex}
    >
      <p className="gnb_mega__col-label">{section.label}</p>
      <div className="gnb_mega__col-list">
        {section.items.map((item) => (
          <GnbMegaItemLink
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            descVariant="section"
          />
        ))}
      </div>
    </section>
  );
}
