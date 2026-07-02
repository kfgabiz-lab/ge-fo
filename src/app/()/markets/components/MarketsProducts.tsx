import Link from "next/link";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import { getProductBadgeType } from "@/lib/productBadge";
import { products, type ProductItem } from "../data/marketsContent";

type MarketsProductsProps = {
  items?: ProductItem[];
  /** type2 배지만 표시 (type1·badge 제외) */
  badgesType2Only?: boolean;
};

export default function MarketsProducts({
  items = products,
  badgesType2Only = false,
}: MarketsProductsProps) {
  return (
    <section className="markets_products">
      <div className="inner">
        <h2 className="section_tit">Relavant Products</h2>
        <div className="markets_products__grid">
          {items.map((item) => {
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
              >
                <div className="img_area">
                  {badgeType ? <ProductAwardBadge /> : null}
                  <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
                </div>
                <div className="txt_area">
                  <h3 className="tit">{item.title}</h3>
                  <p className="category">{item.category}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="markets_products__more">
          <Link href="" className="btn-base btn-lv02 btn-lv02--more">
            View More
            <span className="icon_more" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
