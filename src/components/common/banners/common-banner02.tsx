import Link from "next/link";
import type { ReactNode } from "react";
import CommonBanner02CopyLink from "@/components/banners/CommonBanner02CopyLink";

export type CommonBanner02Variant = "default" | "expert";

type CommonBanner02Props = {
  variant?: CommonBanner02Variant;
  title?: string;
  description?: string[];
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
  contactEmail?: string;
  /** When false, only the CTA links — the panel stays a static block */
  linkWrapPanel?: boolean;
  /** Panel background — default is shared banner art; product pages may override */
  backgroundSrc?: string;
  sectionId?: string;
};

const DEFAULT_BACKGROUND_SRC = "/img/devices/product/banner_configurator_bg.png";

const DEFAULT_TITLE = "Consult with an LS ELECTRIC Expert";
const DEFAULT_EXPERT_TITLE = "Connect with Our Product Expert";
const DEFAULT_DESCRIPTION = [
  "Have a general question not related to quotes or technical service?",
  "Leave us a message and our team will get back to you.",
];
const DEFAULT_EXPERT_DESCRIPTION = [
  "Reach out to our dedicated specialist for technical inquiries and product support.",
];
const DEFAULT_LINK_LABEL = "Go to Configurator";
const DEFAULT_EXPERT_LINK_LABEL = "Send an Inquiry";
const DEFAULT_EXPERT_EMAIL = "automation_support.us@lselectricamerica.com";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function BannerLink({
  href,
  linkExternal,
  className,
  children,
}: {
  href: string;
  linkExternal?: boolean;
  className: string;
  children: ReactNode;
}) {
  if (linkExternal || isExternalHref(href)) {
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

function CommonBanner02Link({
  href,
  linkExternal,
  linkLabel,
}: {
  href?: string;
  linkExternal?: boolean;
  linkLabel: string;
}) {
  const content = (
    <>
      {linkLabel}
      <span className="btn-text-30__icon">
        <span className="icon_link-14" aria-hidden="true" />
      </span>
    </>
  );

  if (!href) {
    return <span className="btn-text-30 common_banner_02__link">{content}</span>;
  }

  return (
    <BannerLink
      href={href}
      linkExternal={linkExternal}
      className="btn-text-30 common_banner_02__link"
    >
      {content}
    </BannerLink>
  );
}

function CommonBanner02Panel({
  variant,
  title,
  description,
  linkHref,
  linkLabel,
  linkExternal,
  contactEmail,
  backgroundSrc,
}: {
  variant: CommonBanner02Variant;
  title: string;
  description: string[];
  linkHref?: string;
  linkLabel: string;
  linkExternal?: boolean;
  contactEmail?: string;
  backgroundSrc: string;
}) {
  return (
    <div className="common_banner_02__body">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="common_banner_02__bg"
        src={backgroundSrc}
        alt=""
        aria-hidden
      />
      {variant === "expert" ? (
        <>
          <div className="common_banner_02__content">
            <div className="common_banner_02__text">
              <h2 className="banner_tit">{title}</h2>
              <div className="txt common_banner_02__desc">
                {description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            {contactEmail ? (
              <div className="common_banner_02__contact">
                <a
                  href={`mailto:${contactEmail}`}
                  className="common_banner_02__email"
                >
                  {contactEmail}
                </a>
                <CommonBanner02CopyLink value={contactEmail} />
              </div>
            ) : null}
          </div>
          <CommonBanner02Link
            href={linkHref}
            linkExternal={linkExternal}
            linkLabel={linkLabel}
          />
        </>
      ) : (
        <>
          <div className="common_banner_02__text">
            <h2 className="banner_tit">{title}</h2>
            <div className="txt common_banner_02__desc">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <CommonBanner02Link
            href={linkHref}
            linkExternal={linkExternal}
            linkLabel={linkLabel}
          />
        </>
      )}
    </div>
  );
}

export default function CommonBanner02({
  variant = "default",
  title,
  description,
  linkHref,
  linkLabel,
  linkExternal,
  contactEmail,
  linkWrapPanel = true,
  backgroundSrc = DEFAULT_BACKGROUND_SRC,
  sectionId,
}: CommonBanner02Props) {
  const resolvedTitle =
    title ?? (variant === "expert" ? DEFAULT_EXPERT_TITLE : DEFAULT_TITLE);
  const resolvedDescription =
    description ??
    (variant === "expert" ? DEFAULT_EXPERT_DESCRIPTION : DEFAULT_DESCRIPTION);
  const resolvedLinkLabel =
    linkLabel ??
    (variant === "expert" ? DEFAULT_EXPERT_LINK_LABEL : DEFAULT_LINK_LABEL);
  const resolvedContactEmail =
    variant === "expert" ? (contactEmail ?? DEFAULT_EXPERT_EMAIL) : contactEmail;

  const panel = (
    <CommonBanner02Panel
      variant={variant}
      title={resolvedTitle}
      description={resolvedDescription}
      linkHref={variant === "expert" || !linkWrapPanel ? linkHref : undefined}
      linkLabel={resolvedLinkLabel}
      linkExternal={linkExternal}
      contactEmail={resolvedContactEmail}
      backgroundSrc={backgroundSrc}
    />
  );

  const wrapPanelWithLink = Boolean(
    variant === "default" && linkHref && linkWrapPanel,
  );

  return (
    <section
      className={
        variant === "expert"
          ? "common_banner_02 common_banner_02--expert"
          : "common_banner_02"
      }
      id={sectionId}
    >
      <div className="inner">
        {wrapPanelWithLink ? (
          <BannerLink
            href={linkHref!}
            linkExternal={linkExternal}
            className="common_banner_02__panel"
          >
            {panel}
          </BannerLink>
        ) : (
          <div className="common_banner_02__panel">{panel}</div>
        )}
      </div>
    </section>
  );
}
