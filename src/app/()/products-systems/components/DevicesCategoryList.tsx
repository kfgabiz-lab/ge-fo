import Link from "next/link";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import { getProductBadgeType } from "@/lib/productBadge";
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
  layout?: "split" | "stacked";
};

function CategoryProductCard({
  item,
  loading = "lazy",
}: {
  item: DevicesCategoryProduct;
  loading?: "eager" | "lazy";
}) {
  const badgeType = getProductBadgeType(item);

  return (
    <article
      className={badgeType ? `devices_category__item ${badgeType}` : "devices_category__item"}
      data-slug-item
    >
      <div className="devices_category__item-img">
        {badgeType ? <ProductAwardBadge dataSlugKey="product.awards" /> : null}
        <img loading={loading} decoding="async" src={item.image ?? undefined} alt={item.title} data-slugkey="product_info.image" data-slugkey-attr="src" />
      </div>
      <div className="devices_category__item-body">
        <div className="devices_category__item-text">
          <h2 className="devices_category__item-tit" data-slugkey="product.product_name">{item.title}</h2>
          <p className="devices_category__item-desc" data-slugkey="product_info.info_description">{item.description}</p>
        </div>
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
  const badgeType = getProductBadgeType(item);

  return (
    <Link
      href={item.href}
      className={badgeType ? `devices_category__item ${badgeType}` : "devices_category__item"}
      data-slug-item
    >
      <div className="devices_category__item-img">
        {badgeType ? <ProductAwardBadge dataSlugKey="product.awards" /> : null}
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
        <div className="inner devices_category__header" data-slug="category-data">
          {intro.parentHref ? (
            <Link href={intro.parentHref} className="devices_category__parent">
              {intro.parentLabel}
            </Link>
          ) : (
            <p className="devices_category__parent">{intro.parentLabel}</p>
          )}
          <h1 className="devices_category__tit" data-slugkey="category.title">{intro.title}</h1>
          <p className="devices_category__desc" data-slugkey="device_systems.description">{intro.description}</p>
        </div>
        <div className="devices_category__grid-wrap">
          <div className="inner devices_category__grid" data-slug="product-data" data-slug-repeat="true">
            {chunkProducts(products, 2).map((row, rowIndex) => (
              <div key={row.map((item) => item.id).join("-")} className="devices_category__grid-row">
                <CategoryProductCardStacked
                  item={row[0]}
                  loading={rowIndex === 0 ? "eager" : "lazy"}
                />
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
          <div className="inner devices_category__intro-inner" data-slug="category-data">
            {intro.parentHref ? (
              <Link href={intro.parentHref} className="devices_category__parent">
                {intro.parentLabel}
              </Link>
            ) : (
              <p className="devices_category__parent">{intro.parentLabel}</p>
            )}
            <h1 className="devices_category__tit" data-slugkey="category.title">{intro.title}</h1>
            <p className="devices_category__desc" data-slugkey="device_systems.description">{intro.description}</p>
          </div>
        </div>
        <div className="devices_category__list">
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
