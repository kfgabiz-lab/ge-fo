import Link from "next/link";
import type { DevicesCategoryProduct } from "../data/vfdContent";

type DevicesCategoryIntro = {
  parentLabel: string;
  parentHref?: string;
  title: string;
  description: string;
};

type DevicesCategoryListProps = {
  intro: DevicesCategoryIntro;
  products: DevicesCategoryProduct[];
  /** split: intro left + list right (VFD) · stacked: intro top + 2-col grid (LV Automation) */
  layout?: "split" | "stacked";
};

function CategoryProductCard({
  item,
  loading = "lazy",
}: {
  item: DevicesCategoryProduct;
  loading?: "eager" | "lazy";
}) {
  return (
    <article className="devices_category__item" data-slug-item>
      <div className="devices_category__item-img">
        {/* product_info.image = 파일ID 배열 → FE에서 /api/v1/fo/page-files/{id} 프록시 변환. 없으면 src 빈값으로 브라우저 기본 깨진 이미지 표시(레이아웃 유지) */}
        <img loading={loading} decoding="async" src={item.image ?? undefined} alt={item.title} data-slugkey="product_info.image" data-slugkey-attr="src" />
      </div>
      <div className="devices_category__item-body">
        <div className="devices_category__item-text">
          <h2 className="devices_category__item-tit" data-slugkey="product.product_name">{item.title}</h2>
          <p className="devices_category__item-desc" data-slugkey="product_info.info_description">{item.description}</p>
        </div>
        {/* href는 하위 카테고리/제품 상세 라우트로 이동하는 정적 라우팅 → 데이터 필드 아님(정적 유지) */}
        <Link href={item.href} className="btn-base btn-lv03 btn-lv03--solid">
          View Detail
        </Link>
      </div>
    </article>
  );
}

function chunkProducts<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function CategoryProductCardStacked({
  item,
  loading = "lazy",
}: {
  item: DevicesCategoryProduct;
  loading?: "eager" | "lazy";
}) {
  return (
    // href는 하위 카테고리/제품 상세 라우트로 이동하는 정적 라우팅 → 데이터 필드 아님(정적 유지)
    <Link href={item.href} className="devices_category__item" data-slug-item>
      <div className="devices_category__item-img">
        {/* product_info.image = 파일ID 배열 → FE에서 /api/v1/fo/page-files/{id} 프록시 변환. 없으면 src 빈값으로 브라우저 기본 깨진 이미지 표시(레이아웃 유지) */}
        <img loading={loading} decoding="async" src={item.image ?? undefined} alt={item.title} data-slugkey="product_info.image" data-slugkey-attr="src" />
      </div>
      <div className="devices_category__item-body">
        <div className="devices_category__item-text">
          <h2 className="devices_category__item-tit" data-slugkey="product.product_name">{item.title}</h2>
          <p className="devices_category__item-desc" data-slugkey="product_info.info_description">{item.description}</p>
        </div>
        <span className="btn-base btn-lv03 btn-lv03--solid">View Detail</span>
      </div>
    </Link>
  );
}

export default function DevicesCategoryList({
  intro,
  products,
  layout = "split",
}: DevicesCategoryListProps) {
  if (layout === "stacked") {
    return (
      <section className="devices_category devices_category--stacked">
        {/* data-slug: category-data (단건 — 카테고리 인트로, depth1 레코드)
            where=category.depth=1 AND 해당 페이지 카테고리 코드 · orderBy 없음(단건) */}
        <div className="inner devices_category__header" data-slug="category-data">
          {intro.parentHref ? (
            // parentLabel/parentHref = 상위(부모 메뉴/route) 브레드크럼 → category-data 대응 필드 없음(정적 유지)
            <Link href={intro.parentHref} className="devices_category__parent">
              {intro.parentLabel}
            </Link>
          ) : (
            <p className="devices_category__parent">{intro.parentLabel}</p>
          )}
          <h1 className="devices_category__tit" data-slugkey="category.title">{intro.title}</h1>
          <p className="devices_category__desc" data-slugkey="category.description">{intro.description}</p>
        </div>
        <div className="devices_category__grid-wrap">
          {/* STEP4 정정: 이 카드 목록은 하위 카테고리가 아니라 제품(product-data)이다.
              data-slug: product-data (다건 — VFD 제품 카드). where=product.is_visible=001 후 product_code 접두사(L01-15-) 클라이언트 필터, product_code ASC 정렬 */}
          <div className="inner devices_category__grid" data-slug="product-data" data-slug-repeat="true">
            {chunkProducts(products, 2).map((row, rowIndex) => (
              <div key={row.map((item) => item.id).join("-")} className="devices_category__grid-row">
                <CategoryProductCardStacked
                  item={row[0]}
                  loading={rowIndex === 0 ? "eager" : "lazy"}
                />
                {/* 2026-07-22: 홀수 개(행에 item 1개)일 때 grid-divider 미렌더 */}
                {row[1] ? (
                  <>
                    <div className="devices_category__grid-divider" aria-hidden="true" />
                    <CategoryProductCardStacked
                      item={row[1]}
                      loading={rowIndex === 0 ? "eager" : "lazy"}
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="devices_category">
      <div className="devices_category__layout">
        <div className="devices_category__intro">
          <div className="devices_category__intro-bg" aria-hidden="true" />
          {/* data-slug: category-data (단건 — 카테고리 인트로, depth1 레코드)
              where=category.depth=1 AND 해당 페이지 카테고리 코드 · orderBy 없음(단건) */}
          <div className="inner devices_category__intro-inner" data-slug="category-data">
            {intro.parentHref ? (
              // parentLabel/parentHref = 상위(부모 메뉴/route) 브레드크럼 → category-data 대응 필드 없음(정적 유지)
              <Link href={intro.parentHref} className="devices_category__parent">
                {intro.parentLabel}
              </Link>
            ) : (
              <p className="devices_category__parent">{intro.parentLabel}</p>
            )}
            <h1 className="devices_category__tit" data-slugkey="category.title">{intro.title}</h1>
            <p className="devices_category__desc" data-slugkey="category.description">{intro.description}</p>
          </div>
        </div>
        <div className="devices_category__list">
          {/* STEP4 정정: 이 카드 목록은 하위 카테고리가 아니라 제품(product-data)이다.
              data-slug: product-data (다건 — VFD 제품 카드). where=product.is_visible=001 후 product_code 접두사(L01-15-) 클라이언트 필터, product_code ASC 정렬 */}
          <div className="devices_category__list-inner" data-slug="product-data" data-slug-repeat="true">
            {products.map((item, index) => (
              <CategoryProductCard
                key={item.id}
                item={item}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
