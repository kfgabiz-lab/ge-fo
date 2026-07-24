import Link from "next/link";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";

function getStepIconSrc(
  icon: "pin" | "check" | "checkEnd",
  icons: (typeof serviceCenterPage.serviceFlow.icons),
) {
  return icons[icon];
}

export default function ServiceCenterFlow() {
  const { serviceFlow } = serviceCenterPage;
  const { icons } = serviceFlow;

  return (
    <section className="support_service_flow" id="service-center-flow">
      <div className="support_service_flow__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="support_service_flow__bg-image support_service_flow__bg-image--pc"
          loading="lazy"
          decoding="async"
          src={serviceFlow.backgroundImage}
          alt=""
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="support_service_flow__bg-image support_service_flow__bg-image--mo"
          loading="lazy"
          decoding="async"
          src={serviceFlow.backgroundImageMobile}
          alt=""
        />
      </div>
      <div className="inner">
        <div className="support_service_flow__head">
          <div className="support_service_flow__head-copy">
            <h2 className="support_service_flow__tit">{serviceFlow.title}</h2>
            <p className="support_service_flow__desc support_service_flow__desc--pc">
              {serviceFlow.description}
            </p>
            <p className="support_service_flow__desc support_service_flow__desc--mo">
              {serviceFlow.descriptionMobile ?? serviceFlow.description}
            </p>
          </div>
          <Link
            href={serviceFlow.ctaHref}
            className="btn-text-30 support_service_flow__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            {serviceFlow.ctaLabel}
            <span className="btn-text-30__icon">
              <span className="icon_link-14" aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="support_service_flow__diagram">
          <img
            className="support_service_flow__path"
            src={serviceFlow.pathImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="support_service_flow__track" aria-hidden="true">
            <img
              className="support_service_flow__track-pin"
              src={icons.pin}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="support_service_flow__track-line" />
          </div>
          <ol className="support_service_flow__steps">
            {serviceFlow.steps.map((step) => {
              const iconSrc = getStepIconSrc(step.icon, icons);
              const isIconFirst = step.iconPlacement === "top";

              return (
                <li
                  key={step.id}
                  className={`support_service_flow__step support_service_flow__step--${step.id} support_service_flow__step--icon-${step.iconPlacement}`}
                >
                  {isIconFirst ? (
                    <img
                      className={`support_service_flow__step-icon support_service_flow__step-icon--${step.icon}`}
                      src={iconSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="support_service_flow__step-copy">
                    <h3 className="support_service_flow__step-tit">{step.title}</h3>
                    <p className="support_service_flow__step-sub">{step.subtitle}</p>
                    <p className="support_service_flow__step-desc">
                      {step.description}
                    </p>
                  </div>
                  {!isIconFirst ? (
                    <img
                      className={`support_service_flow__step-icon support_service_flow__step-icon--${step.icon}`}
                      src={iconSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
          <img
            className="support_service_flow__end-dot"
            src={icons.endDot}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
