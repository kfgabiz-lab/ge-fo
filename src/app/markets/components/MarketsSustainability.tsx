export type SustainabilityCard = {
  id: string;
  image: string;
  title: string;
  bullets: string[];
};

type MarketsSustainabilityProps = {
  title?: string;
  cards?: SustainabilityCard[];
};

const DEFAULT_TITLE = "Driving a Sustainable Energy Future by LS ELECTRIC";

export default function MarketsSustainability({
  title = DEFAULT_TITLE,
  cards = [],
}: MarketsSustainabilityProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="markets_sustainability">
      <div className="inner">
        <h2 className="section_tit">{title}</h2>
        <div className="markets_sustainability__grid">
          {cards.map((card) => (
            <article key={card.id} className="markets_sustainability__card">
              <div className="markets_sustainability__img">
                <img
                  loading="lazy"
                  decoding="async"
                  src={card.image}
                  alt={card.title}
                />
              </div>
              <div className="markets_sustainability__body">
                <h3 className="markets_sustainability__tit">{card.title}</h3>
                <ul className="markets_sustainability__list">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
