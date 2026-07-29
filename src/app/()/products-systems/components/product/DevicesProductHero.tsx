import Link from "next/link";
import type { ProductDetail } from "../../data/productDetailContent";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import ProductSectionScrollLink from "./ProductSectionScrollLink";

type DevicesProductHeroProps = {
  product: ProductDetail;
  showDownloads?: boolean;
  contactHref?: string;
};

export default function DevicesProductHero({
  product,
  showDownloads = true,
  contactHref,
}: DevicesProductHeroProps) {
  const hasAward = product.awards === "01";

  const heroImage = (
    <img
      loading="eager"
      decoding="async"
      src={product.image ?? undefined}
      alt={product.series}
      className="devices_product_hero__img"
      data-slugkey="product_info.image"
      data-slugkey-attr="src"
    />
  );

  return (
    <section className="devices_product_hero" id="product-top" data-slug="product-data">
      <div className="inner devices_product_hero__inner">
        <div
          className={
            hasAward
              ? "devices_product_hero__visual devices_product_hero__visual--award type1"
              : "devices_product_hero__visual"
          }
        >
          {hasAward ? (
            <>
              <div className="devices_product_hero__award-visual">
                {heroImage}
                <ProductAwardBadge />
              </div>
              <p className="devices_product_hero__award-text">
                Winner of the iF Design Award Germany&apos;s premier design prize
              </p>
            </>
          ) : (
            heroImage
          )}
        </div>
        <div className="devices_product_hero__content">
          {product.category ? (
            <div className="devices_product_hero__meta">
              <span className="devices_product_hero__category">{product.category}</span>
            </div>
          ) : null}
          <div className="devices_product_hero__head">
            <h1 className="devices_product_hero__series" data-slugkey="product.product_name">{product.series}</h1>
            {product.subtitle ? (
              <p className="devices_product_hero__subtitle">{product.subtitle}</p>
            ) : null}
          </div>
          <p className="devices_product_hero__desc" data-slugkey="product.product_description">{product.description}</p>
          <hr className="devices_product_hero__line" />
          <dl className="devices_product_hero__specs">
            {product.specs.map((spec, index) => (
              <div key={spec.label} className="devices_product_hero__spec-row">
                <dt data-slugkey={`product_spec.spec${index + 1}_title`}>{spec.label}</dt>
                <dd data-slugkey={`product_spec.spec${index + 1}_content`}>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <div className="devices_product_hero__btns">
            <Link
              href={contactHref ?? product.expertBannerHref ?? "/support/contact-us"}
              prefetch={false}
              className="btn-base btn-lv01 btn-lv01--solid"
            >
              Contact Us
            </Link>
            {showDownloads ? (
              <ProductSectionScrollLink
                sectionId="product-downloads"
                className="btn-base btn-lv01 btn-lv01--line"
              >
                Scroll to Downloads
                <span className="icon_download" aria-hidden="true" />
              </ProductSectionScrollLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
