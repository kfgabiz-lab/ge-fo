import { whereToBuyEmptyContent } from "@/data/support/whereToBuyContent";

export default function WhereToBuyEmpty() {
  // 기획서 항목10 — 아이콘 + 안내 문구만 노출(View All 버튼은 기획서에 없어 제거)
  const { title, iconSrc } = whereToBuyEmptyContent;

  return (
    <div className="support_where_to_buy_empty">
      <div className="support_where_to_buy_empty__head">
        <div className="support_where_to_buy_empty__icon" aria-hidden>
          <img src={iconSrc} alt="" width={110} height={110} />
        </div>
        <p className="support_where_to_buy_empty__title">{title}</p>
      </div>
    </div>
  );
}
