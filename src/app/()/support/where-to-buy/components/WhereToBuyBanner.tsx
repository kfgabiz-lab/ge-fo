import Link from "next/link";
import { whereToBuyBanner } from "@/data/support/whereToBuyContent";

/** Figma 5752:47255 — ## 02_Banner */
export default function WhereToBuyBanner() {
  const { backgroundImage, title, description, ctaLabel, ctaHref } =
    whereToBuyBanner;

  return (
    <section
      className="support_where_to_buy_banner common_banner_02"
      id="support-where-to-buy-banner"
    >
      <div className="inner">
        <div className="common_banner_02__panel">
          <div className="common_banner_02__body">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              decoding="async"
              className="common_banner_02__bg"
              src={backgroundImage}
              alt=""
              aria-hidden
            />
            <div className="support_where_to_buy_banner__dim" aria-hidden />
            <div className="common_banner_02__text">
              <h2 className="banner_tit">{title}</h2>
              <div className="txt common_banner_02__desc">
                <p>{description}</p>
              </div>
            </div>
            <Link href={ctaHref} className="btn-text-30 common_banner_02__link">
              {ctaLabel}
              <span className="btn-text-30__icon">
                <span className="icon_arrow-14" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
