import { connectPortalPage } from "@/data/support/connectPortalContent";

export default function ConnectPortalFeatures() {
  const { featuresIntro, featureCards, featuresBg } = connectPortalPage;

  return (
    <section className="support_connect_features" id="support-connect-features">
      <div className="support_connect_features__bg" aria-hidden>
        <img
          src={featuresBg.pc}
          alt=""
          className="support_connect_features__bg-img support_connect_features__bg-img--pc"
        />
        <img
          src={featuresBg.mobile}
          alt=""
          className="support_connect_features__bg-img support_connect_features__bg-img--mo"
        />
      </div>

      <div className="inner support_connect_features__inner">
        <div className="support_connect_features__head">
          <h2 className="support_connect_features__tit">
            <span className="support_connect_features__tit-set support_connect_features__tit-set--pc">
              {featuresIntro.titleLines.map((line) => (
                <span key={line} className="support_connect_features__tit-line">
                  {line}
                </span>
              ))}
            </span>
            {"mobileTitleLines" in featuresIntro && (
              <span className="support_connect_features__tit-set support_connect_features__tit-set--mo">
                {featuresIntro.mobileTitleLines.map((line) => (
                  <span key={line} className="support_connect_features__tit-line">
                    {line}
                  </span>
                ))}
              </span>
            )}
          </h2>
          <p className="support_connect_features__desc">{featuresIntro.text}</p>
        </div>

        <ul className="support_connect_features__grid">
          {featureCards.map((card) => (
            <li
              key={card.id}
              className={`support_connect_features__card support_connect_features__card--${card.id}`}
            >
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
