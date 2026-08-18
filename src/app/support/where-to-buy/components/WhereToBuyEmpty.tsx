"use client";

import { whereToBuyEmptyContent } from "@/data/support/whereToBuyContent";

type WhereToBuyEmptyProps = {
  onViewAll?: () => void;
};

export default function WhereToBuyEmpty({ onViewAll }: WhereToBuyEmptyProps) {
  const { title, desc, viewAllLabel, iconSrc } = whereToBuyEmptyContent;

  return (
    <div className="support_where_to_buy_empty">
      <div className="support_where_to_buy_empty__head">
        <div className="support_where_to_buy_empty__icon" aria-hidden>
          <img src={iconSrc} alt="" width={148} height={148} />
        </div>
        <div className="support_where_to_buy_empty__title">
          <p>{title}</p>
          <p>{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="btn-base btn-lv01 btn-lv01--solid support_where_to_buy_empty__view-all"
      >
        {viewAllLabel}
      </button>
    </div>
  );
}
