import Link from "next/link";
import { Fragment } from "react";
import MarketsHeroScrollDown from "./MarketsHeroScrollDown";

type MarketsHeroVariant = "default" | "key-visual";

type MarketsHeroSecondaryCta = {
  label: string;
  href: string;
  icon?: "download" | "link";
};

type MarketsHeroProps = {
  subtitle?: string;
  title?: string;
  titleLines?: string[];
  heroImage?: string;
  variant?: MarketsHeroVariant;
  secondaryCta?: MarketsHeroSecondaryCta;
};

const DEFAULT_SUBTITLE = "Smart & Sustainable Building Infrastructure";
const DEFAULT_TITLE = "Commercial & Residential";

export default function MarketsHero({
  subtitle = DEFAULT_SUBTITLE,
  title = DEFAULT_TITLE,
  titleLines,
  heroImage,
  variant = "default",
  secondaryCta,
}: MarketsHeroProps) {
  const isKeyVisual = variant === "key-visual";
  const sectionClassName = [
    "markets_hero",
    isKeyVisual && "markets_hero--key-visual",
    heroImage && !isKeyVisual && "markets_hero--has-img",
  ]
    .filter(Boolean)
    .join(" ");

  const titleEl = (
    <h1 className="markets_hero__tit">
      {titleLines ? (
        titleLines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))
      ) : (
        title
      )}
    </h1>
  );
  const subtitleEl = <p className="markets_hero__sub">{subtitle}</p>;
  const buttonsEl = (
    <div className="markets_hero__btns">
      <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
        Contact Us
      </Link>
      <Link
        href={secondaryCta?.href ?? ""}
        className="btn-base btn-lv01 btn-lv01--line"
      >
        {secondaryCta?.label ?? "Get the Whitepaper"}
        <span
          className={secondaryCta?.icon === "link" ? "icon_link" : "icon_download"}
          aria-hidden="true"
        />
      </Link>
    </div>
  );

  const heroSection = (
    <section className={sectionClassName}>
      <div
        className="hero_img"
        style={
          heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined
        }
        aria-hidden="true"
      />
      <div className="markets_hero__content">
        {isKeyVisual ? (
          <>
            {titleEl}
            {subtitleEl}
          </>
        ) : (
          <>
            {subtitleEl}
            {titleEl}
          </>
        )}
        {buttonsEl}
      </div>
      {isKeyVisual ? <MarketsHeroScrollDown /> : null}
    </section>
  );

  if (isKeyVisual) {
    return (
      <div className="markets_hero__sticky-wrap" data-lenis-prevent-wheel>
        {heroSection}
      </div>
    );
  }

  return heroSection;
}
