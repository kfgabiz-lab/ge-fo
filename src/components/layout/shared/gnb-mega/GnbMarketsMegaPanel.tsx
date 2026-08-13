"use client";

import GnbMegaItemLink from "@/components/layout/shared/gnb-mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/layout/shared/gnb-mega/types";

export default function GnbMarketsMegaPanel({
  title,
  menu,
  onItemClick,
  onClose,
}: GnbMegaSimplePanelStateProps) {
  const items = menu.layout === "grid" ? menu.items : [];

  return (
    <div className="gnb_mega__inner gnb_mega__inner--grid">
      {onClose ? (
        <button
          type="button"
          className="gnb_mega__close"
          aria-label="메뉴 닫기"
          onClick={onClose}
        >
          <span className="ir">close menu</span>
        </button>
      ) : null}
      <div className="gnb_mega__head">
        <h2 className="gnb_mega__tit">{title}</h2>
      </div>
      <div className="gnb_mega__divider" aria-hidden />
      <ul className="gnb_mega__grid" data-gnb-grid data-gnb-grid-rows="2">
        {items.map((item) => (
          <li key={item.id} className="gnb_mega__cell">
            <GnbMegaItemLink
              item={item}
              onItemClick={onItemClick}
              descVariant="grid"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
