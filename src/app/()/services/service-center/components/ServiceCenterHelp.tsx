import Link from "next/link";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";

function getHelpCtaIconClass(ctaIcon: "arrow" | "link") {
  return ctaIcon === "arrow" ? "icon_arrow-18" : "icon_external-18";
}

export default function ServiceCenterHelp() {
  const { help } = serviceCenterPage;

  return (
    <section className="support_service_help" id="service-center-help">
      <div className="inner">
        <div className="support_service_help__head">
          <h2 className="section_tit">{help.title}</h2>
          <p className="section_desc">{help.description}</p>
        </div>
        <div className="support_service_help__cards">
          {help.cards.map((card) => {
            const linkProps = card.external
              ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
              : {};

            return (
              <Link
                key={card.id}
                href={card.href}
                className="support_service_help__card"
                {...linkProps}
              >
                <div className="support_service_help__card-body">
                  <h3 className="support_service_help__card-tit">{card.title}</h3>
                  <p className="support_service_help__card-desc">
                    {card.description}
                  </p>
                  <span className="btn-text-30 support_service_help__card-cta">
                    {card.cta}
                    <span className="btn-text-30__icon">
                      <span
                        className={getHelpCtaIconClass(card.ctaIcon)}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </div>
                <div className="support_service_help__card-visual" aria-hidden="true">
                  <img loading="lazy" decoding="async" src={card.image} alt="" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
