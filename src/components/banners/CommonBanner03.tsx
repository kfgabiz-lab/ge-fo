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
  backgroundSrc?: string;
  backgroundSrcMo?: string;
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

function BannerText({
  titleTop,
  title,
  description,
}: {
  titleTop: string;
  title?: string;
  description?: string[];
}) {
  return (
    <div className="common_banner_03__text">
      <div className="common_banner_03__title">
        <p className="common_banner_03__kicker">{titleTop}</p>
        {title ? <h2 className="common_banner_03__tit">{title}</h2> : null}
      </div>
      {description && description.length > 0 ? (
        <div className="common_banner_03__desc">
          {description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BannerCta({ linkLabel }: { linkLabel: string }) {
  return (
    <span className="btn-text-30 common_banner_03__link">
      {linkLabel}
      <span className="btn-text-30__icon">
        <span className="icon_arrow-18" aria-hidden="true" />
      </span>
    </span>
  );
}

const DEFAULT_BACKGROUND_SRC = "/img/devices/product/banner_hub_bg.png";
const DEFAULT_BACKGROUND_SRC_MO = "/img/devices/product/banner_hub_bg_mo.svg";

export default function CommonBanner03({
  titleTop = "Tech Hub Video Guide",
  title,
  description,
  linkHref = "/support/tech-hub",
  linkLabel = "Explore Tech Hub",
  linkExternal,
  backgroundSrc = DEFAULT_BACKGROUND_SRC,
  backgroundSrcMo = DEFAULT_BACKGROUND_SRC_MO,
}: CommonBanner03Props) {
  return (
    <section className="common_banner_03">
      <div className="inner common_banner_03__panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          src={backgroundSrc}
          alt=""
          aria-hidden
          className="common_banner_03__bg common_banner_03__bg--pc"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          src={backgroundSrcMo}
          alt=""
          aria-hidden
          className="common_banner_03__bg common_banner_03__bg--mo"
        />

        <div className="common_banner_03__content">
          {linkHref ? (
            <BannerLink
              href={linkHref}
              linkExternal={linkExternal}
              className="common_banner_03__body"
            >
              <BannerText
                titleTop={titleTop}
                title={title}
                description={description}
              />
            </BannerLink>
          ) : (
            <div className="common_banner_03__body">
              <BannerText
                titleTop={titleTop}
                title={title}
                description={description}
              />
            </div>
          )}

          {linkHref ? (
            <BannerLink
              href={linkHref}
              linkExternal={linkExternal}
              className="common_banner_03__link-wrap"
              ariaLabel={linkLabel}
            >
              <BannerCta linkLabel={linkLabel} />
            </BannerLink>
          ) : (
            <div className="common_banner_03__link-wrap">
              <BannerCta linkLabel={linkLabel} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
