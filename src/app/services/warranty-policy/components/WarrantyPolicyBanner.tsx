import Link from "next/link";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

export default function WarrantyPolicyBanner() {
  const { banner } = warrantyPolicyPage;

  return (
    <section className="support_service_warranty_banner" id="warranty-support">
      <div className="inner">
        <div className="support_service_warranty_banner__panel">
          <div className="support_service_warranty_banner__bg" aria-hidden>
            {/* PC 배경 이미지 */}
            <img
              className="support_service_warranty_banner__bg-image support_service_warranty_banner__bg-image--pc"
              loading="lazy"
              decoding="async"
              src={banner.backgroundImage}
              alt=""
            />
            {/* 모바일 배경 이미지(없으면 PC 이미지로 폴백) */}
            <img
              className="support_service_warranty_banner__bg-image support_service_warranty_banner__bg-image--mo"
              loading="lazy"
              decoding="async"
              src={banner.backgroundImageMobile ?? banner.backgroundImage}
              alt=""
            />
          </div>
          <div className="support_service_warranty_banner__content">
            <h2 className="support_service_warranty_banner__tit">
              {banner.title}
            </h2>
            <p className="support_service_warranty_banner__desc">
              {banner.description}
            </p>
            <Link
              href={banner.ctaHref}
              className="btn-base btn-lv01 btn-lv01--line-solid support_service_warranty_banner__cta"
            >
              {banner.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
