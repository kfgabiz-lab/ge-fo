import Link from "next/link";
import { hvdcHero } from "../../data/hvdcContent";

export default function DevicesHvdcHero() {
  return (
    <section className="devices_software_hero" id="product-top">
      <div className="inner devices_software_hero__inner">
        <p className="devices_software_hero__tagline">{hvdcHero.tagline}</p>
        <h1 className="devices_software_hero__title">{hvdcHero.title}</h1>
        <p className="devices_software_hero__desc">{hvdcHero.description}</p>
        <div className="devices_software_hero__btns">
          <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
