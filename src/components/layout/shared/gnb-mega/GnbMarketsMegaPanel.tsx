"use client";

import GnbMegaItemLink from "@/components/layout/shared/gnb-mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/layout/shared/gnb-mega/types";
import { marketsMegaMenu } from "@/data/gnb/mega/markets";

/** Figma 17660:104944 — #gnb-mega-panel-markets */
export default function GnbMarketsMegaPanel({
  onItemClick,
}: GnbMegaSimplePanelStateProps) {
  const items =
    marketsMegaMenu.layout === "grid" ? marketsMegaMenu.items : [];

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
              onItemClick={onItemClick}
              descVariant="grid"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
