import Link from "next/link";
import { xemsHero } from "../../data/xemsContent";

export default function DevicesXemsHero({
  title = xemsHero.title,
  description = xemsHero.description,
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
