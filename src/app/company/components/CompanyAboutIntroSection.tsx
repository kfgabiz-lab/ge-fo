import type { ReactNode } from "react";

type CompanyAboutIntroCta = {
  label: string;
  href: string;
};

type CompanyAboutIntroSectionProps = {
  heroImage: string;
  heroImageMobile?: string;
  headlineLines: string[];
  paragraphs: string[];
  heroImagePosition?: "center bottom";
  headlineSize?: "wide";
  paddingBottom?: "compact";
  withStats?: boolean;
  cta?: CompanyAboutIntroCta;
  children?: ReactNode;
};

export default function CompanyAboutIntroSection({
  heroImage,
  heroImageMobile,
  headlineLines,
  paragraphs,
  heroImagePosition,
  headlineSize,
  paddingBottom,
  withStats,
  cta,
  children,
}: CompanyAboutIntroSectionProps) {
  const sectionClass = [
    "company-about-intro",
    heroImagePosition === "center bottom" && "company-about-intro--hero-bottom",
    headlineSize === "wide" && "company-about-intro--headline-wide",
    paddingBottom === "compact" && "company-about-intro--compact",
    withStats && "company-about-intro--with-stats",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClass}>
      <div className="inner">
        <div className="company-about-intro__hero">
          {heroImageMobile ? (
            <>
              <img
                loading="lazy"
                decoding="async"
                src={heroImage}
                alt=""
                className="company-about-intro__hero-img company-about-intro__hero-img--pc"
              />
              <img
                loading="lazy"
                decoding="async"
                src={heroImageMobile}
                alt=""
                className="company-about-intro__hero-img company-about-intro__hero-img--mo"
              />
            </>
          ) : (
            <img loading="lazy" decoding="async" src={heroImage} alt="" />
          )}
        </div>
        <div className="company-about-intro__text">
          <h2 className="company-about-intro__headline">
            {headlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div className="company-about-intro__body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            {cta ? (
              <a
                href={cta.href}
                className="btn-base btn-lv01 btn-lv01--solid company-about-intro__cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{cta.label}</span>
                <img
                  src="/ico/ico_link.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="company-about-intro__cta-icon"
                  aria-hidden
                />
              </a>
            ) : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
