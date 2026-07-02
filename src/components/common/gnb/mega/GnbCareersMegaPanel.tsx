"use client";

import GnbMegaItemLink from "@/components/common/gnb/mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/common/gnb/mega/types";
import type { GnbSimpleMegaSection } from "@/data/gnb";
import { careersMegaMenu } from "@/data/gnb/mega/careers";

export default function GnbCareersMegaPanel({
  onItemClick,
}: GnbMegaSimplePanelStateProps) {
  const sections =
    careersMegaMenu.layout === "sections" ? careersMegaMenu.sections : [];

  return (
    <div className="gnb_mega__inner gnb_mega__inner--sections">
      <div className="gnb_mega__head">
        <h2 className="gnb_mega__tit">Careers</h2>
      </div>
      <div className="gnb_mega__divider" aria-hidden />
      <div className="gnb_mega__columns">
        {sections.map((section) => (
          <SectionsColumn
            key={section.id}
            section={section}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

function SectionsColumn({
  section,
  onItemClick,
}: {
  section: GnbSimpleMegaSection;
  onItemClick?: () => void;
}) {
  return (
    <section className="gnb_mega__col" aria-label={section.label}>
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

