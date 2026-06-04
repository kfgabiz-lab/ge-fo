"use client";

import Link from "next/link";
import type { GnbMegaDepth2, GnbMegaDepth3, GnbMegaProduct } from "@/data/gnb";

type GnbMegaPanelProps = {
  categories: GnbMegaDepth2[];
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  onExploreAllClick: () => void;
  onLinkClick?: () => void;
};

function findDepth3(
  categories: GnbMegaDepth2[],
  categoryId: string,
  depth3Id: string,
): GnbMegaDepth3 | undefined {
  const category = categories.find((item) => item.id === categoryId);
  return category?.children.find((item) => item.id === depth3Id);
}

function getDepth4Products(item: GnbMegaDepth3): GnbMegaProduct[] {
  if (item.products?.length) {
    return item.products;
  }

  if (item.product) {
    return [item.product];
  }

  return [];
}

function ProductCard({
  product,
  onLinkClick,
}: {
  product: GnbMegaProduct;
  onLinkClick?: () => void;
}) {
  return (
    <Link
      href={product.href}
      prefetch={false}
      className="gnb_mega__product"
      onClick={onLinkClick}
    >
      <div className="gnb_mega__product-text">
        <p className="gnb_mega__product-tit">{product.title}</p>
        <p className="gnb_mega__product-sub">{product.subtitle}</p>
      </div>
      <div className="gnb_mega__product-img">
        <img loading="lazy" decoding="async" src={product.image} alt="" />
      </div>
    </Link>
  );
}

export default function GnbMegaPanel({
  categories,
  activeCategoryId,
  activeDepth3Id,
  onCategoryChange,
  onDepth3Change,
  onExploreAllClick,
  onLinkClick,
}: GnbMegaPanelProps) {
  const activeCategory =
    categories.find((item) => item.id === activeCategoryId) ?? categories[0];
  const activeDepth3 =
    findDepth3(categories, activeCategory.id, activeDepth3Id) ??
    activeCategory.children[0];
  const depth4Products = activeDepth3 ? getDepth4Products(activeDepth3) : [];

  return (
    <div className="gnb_mega__inner">
      <div className="gnb_mega__col gnb_mega__col--depth2">
        <div className="gnb_mega__depth2-body">
          <ul className="gnb_mega__depth2-list">
            {categories.map((category) => {
              const categoryHref = category.children[0]?.href || "#";

              return (
                <li key={category.id}>
                  <Link
                    href={categoryHref}
                    prefetch={false}
                    className={
                      category.id === activeCategory.id
                        ? "gnb_mega__depth2-btn is-active"
                        : "gnb_mega__depth2-btn"
                    }
                    onMouseEnter={() => onCategoryChange(category.id)}
                    onFocus={() => onCategoryChange(category.id)}
                    onClick={(event) => {
                      if (!category.children[0]?.href) {
                        event.preventDefault();
                        return;
                      }
                      onLinkClick?.();
                    }}
                  >
                    {category.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="#"
            className="gnb_mega__explore"
            onClick={(event) => {
              event.preventDefault();
              onExploreAllClick();
            }}
          >
            Explore All Products
          </Link>
        </div>
      </div>

      <div className="gnb_mega__col gnb_mega__col--depth3">
        <div className="gnb_mega__depth3-scroll">
          <ul className="gnb_mega__depth3-list">
            {activeCategory.children.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href || "#"}
                  prefetch={false}
                  className={
                    item.id === activeDepth3?.id
                      ? "gnb_mega__depth3-btn is-active"
                      : "gnb_mega__depth3-btn"
                  }
                  onMouseEnter={() => onDepth3Change(item.id)}
                  onFocus={() => onDepth3Change(item.id)}
                  onClick={(event) => {
                    if (!item.href) {
                      event.preventDefault();
                      return;
                    }
                    onLinkClick?.();
                  }}
                >
                  {item.label.split("\n").map((line, index) => (
                    <span key={`${item.id}-${index}`}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {activeDepth3 ? (
        <div className="gnb_mega__col gnb_mega__col--depth4">
          <div className="gnb_mega__depth4-intro">
            <Link
              href={activeDepth3.href}
              prefetch={false}
              className="gnb_mega__depth4-head"
              onClick={onLinkClick}
            >
              <h3 className="gnb_mega__depth4-tit">{activeDepth3.panelTitle}</h3>
              <span className="gnb_mega__depth4-arrow" aria-hidden>
                <span className="gnb_mega__depth4-arrow-icon" aria-hidden />
              </span>
            </Link>
            <div className="gnb_mega__depth4-desc">
              <p>
                {activeDepth3.description.map((line, index) => (
                  <span key={`${activeDepth3.id}-desc-${index}`}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
          {depth4Products.length > 0 ? (
            <div className="gnb_mega__products">
              {depth4Products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
