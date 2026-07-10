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
  // key-visual 변형 — Power Grid 등 스티키 히어로
  if (variant === "key-visual") {
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

    return (
      <div className="markets_hero__sticky-wrap" data-lenis-prevent-wheel>
        <section className="markets_hero markets_hero--key-visual">
          <div
            className="hero_img"
            style={
              heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined
            }
            aria-hidden="true"
          />
          <div className="markets_hero__content">
            {titleEl}
            <p className="markets_hero__sub">{subtitle}</p>
            <div className="markets_hero__btns">
              <Link
                href="/support/contact-us"
                className="btn-base btn-lv01 btn-lv01--solid"
              >
                Contact Us
              </Link>
              <Link
                href={secondaryCta?.href ?? ""}
                className="btn-base btn-lv01 btn-lv01--line"
              >
                {secondaryCta?.label ?? "Get the Whitepaper"}
                <span
                  className={
                    secondaryCta?.icon === "link" ? "icon_link" : "icon_download"
                  }
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
          <MarketsHeroScrollDown />
        </section>
      </div>
    );
  }

  // default 변형 — data-center 등 기존 렌더링 (변경 금지)
  return (
    <section className="markets_hero">
      <div className="markets_hero__content">
        <p className="markets_hero__sub">{subtitle}</p>
        <h1 className="markets_hero__tit">{title}</h1>
        <div className="markets_hero__btns">
          <Link href="" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
          <Link href="" className="btn-base btn-lv01 btn-lv01--line">
            Get the Whitepaper
            <span className="icon_download" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div
        className="hero_img"
        style={
          heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined
        }
        aria-hidden="true"
      />
    </section>
  );
}
