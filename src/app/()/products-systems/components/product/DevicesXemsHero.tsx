import Link from "next/link";
import { xemsHero } from "../../data/xemsContent";

export default function DevicesXemsHero() {
  return (
    <section className="devices_software_hero" id="product-top">
      <div className="inner devices_software_hero__inner">
        <h1 className="devices_software_hero__title">{xemsHero.title}</h1>
        <p className="devices_software_hero__desc">{xemsHero.description}</p>
        <div className="devices_software_hero__btns">
          <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
