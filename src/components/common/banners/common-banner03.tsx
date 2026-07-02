import Link from "next/link";
import type { ReactNode } from "react";

type CommonBanner03Props = {
  titleTop?: string;
  title?: string;
  description?: string[];
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
  imageSrc?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function BannerLink({
  href,
  linkExternal,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  linkExternal?: boolean;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  if (linkExternal || isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

const DEFAULT_DESCRIPTION = [
  "Need help with installation, configuration, troubleshooting, or maintenance?",
  "Watch step-by-step video guides for the MCCB series in our Tech Hub.",
];

const DEFAULT_IMAGE_SRC = "/img/devices/product/banner_hub_video.jpg";

export default function CommonBanner03({
  titleTop = "Tech Hub Video Guide",
  title = "MCCB Video Tutorials",
  description = DEFAULT_DESCRIPTION,
  linkHref = "/support/tech-hub",
  linkLabel = "Explore Tech Hub",
  linkExternal,
  imageSrc = DEFAULT_IMAGE_SRC,
}: CommonBanner03Props) {
  return (
    <section className="common_banner_03">
      <div className="inner common_banner_03__panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          src="/img/devices/product/banner_hub_bg.png"
          alt=""
          aria-hidden
          className="common_banner_03__bg"
        />

        {linkHref ? (
          <BannerLink
            href={linkHref}
            linkExternal={linkExternal}
            className="common_banner_03__img"
            ariaLabel={linkLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              decoding="async"
              src={imageSrc}
              alt=""
              aria-hidden
            />
            <div className="common_banner_03__dim" aria-hidden />
          </BannerLink>
        ) : (
          <div className="common_banner_03__img" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              decoding="async"
              src={imageSrc}
              alt=""
            />
            <div className="common_banner_03__dim" />
          </div>
        )}

        {linkHref ? (
          <BannerLink
            href={linkHref}
            linkExternal={linkExternal}
            className="common_banner_03__body"
          >
            <div className="common_banner_03__text">
              <p className="common_banner_03__kicker">{titleTop}</p>
              <h2 className="common_banner_03__tit">{title}</h2>
              <div className="common_banner_03__desc">
                {description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <span className="btn-text-30 common_banner_03__link">
              {linkLabel}
              <span className="btn-text-30__icon">
                <span className="icon_arrow-18" aria-hidden="true" />
              </span>
            </span>
          </BannerLink>
        ) : (
          <div className="common_banner_03__body">
            <div className="common_banner_03__text">
              <p className="common_banner_03__kicker">{titleTop}</p>
              <h2 className="common_banner_03__tit">{title}</h2>
              <div className="common_banner_03__desc">
                {description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <span className="btn-text-30 common_banner_03__link">
              {linkLabel}
              <span className="btn-text-30__icon">
                <span className="icon_arrow-18" aria-hidden="true" />
              </span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
