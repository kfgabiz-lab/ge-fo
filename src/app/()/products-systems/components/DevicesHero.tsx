import Link from "next/link";
import DevicesProducts from "./DevicesProducts";
import {
  motorControlHero,
  type DevicesProductItem,
} from "../data/motorControlContent";

type DevicesHeroProps = {
  title?: string;
  description?: string;
  showCta?: boolean;
  withProducts?: boolean;
  products?: DevicesProductItem[];
};

export default function DevicesHero({
  title = motorControlHero.title,
  description = motorControlHero.description,
  showCta = false,
  withProducts = false,
  products,
}: DevicesHeroProps) {
  return (
    <section
      className={`devices_hero${withProducts ? " devices_hero--with-products" : ""}`}
    >
      <div className="devices_hero" aria-hidden="true" />
      <div className="inner">
        <div className="devices_hero__inner" data-slug="category-data">
          <h1 className="devices_hero__tit" data-slugkey="category.title">{title}</h1>
          <p className="devices_hero__desc" data-slugkey="device_systems.description">{description}</p>
          {showCta ? (
            <div className="devices_hero__btns">
              <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
                Contact Us
              </Link>
            </div>
          ) : null}
        </div>
        {withProducts ? (
          <DevicesProducts embedded showHead={false} items={products} />
        ) : null}
      </div>
    </section>
  );
}
