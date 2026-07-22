"use client";

import GnbMegaItemLink from "@/components/layout/shared/gnb-mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/layout/shared/gnb-mega/types";
import type { GnbSimpleMegaSection } from "@/data/gnb";

/** sections 레이아웃(3번째 이후 루트 메뉴) 공용 패널 — Services/Support/Company가 쓰던 동일 구조를 하나로 통합 */
export default function GnbSectionsMegaPanel({
  title,
  menu,
  onItemClick,
}: GnbMegaSimplePanelStateProps) {
  const sections = menu.layout === "sections" ? menu.sections : [];

  return (
    <div className="gnb_mega__inner gnb_mega__inner--sections">
      <div className="gnb_mega__head">
        <h2 className="gnb_mega__tit">{title}</h2>
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
