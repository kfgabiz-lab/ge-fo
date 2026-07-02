import Link from "next/link";
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
import { getProductBadgeType } from "@/lib/productBadge";
import {
  motorControlProducts,
  type DevicesProductItem,
} from "../data/motorControlContent";

type DevicesProductsProps = {
  embedded?: boolean;
  showHead?: boolean;
  items?: DevicesProductItem[];
};

export default function DevicesProducts({
  embedded = false,
  showHead = true,
  items = motorControlProducts,
}: DevicesProductsProps) {
  const Root = embedded ? "div" : "section";

  return (
    <Root
      className={`devices_products${embedded ? " devices_products--embedded" : ""}`}
    >
      <div className={embedded ? undefined : "inner"}>
        {showHead ? (
          <div className="devices_products__head">
            <h2 className="section_tit">Explore Our LV Motor Control Products</h2>
            <p className="section_desc">
              Explore our comprehensive lineup of UL-certified low voltage
              solutions. From precision motor control to robust power
              distribution, find the high-performance components engineered for
              your system&apos;s reliability.
            </p>
          </div>
        ) : null}
        <div className="devices_products__grid">
          {items.map((item) => {
            const badgeType = embedded ? null : getProductBadgeType(item);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={badgeType ? `item ${badgeType}` : "item"}
              >
                <div className="img_area">
                  {badgeType ? <ProductAwardBadge /> : null}
                  <img
                    loading={embedded ? "eager" : "lazy"}
                    decoding="async"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <h3 className="tit">
                  {item.title.split("\n").map((line, index) => (
                    <span key={`${item.id}-line-${index}`}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </Root>
  );
}
