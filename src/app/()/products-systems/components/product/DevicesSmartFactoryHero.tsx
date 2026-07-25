import Link from "next/link";
import { smartFactoryHero } from "../../data/smartFactoryContent";

// title/description은 product-data(product.product_name / product.product_description) 실데이터로 덮어쓸 수 있게 prop으로 받는다.
// 값이 없으면(prop 미전달) 이관된 정적 콘텐츠(smartFactoryHero)를 그대로 유지한다(필드별 fallback).
export default function DevicesSmartFactoryHero({
  title = smartFactoryHero.title,
  description = smartFactoryHero.description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="devices_software_hero" id="product-top">
      <div className="inner devices_software_hero__inner">
        <h1
          className="devices_software_hero__title"
          data-slug="product-data"
          data-slugkey="product.product_name"
        >
          {title}
        </h1>
        <p
          className="devices_software_hero__desc"
          data-slug="product-data"
          data-slugkey="product.product_description"
        >
          {description}
        </p>
        <div className="devices_software_hero__btns">
          <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
