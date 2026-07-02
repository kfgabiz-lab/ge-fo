import Link from "next/link";
import { smartFactoryHero } from "../../data/smartFactoryContent";

export default function DevicesSmartFactoryHero() {
  return (
    <section className="devices_smart_factory_hero" id="product-top">
      <div className="inner devices_smart_factory_hero__inner">
        <h1 className="devices_smart_factory_hero__title">{smartFactoryHero.title}</h1>
        <p className="devices_smart_factory_hero__desc">{smartFactoryHero.description}</p>
        <div className="devices_smart_factory_hero__btns">
          <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
