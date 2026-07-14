import Link from "next/link";
import type { ReactNode } from "react";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";

function ServiceCardLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function ServiceCenterCards() {
  const { cards } = serviceCenterPage;
  const [warranty, requestService, training, downloadCenter, techHub] = cards.items;

  return (
    <section className="support_service_cards" id="service-center-cards">
      <div className="inner">
        <div className="support_service_cards__row support_service_cards__row--primary">
          <article className="support_service_cards__kb">
            <div className="support_service_cards__kb-text">
              <h2 className="support_service_cards__tit">{cards.knowledgeBase.title}</h2>
              <p className="support_service_cards__desc">
                {cards.knowledgeBase.description}
              </p>
            </div>
            <div className="support_service_cards__kb-actions">
              {cards.knowledgeBase.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="btn-base btn-lv02 support_service_cards__kb-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <span className="icon_link-14" aria-hidden="true" />
                </a>
              ))}
            </div>
          </article>

          <div className="support_service_cards__pair">
            {[warranty, requestService].map((card) => (
            <ServiceCardLink
              key={card.id}
              href={card.href}
              external={card.external}
              className={`support_service_cards__card support_service_cards__card--${card.id}`}
            >
                <img
                  className="support_service_cards__icon"
                  src={card.icon}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="support_service_cards__card-text">
                  <h3 className="support_service_cards__tit">{card.title}</h3>
                  <p className="support_service_cards__desc">{card.description}</p>
                </div>
              </ServiceCardLink>
            ))}
          </div>
        </div>

        <div className="support_service_cards__row support_service_cards__row--secondary">
          {[training, downloadCenter, techHub].map((card) => (
            <ServiceCardLink
              key={card.id}
              href={card.href}
              external={card.external}
              className={`support_service_cards__card support_service_cards__card--${card.id}${
                card.id === "tech-hub" ? " support_service_cards__card--tech-hub" : ""
              }`}
            >
              <img
                className="support_service_cards__icon"
                src={card.icon}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="support_service_cards__card-text">
                <h3 className="support_service_cards__tit">
                  {"titleParts" in card && card.titleParts ? (
                    <span className="support_service_cards__tit-group">
                      <span className="support_service_cards__tit-part">{card.titleParts[0]}</span>
                      <span className="support_service_cards__tit-divider" aria-hidden />
                      <span className="support_service_cards__tit-part">{card.titleParts[1]}</span>
                    </span>
                  ) : (
                    card.title
                  )}
                </h3>
                <p className="support_service_cards__desc">{card.description}</p>
              </div>
            </ServiceCardLink>
          ))}
        </div>
      </div>
    </section>
  );
}
