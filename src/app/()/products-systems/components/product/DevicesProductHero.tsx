import Link from "next/link";
import type { ProductDetail } from "../../data/productDetailContent";
import ProductSectionScrollLink from "./ProductSectionScrollLink";

type DevicesProductHeroProps = {
  product: ProductDetail;
};

export default function DevicesProductHero({ product }: DevicesProductHeroProps) {
  return (
    // data-slug: product-data (단건 — HW 제품상세 코어). where=제품 unique key(seo.slug 또는 product.product_code)
    <section className="devices_product_hero" id="product-top" data-slug="product-data">
      <div className="inner devices_product_hero__inner">
        <div className="devices_product_hero__visual">
          {/* product_info.image = 파일ID 배열 → FE에서 /api/v1/fo/page-files/{id} 프록시 변환 */}
          <img
            loading="eager"
            decoding="async"
            src={product.image}
            alt={product.series}
            className="devices_product_hero__img"
            data-slugKey="product_info.image"
            data-slugKey-attr="src"
          />
        </div>
        <div className="devices_product_hero__content">
          {/* <div className="devices_product_hero__meta">
            <span className="devices_product_hero__category">{product.category}</span>
          </div> */}
          <div className="devices_product_hero__head">
            {/* 히어로 메인 제목(series 슬롯) = 제품명 → product.product_name */}
            <h1 className="devices_product_hero__series" data-slugKey="product.product_name">{product.series}</h1>
            {/* subtitle = product-data 대응 필드 없음(실측) → 정적 유지, 태그 없음 */}
            {product.subtitle ? (
              <p className="devices_product_hero__subtitle">{product.subtitle}</p>
            ) : null}
          </div>
          <p className="devices_product_hero__desc" data-slugKey="product.product_description">{product.description}</p>
          <hr className="devices_product_hero__line" />
          {/* specs는 배열이 아니라 product_spec의 고정 3필드(spec1~3_title/_content)를 목록 렌더 → data-slug-repeat 아님.
              각 행을 인덱스로 product_spec.spec{N}_title/_content에 매핑(최대 3) */}
          <dl className="devices_product_hero__specs">
            {product.specs.map((spec, index) => (
              <div key={spec.label} className="devices_product_hero__spec-row">
                <dt data-slugKey={`product_spec.spec${index + 1}_title`}>{spec.label}</dt>
                <dd data-slugKey={`product_spec.spec${index + 1}_content`}>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <div className="devices_product_hero__btns">
            <Link
              href={product.expertBannerHref ?? "/support/contact-us"}
              prefetch={false}
              className="btn-base btn-lv01 btn-lv01--solid"
            >
              Contact Us
            </Link>
            <ProductSectionScrollLink
              sectionId="product-downloads"
              className="btn-base btn-lv01 btn-lv01--line"
            >
              Scroll to Downloads
              <span className="icon_download" aria-hidden="true" />
            </ProductSectionScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
}
