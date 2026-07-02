import Link from "next/link";
import DevicesProducts from "./DevicesProducts";
import { motorControlHero } from "../data/motorControlContent";

type DevicesHeroProps = {
  title?: string;
  description?: string;
  showCta?: boolean;
  withProducts?: boolean;
};

export default function DevicesHero({
  title = motorControlHero.title,
  description = motorControlHero.description,
  showCta = false,
  withProducts = false,
}: DevicesHeroProps) {
  return (
    <section
      className={`devices_hero${withProducts ? " devices_hero--with-products" : ""}`}
    >
      <div className="devices_hero" aria-hidden="true" />
      <div className="inner">
        <div className="devices_hero__inner">
          <h1 className="devices_hero__tit">{title}</h1>
          <p className="devices_hero__desc">{description}</p>
          {showCta ? (
            <div className="devices_hero__btns">
              <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
                Contact Us
              </Link>
            </div>
          ) : null}
        </div>
        {withProducts ? <DevicesProducts embedded showHead={false} /> : null}
      </div>
    </section>
  );
}
