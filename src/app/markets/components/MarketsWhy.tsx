import { whyItems, type WhyItem } from "../data/marketsContent";

type MarketsWhyProps = {
  items?: WhyItem[];
  description?: string;
};

export default function MarketsWhy({
  items = whyItems,
  description = "We understand that in the public sector, failure is not an option",
}: MarketsWhyProps) {
  return (
    <section className="markets_why">
      <div className="markets_why__bg" aria-hidden="true">
        <div className="img_area">
          <img loading="lazy" decoding="async" src="/img/markets/bg_why_market.jpg" alt="" />
        </div>
      </div>
      <div className="inner">
        <div className="markets_why__head">
          <h2 className="section_tit">Why LS ELECTRIC?</h2>
          {/* <p className="section_desc">{description}</p> */}
        </div>
        <div className="markets_why__list">
          {items.map((item) => (
            <div key={item.id} className="markets_why__item">
              <div className="icon_area">
                <img loading="lazy" decoding="async" src={item.icon} alt="" />
              </div>
              <h3 className="tit">{item.title}</h3>
              <p className="txt">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
