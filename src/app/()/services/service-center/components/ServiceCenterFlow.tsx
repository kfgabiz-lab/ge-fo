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
      <div className="support_service_flow__bg" aria-hidden="true" />
      <div className="inner">
        <div className="support_service_flow__head">
          <h2 className="support_service_flow__tit">{serviceFlow.title}</h2>
          <div className="support_service_flow__head-row">
            <p className="support_service_flow__desc">{serviceFlow.description}</p>
            <Link
              href={serviceFlow.ctaHref}
              className="btn-text-30 support_service_flow__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {serviceFlow.ctaLabel}
              <span className="btn-text-30__icon">
                <span className="icon_arrow-14 icon_arrow-14--white" aria-hidden="true" />
              </span>
            </Link>
          </div>
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
                      {"descriptionLines" in step && step.descriptionLines
                        ? step.descriptionLines.map((line, index) => (
                            <span
                              key={line}
                              className="support_service_flow__step-desc-line"
                            >
                              {index > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))
                        : step.description}
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
