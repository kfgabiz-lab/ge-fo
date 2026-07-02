import Link from "next/link";
import {
  motorControlHelpCards,
  type DevicesHelpCard,
} from "../data/motorControlContent";

type DevicesHelpProps = {
  variant?: "default" | "overlay";
  sectionId?: string;
  cards?: DevicesHelpCard[];
};

function getHelpCtaIconClass(ctaIcon?: DevicesHelpCard["ctaIcon"]) {
  return ctaIcon === "arrow" ? "icon_arrow-18" : "icon_external-18";
}

export default function DevicesHelp({
  variant = "default",
  sectionId,
  cards = motorControlHelpCards,
}: DevicesHelpProps) {
  if (variant === "overlay") {
    return (
      <section
        className="devices_help devices_help--overlay"
        id={sectionId ?? "product-help"}
      >
        <div className="inner">
          <div className="devices_help__head">
            <h2 className="section_tit">Everything You Need to Power Your Success</h2>
            <p className="section_desc">
              Connect with our experts, configure your ideal system, and find the
              nearest partners—all in one place.
            </p>
          </div>
          <div className="devices_help__cards devices_help__cards--overlay">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="devices_help__card devices_help__card--overlay"
              >
                <div className="devices_help__card-body">
                  <h3 className="devices_help__card-tit">
                    {card.title.split("\n").map((line, index) => (
                      <span key={`${card.id}-overlay-${index}`}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="devices_help__card-desc">{card.description}</p>
                  <span className="btn-text-30 devices_help__card-cta">
                    {card.cta}
                    <span className="btn-text-30__icon">
                      <span
                        className={getHelpCtaIconClass(card.ctaIcon)}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </div>
                {card.image ? (
                  <div className="devices_help__card-visual" aria-hidden="true">
                    <img loading="lazy" decoding="async" src={card.image} alt="" />
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="devices_help" id={sectionId}>
      <div className="inner">
        <div className="devices_help__head">
          <h2 className="section_tit">Everything You Need to Power Your Success</h2>
          <p className="section_desc">
            Connect with our experts, configure your ideal system, and find the
            nearest partners—all in one place.
          </p>
        </div>
        <div className="devices_help__body">
          <div className="devices_help__visual">
            <img loading="lazy" decoding="async"
              src="/img/markets/img_benefit_01.png"
              alt=""
              className="devices_help__visual-img"
            />
          </div>
          <div className="devices_help__cards">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="devices_help__card"
              >
                <h3 className="devices_help__card-tit">
                  {card.title.split("\n").map((line, index) => (
                    <span key={`${card.id}-${index}`}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="devices_help__card-desc">{card.description}</p>
                <span className="btn-text-30 devices_help__card-cta">
                  {card.cta}
                  <span className="btn-text-30__icon">
                    <span
                      className={getHelpCtaIconClass(card.ctaIcon)}
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
