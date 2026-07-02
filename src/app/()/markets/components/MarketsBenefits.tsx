import { benefits, type BenefitItem } from "../data/marketsContent";

function renderTitleWithBreaks(title: string) {
  return title.split(/<br\s*\/?>/i).map((part, index) => (
    <span key={`${part}-${index}`}>
      {index > 0 ? <br /> : null}
      {part.trim()}
    </span>
  ));
}

type MarketsBenefitsProps = {
  items?: BenefitItem[];
  sectionDesc?: string;
};

export default function MarketsBenefits({
  items = benefits,
  sectionDesc = "Engineered to the highest standards delivering operational certainty at every scale.",
}: MarketsBenefitsProps) {
  return (
    <section className="markets_benefits">
      <div className="inner">
        <div className="markets_benefits__head">
          <h2 className="section_tit">Engineered Benefits</h2>
          <p className="section_desc">{sectionDesc}</p>
        </div>
        <div className="markets_benefits__list">
          {items.map((item) => (
            <div
              key={item.id}
              className={
                item.reverse
                  ? "markets_benefits__item is-reverse"
                  : "markets_benefits__item"
              }
            >
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt={item.title.replace(/<[^>]+>/g, "")} />
              </div>
              <div className="txt_area">
                <h3 className="tit">{renderTitleWithBreaks(item.title)}</h3>
                <p className="txt">{item.description}</p>
                <div className="capabilities">
                  <p className="capabilities_label">Capabilities</p>
                  <p className="capabilities_txt">{item.capabilities}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
