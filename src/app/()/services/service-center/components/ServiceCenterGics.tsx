import Link from "next/link";
import { Fragment } from "react";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";

export default function ServiceCenterGics() {
  const { gics } = serviceCenterPage;

  return (
    <section className="support_service_gics" id="service-center-gics">
      <div className="inner">
        <div className="support_service_gics__head">
          <div className="support_service_gics__head-text">
            <h2 className="section_tit">{gics.title}</h2>
            <p className="section_desc">{gics.description}</p>
          </div>
          <Link
            href={gics.ctaHref}
            className="btn-text-30 support_service_gics__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            {gics.ctaLabel}
            <span className="btn-text-30__icon">
              <span className="icon_link-14" aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="support_service_gics__body">
          <div className="support_service_gics__media">
            <img
              src={gics.image}
              alt={gics.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <ul className="support_service_gics__features">
            {gics.features.map((feature, index) => (
              <Fragment key={feature.id}>
                {index > 0 ? (
                  <li
                    className="support_service_gics__feature-divider"
                    aria-hidden="true"
                  />
                ) : null}
                <li
                  className={`support_service_gics__feature support_service_gics__feature--${feature.id}`}
                >
                  <div className="support_service_gics__feature-num-wrap">
                    <span
                      className="support_service_gics__feature-num"
                      aria-hidden="true"
                    >
                      {feature.number}
                    </span>
                  </div>
                  <div className="support_service_gics__feature-body">
                    <div className="support_service_gics__feature-heading">
                      <h3 className="support_service_gics__feature-tit">
                        {feature.title}
                      </h3>
                      <p className="support_service_gics__feature-sub">
                        {feature.subtitle}
                      </p>
                    </div>
                    <p className="support_service_gics__feature-desc">
                      {feature.description}
                    </p>
                  </div>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
