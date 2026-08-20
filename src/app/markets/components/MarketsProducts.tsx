"use client";

import { useState } from "react";
import Link from "next/link";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import { getProductBadgeType } from "@/lib/productBadge";
import type { ProductItem } from "../data/marketsContent";

const PAGE_SIZE = 8;

type MarketsProductsProps = {
  items: ProductItem[];
  badgesType2Only?: boolean;
};

export default function MarketsProducts({
  items,
  badgesType2Only = false,
}: MarketsProductsProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleItems = items.slice(0, visibleCount);

  return (
    <section className="markets_products">
      <div className="inner">
        <h2 className="section_tit">Relevant Products</h2>
        <div className="markets_products__grid" data-slug="market-products" data-slug-repeat="true">
          {visibleItems.map((item) => {
            const badgeType = badgesType2Only
              ? item.badges === 2
                ? "type2"
                : null
              : getProductBadgeType(item);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={badgeType ? `item ${badgeType}` : "item"}
                data-slug-item
                data-slugkey="seo.slug"
                data-slugkey-attr="href"
              >
                <div className="img_area">
                  {badgeType ? <ProductAwardBadge /> : null}
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image || undefined}
                    alt={item.title}
                    data-slugkey="image"
                    data-slugkey-attr="src"
                  />
                </div>
                <div className="txt_area">
                  <h3 className="tit" data-slugkey="title">{item.title}</h3>
                  {/* <p className="category" data-slugkey="categoryTitle">{item.category}</p> */}
                </div>
              </Link>
            );
          })}
        </div>
        {visibleCount < items.length ? (
          <div className="markets_products__more">
            <button
              type="button"
              className="btn-base btn-lv02 btn-lv02--more"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            >
              View More
              <span className="icon_more" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
