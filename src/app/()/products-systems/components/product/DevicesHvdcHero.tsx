import Link from "next/link";
import { hvdcHero } from "../../data/hvdcContent";

// title/description 은 product-data(단건) 실데이터로 덮어쓰기, 미지정 시 정적 폴백
type DevicesHvdcHeroProps = {
  title?: string;
  description?: string;
};

export default function DevicesHvdcHero({
  title = hvdcHero.title,
  description = hvdcHero.description,
}: DevicesHvdcHeroProps = {}) {
  return (
    <section className="devices_software_hero" id="product-top">
      {/* data-slug: product-data (단건 — SW 제품상세 코어). where=제품 unique key(seo.slug 또는 product.product_code) */}
      <div className="inner devices_software_hero__inner" data-slug="product-data">
        {/* tagline = product-data 대응 필드 없음(실측) → 정적 유지, 태그 없음 */}
        <p className="devices_software_hero__tagline">{hvdcHero.tagline}</p>
        <h1 className="devices_software_hero__title" data-slugkey="product.product_name">{title}</h1>
        <p className="devices_software_hero__desc" data-slugkey="product.product_description">{description}</p>
        <div className="devices_software_hero__btns">
          <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
