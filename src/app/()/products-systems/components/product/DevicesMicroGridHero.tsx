import Link from "next/link";
import { microGridHero } from "../../data/microGridContent";

// title/description 은 product-data(단건) 실데이터로 덮어쓰기, 미지정 시 정적 폴백
type DevicesMicroGridHeroProps = {
  title?: string;
  description?: string;
};

export default function DevicesMicroGridHero({
  title = microGridHero.title,
  description = microGridHero.description,
}: DevicesMicroGridHeroProps = {}) {
  const descriptionLines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="devices_software_hero" id="product-top">
      {/* data-slug: product-data (단건 — SW 제품상세 코어). where=제품 unique key(seo.slug 또는 product.product_code) */}
      <div className="inner devices_software_hero__inner" data-slug="product-data">
        <h1 className="devices_software_hero__title" data-slugKey="product.product_name">{title}</h1>
        <p className="devices_software_hero__desc" data-slugKey="product.product_description">
          {descriptionLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < descriptionLines.length - 1 ? <br /> : null}
            </span>
          ))}
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
