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
        {/* data-slug: category-data (다건 — depth2 카드 목록, lv1 페이지의 하위 카테고리 그리드)
            where=category.parentId={상위 depth1 id} (또는 category.code LIKE '{부모코드}-%' AND depth=2), orderBy sortOrder ASC, tie id
            카드 이미지는 device_systems.image(category2-DeviceSystems 템플릿, 파일ID 배열 → 프록시 변환) */}
        <div className="devices_products__grid" data-slug="category-data" data-slug-repeat="true">
          {items.map((item) => {
            const badgeType = embedded ? null : getProductBadgeType(item);

            return (
              // href는 하위 depth2 카테고리 라우트로 이동하는 정적 라우팅 → 데이터 필드 아님(정적 유지)
              <Link
                key={item.id}
                href={item.href}
                className={badgeType ? `item ${badgeType}` : "item"}
                data-slug-item
              >
                <div className="img_area">
                  {badgeType ? <ProductAwardBadge /> : null}
                  {/* device_systems.image = 파일ID 배열 → FE에서 /api/v1/fo/page-files/{id} 프록시 변환 */}
                  <img
                    loading={embedded ? "eager" : "lazy"}
                    decoding="async"
                    src={item.image}
                    alt={item.title}
                    data-slugKey="device_systems.image"
                    data-slugKey-attr="src"
                  />
                </div>
                <h3 className="tit" data-slugKey="category.title">
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
