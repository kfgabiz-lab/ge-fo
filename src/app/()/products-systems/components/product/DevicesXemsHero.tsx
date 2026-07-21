import Link from "next/link";
import { xemsHero } from "../../data/xemsContent";

// title/description 은 product-data(단건) 실데이터로 덮어쓰기, 미지정 시 정적 폴백
type DevicesXemsHeroProps = {
  title?: string;
  description?: string;
};

export default function DevicesXemsHero({
  title = xemsHero.title,
  description = xemsHero.description,
}: DevicesXemsHeroProps = {}) {
  return (
    <section className="devices_software_hero" id="product-top">
      {/* data-slug: product-data (단건 — SW 제품상세 코어). where=제품 unique key(seo.slug 또는 product.product_code) */}
      <div className="inner devices_software_hero__inner" data-slug="product-data">
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
