import Link from "next/link";
import type { ProductDetail } from "../../data/productDetailContent";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import ProductSectionScrollLink from "./ProductSectionScrollLink";

type DevicesProductHeroProps = {
  product: ProductDetail;
  /** Downloads 섹션 노출 여부(호출부 GenericProductDetail 의 showDownloads).
   *  false 면 스크롤 대상 섹션이 없으므로 "Scroll to Downloads" 버튼을 렌더하지 않는다. */
  showDownloads?: boolean;
};

export default function DevicesProductHero({
  product,
  showDownloads = true,
}: DevicesProductHeroProps) {
  // 8번 Design Awards: product.awards === "01"(iF Design Awards)일 때만 배지 노출
  const hasAward = product.awards === "01";

  // product_info.image = 파일ID 배열 → FE에서 /api/v1/fo/page-files/{id} 프록시 변환.
  // 없으면 src 빈값으로 브라우저 기본 깨진 이미지 표시(레이아웃 유지)
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
    // data-slug: product-data (단건 — HW 제품상세 코어). where=제품 unique key(seo.slug 또는 product.product_code)
    <section className="devices_product_hero" id="product-top" data-slug="product-data">
      <div className="inner devices_product_hero__inner">
        <div
          className={
            hasAward
              ? "devices_product_hero__visual devices_product_hero__visual--award type1"
              : "devices_product_hero__visual"
          }
        >
          {/* Design Awards 배치 — 사이트 전역 표준(카테고리 리스트/마켓/기타제품/메인)과 동일하게
              공용 ProductAwardBadge(.product_award_badge, right:0/bottom:0 절대배치)를 그대로 재사용해
              iF 로고를 제품 이미지 우하단에 오버레이한다. 로고 크기는 상위 .type1 클래스가 결정(lg).
              문구는 오버레이가 아니라 이미지 폭 전체 아래 별도 줄로 배치되므로 Hero 전용 컨테이너로 분리한다.
              공용 컴포넌트/CSS(product-award-badge.css)는 다른 5개 사용처 회귀 방지를 위해 수정하지 않는다. */}
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
          {/* 기획서 4번 카테고리 라벨 — 제품이 속한 Lv2 카테고리명.
              값의 출처는 product-data 가 아니라 category-data depth3 junction(devices-tree)의 상위 Lv2 이므로
              product-data 용 data-slugkey 를 붙이지 않는다(호출부 GenericProductDetail 이 detail.category 로 주입).
              연결 Lv2가 없으면 ""가 들어오고, 이때는 정적 플레이스홀더 대신 블록 자체를 렌더하지 않는다. */}
          {product.category ? (
            <div className="devices_product_hero__meta">
              <span className="devices_product_hero__category">{product.category}</span>
            </div>
          ) : null}
          <div className="devices_product_hero__head">
            {/* 히어로 메인 제목(series 슬롯) = 제품명 → product.product_name */}
            <h1 className="devices_product_hero__series" data-slugkey="product.product_name">{product.series}</h1>
            {/* subtitle = product-data 대응 필드 없음(실측) → 정적 유지, 태그 없음 */}
            {product.subtitle ? (
              <p className="devices_product_hero__subtitle">{product.subtitle}</p>
            ) : null}
          </div>
          <p className="devices_product_hero__desc" data-slugkey="product.product_description">{product.description}</p>
          <hr className="devices_product_hero__line" />
          {/* specs는 배열이 아니라 product_spec의 고정 3필드(spec1~3_title/_content)를 목록 렌더 → data-slug-repeat 아님.
              각 행을 인덱스로 product_spec.spec{N}_title/_content에 매핑(최대 3) */}
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
              href={product.expertBannerHref ?? "/support/contact-us"}
              prefetch={false}
              className="btn-base btn-lv01 btn-lv01--solid"
            >
              Contact Us
            </Link>
            {/* Downloads 섹션이 미출력된 제품에서는 스크롤 대상이 없어 죽은 링크가 되므로 버튼도 숨긴다.
                "Contact Us" 버튼은 Downloads 유무와 무관하게 항상 노출한다. */}
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
