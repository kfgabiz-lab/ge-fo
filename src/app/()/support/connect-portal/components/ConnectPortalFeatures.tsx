import { connectPortalPage } from "@/data/support/connectPortalContent";

export default function ConnectPortalFeatures() {
  const { featuresIntro, featureCards } = connectPortalPage;

  return (
    <section className="support_connect_features" id="support-connect-features">
      <div className="support_connect_features__bg" aria-hidden>
        <img
          src="/img/support/connect-portal/features-bg.jpg"
          alt=""
          className="support_connect_features__bg-img"
        />
      </div>

      <div className="inner support_connect_features__inner">
        <div className="support_connect_features__head">
          <h2 className="support_connect_features__tit">
            {featuresIntro.titleLines.map((line) => (
              <span key={line} className="support_connect_features__tit-line">
                {line}
              </span>
            ))}
          </h2>
          <p className="support_connect_features__desc">{featuresIntro.text}</p>
        </div>

        <ul className="support_connect_features__grid">
          {featureCards.map((card) => (
            <li key={card.id} className="support_connect_features__card">
              <h3 className="support_connect_features__card-tit">{card.title}</h3>
              <p className="support_connect_features__card-desc">
                {card.description}
              </p>
              <img
                src={card.icon}
                alt=""
                className="support_connect_features__icon"
                width={110}
                height={110}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
