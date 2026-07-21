import Link from "next/link";
import DevicesProducts from "./DevicesProducts";
import {
  motorControlHero,
  type DevicesProductItem,
} from "../data/motorControlContent";

type DevicesHeroProps = {
  title?: string;
  description?: string;
  showCta?: boolean;
  withProducts?: boolean;
  /** category-data depth2 카드 목록(motor-control). 미지정 시 DevicesProducts 정적 기본값 사용 */
  products?: DevicesProductItem[];
};

export default function DevicesHero({
  title = motorControlHero.title,
  description = motorControlHero.description,
  showCta = false,
  withProducts = false,
  products,
}: DevicesHeroProps) {
  return (
    <section
      className={`devices_hero${withProducts ? " devices_hero--with-products" : ""}`}
    >
      <div className="devices_hero" aria-hidden="true" />
      <div className="inner">
        {/* data-slug: category-data (단건 — 카테고리 lv1 히어로 인트로, depth1 레코드) · where=category.depth=1 AND 해당 페이지 카테고리 코드
            depth1 레코드에는 이미지 필드 없음(정상) — 히어로에 이미지 미사용 */}
        <div className="devices_hero__inner" data-slug="category-data">
          <h1 className="devices_hero__tit" data-slugkey="category.title">{title}</h1>
          <p className="devices_hero__desc" data-slugkey="category.description">{description}</p>
          {showCta ? (
            <div className="devices_hero__btns">
              <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--solid">
                Contact Us
              </Link>
            </div>
          ) : null}
        </div>
        {withProducts ? (
          <DevicesProducts embedded showHead={false} items={products} />
        ) : null}
      </div>
    </section>
  );
}
