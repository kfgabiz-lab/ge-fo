import Link from "next/link";
import { renderMultilineText } from "../../lib/renderMultilineText";

export type DevicesSoftwareHeroProps = {
  title: string;
  description: string;
  tagline?: string | null;
  showTagline?: boolean;
  multilineDescription?: boolean;
  contactHref?: string;
};

export default function DevicesSoftwareHero({
  title,
  description,
  tagline = null,
  showTagline = false,
  multilineDescription = false,
  contactHref = "/support/contact-us",
}: DevicesSoftwareHeroProps) {
  return (
    <section className="devices_software_hero" id="product-top">
      <div className="inner devices_software_hero__inner">
        {showTagline ? (
          <p className="devices_software_hero__tagline">{tagline}</p>
        ) : null}
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
          {multilineDescription ? renderMultilineText(description) : description}
        </p>
        <div className="devices_software_hero__btns">
          <Link href={contactHref} className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
