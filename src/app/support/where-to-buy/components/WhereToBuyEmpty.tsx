import Link from "next/link";
import { whereToBuyEmptyContent } from "@/data/support/whereToBuyContent";

export default function WhereToBuyEmpty() {
  const { title, iconSrc, viewAllLabel, viewAllHref } = whereToBuyEmptyContent;

  return (
    <div className="support_where_to_buy_empty">
      <div className="support_where_to_buy_empty__head">
        <div className="support_where_to_buy_empty__icon" aria-hidden>
          <img src={iconSrc} alt="" width={110} height={110} />
        </div>
        <p className="support_where_to_buy_empty__title">{title}</p>
      </div>

      <Link
        href={viewAllHref}
        className="btn-base btn-lv01 btn-lv01--solid support_where_to_buy_empty__view-all"
      >
        {viewAllLabel}
      </Link>
    </div>
  );
}
