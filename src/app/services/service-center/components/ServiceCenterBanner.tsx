import Link from "next/link";
import { serviceCenterPage } from "@/data/services/serviceCenterContent";

export default function ServiceCenterBanner() {
  const { banner } = serviceCenterPage;

  return (
    <section className="support_service_banner" id="service-center-banner">
      <div className="support_service_banner__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="support_service_banner__bg-image support_service_banner__bg-image--pc"
          loading="lazy"
          decoding="async"
          src={banner.backgroundImage}
          alt=""
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="support_service_banner__bg-image support_service_banner__bg-image--mo"
          loading="lazy"
          decoding="async"
          src={banner.backgroundImageMobile ?? banner.backgroundImage}
          alt=""
        />
      </div>
      <div className="inner support_service_banner__inner">
        <div className="support_service_banner__copy">
          <h2 className="support_service_banner__tit">{banner.title}</h2>
          <p className="support_service_banner__desc">{banner.description}</p>
        </div>
        <Link
          href={banner.ctaHref}
          className="btn-base btn-lv01 btn-lv01--line-solid support_service_banner__cta"
        >
          {banner.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
