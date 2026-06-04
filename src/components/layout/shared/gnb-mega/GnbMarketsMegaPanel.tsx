"use client";

import GnbMegaItemLink from "@/components/layout/shared/gnb-mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/layout/shared/gnb-mega/types";
import { marketsMegaMenu } from "@/data/gnb/mega/markets";

/** Figma 2741:10579 — #gnb-mega-panel-markets */
export default function GnbMarketsMegaPanel({
  activeItemId,
  onItemEnter,
  onItemClick,
  items: apiItems,
}: GnbMegaSimplePanelStateProps) {
  // API items 있으면 사용, 없으면 하드코딩 폴백
  const items = apiItems ?? (marketsMegaMenu.layout === "grid" ? marketsMegaMenu.items : []);

  return (
    <div className="gnb_mega__inner gnb_mega__inner--grid">
      <div className="gnb_mega__head">
        <h2 className="gnb_mega__tit">Markets</h2>
      </div>
      <div className="gnb_mega__divider" aria-hidden />
      <ul className="gnb_mega__grid">
        {items.map((item) => (
          <li key={item.id} className="gnb_mega__cell">
            <GnbMegaItemLink
              item={item}
              isActive={item.id === activeItemId}
              onItemEnter={onItemEnter}
              onItemClick={onItemClick}
              descVariant="grid"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
