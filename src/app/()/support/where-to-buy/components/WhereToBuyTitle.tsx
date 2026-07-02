import { whereToBuyPage } from "@/data/support/whereToBuyContent";

export default function WhereToBuyTitle() {
  return (
    <section className="support_where_to_buy_title" id="support-where-to-buy-title">
      <div className="inner">
        <h1 className="support_where_to_buy_title__heading">
          {whereToBuyPage.title}
        </h1>
        <p className="support_where_to_buy_title__desc">
          {whereToBuyPage.description}
        </p>
      </div>
    </section>
  );
}
