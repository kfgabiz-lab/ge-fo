"use client";

import Link from "next/link";
import { pushDataLayerEvent } from "@/lib/gtm";
import { CONNECT_PORTAL_EXTERNAL_URL } from "@/data/support/connectPortalContent";
import {
  motorControlHelpCards,
  type DevicesHelpCard,
} from "../data/motorControlContent";

function externalPortalNameFor(cardId: string): string | null {
  if (cardId === "help-1") return "Connect Portal";
  if (cardId === "help-3") return "G-ICS";
  return null;
}

type DevicesHelpProps = {
  variant?: "default" | "overlay";
  sectionId?: string;
  cards?: DevicesHelpCard[];
  connectPortalHref?: string;
};

function getHelpCtaIconClass(ctaIcon?: DevicesHelpCard["ctaIcon"]) {
  return ctaIcon === "arrow" ? "icon_arrow-18" : "icon_external-18";
}

function getHelpOverlayCtaIconClass(ctaIcon?: DevicesHelpCard["ctaIcon"]) {
  return ctaIcon === "arrow"
    ? "icon_devices-help-arrow-14"
    : "icon_devices-help-link-14";
}

export default function DevicesHelp({
  variant = "default",
  sectionId,
  cards = motorControlHelpCards,
  connectPortalHref,
}: DevicesHelpProps) {
  if (variant === "overlay") {
    return (
      <section
        className="devices_help devices_help--overlay"
        id={sectionId ?? "product-help"}
      >
        <div className="inner">
          <div className="devices_help__head">
            <h2 className="section_tit">
              <span>
                Everything You Need to Power, Automate,
                <br />
                and Grow Your Business
              </span>
            </h2>
            <p className="section_desc">
              Connect with our experts, configure your ideal system, and find the
              nearest partners—all in one place.
            </p>
          </div>
          <div className="devices_help__cards devices_help__cards--overlay">
            {cards.map((card) => {
              const isConnectPortal = card.id === "help-1";
              const href = isConnectPortal
                ? connectPortalHref || CONNECT_PORTAL_EXTERNAL_URL
                : card.href;
              const isExternal =
                href.startsWith("http://") || href.startsWith("https://");
              const portalName = externalPortalNameFor(card.id);
              return (
                <Link
                  key={card.id}
                  href={href}
                  className="devices_help__card devices_help__card--overlay"
                  {...(isConnectPortal && connectPortalHref
                    ? {
                        "data-slug": "product-data",
                        "data-slugkey": "product_etc.connect_portal",
                      }
                    : {})}
                  {...(href && (isConnectPortal || isExternal)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  onClick={
                    portalName
                      ? () =>
                          pushDataLayerEvent({
                            event: "click_external_portal",
                            portal_name: portalName,
                            click_location: "Body_CTA",
                          })
                      : undefined
                  }
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
                          className={getHelpOverlayCtaIconClass(card.ctaIcon)}
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
              );
            })}
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
              src="/img/markets/img_benefit_01.webp"
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
