import Link from "next/link";
import { microGridHero } from "../../data/microGridContent";

export default function DevicesMicroGridHero() {
  const descriptionLines = microGridHero.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="devices_micro_grid_hero" id="product-top">
      <div className="inner devices_micro_grid_hero__inner">
        <h1 className="devices_micro_grid_hero__title">{microGridHero.title}</h1>
        <p className="devices_micro_grid_hero__desc">
          {descriptionLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < descriptionLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <div className="devices_micro_grid_hero__btns">
          <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
