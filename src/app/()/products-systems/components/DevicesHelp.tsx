import Link from "next/link";
import {
  motorControlHelpCards,
  type DevicesHelpCard,
} from "../data/motorControlContent";

type DevicesHelpProps = {
  variant?: "default" | "overlay";
  sectionId?: string;
  cards?: DevicesHelpCard[];
  /** product_etc.connect_portal — help-1(Go to Connect Portal) 카드 링크만 이 값으로 대체 */
  connectPortalHref?: string;
};

/** connect_portal 값이 비어 있을 때 이동할 Connect Portal 메인 화면 URL.
 *  제품상세 Lineup 하단 Configurator CTA(GenericProductDetail)에서도 동일 폴백으로 재사용한다. */
export const CONNECT_PORTAL_FALLBACK_HREF = "https://connect.ls-electric.com/";

function getHelpCtaIconClass(ctaIcon?: DevicesHelpCard["ctaIcon"]) {
  return ctaIcon === "arrow" ? "icon_arrow-18" : "icon_external-18";
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
              // help-1(Go to Connect Portal)만 제품 실데이터 링크로 대체.
              // 값이 없거나 빈 문자열이면 Connect Portal 메인 화면으로 폴백하고, 항상 새 창으로 이동한다.
              const isConnectPortal = card.id === "help-1";
              const href = isConnectPortal
                ? connectPortalHref || CONNECT_PORTAL_FALLBACK_HREF
                : card.href;
              // 외부(http/https) 링크는 새 창으로 이동한다(help-3 G-ICS 등).
              // 내부 경로(help-2 Where to Buy)는 일반 이동으로 둔다.
              const isExternal =
                href.startsWith("http://") || href.startsWith("https://");
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
                  {...(isConnectPortal || isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
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
