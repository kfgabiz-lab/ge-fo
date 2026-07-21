"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DevicesExploreAllToolbar from "./DevicesExploreAllToolbar";
import {
  chunkLetterGroups,
  gnbExploreAllProducts,
  groupExploreProductsByLetter,
  type GnbExploreLetterGroup,
  type GnbExploreProduct,
} from "@/data/gnbExploreAllProducts";

function renderProductLabel(label: string, id: string) {
  return label.split("\n").map((line, index) => (
    <span key={`${id}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

function ExploreLetterColumn({ group }: { group: GnbExploreLetterGroup }) {
  return (
    <div className="devices_explore__col">
      <div className="devices_explore__col-head">
        <h2 className="devices_explore__col-letter">{group.letter}</h2>
        <span className="devices_explore__col-line" aria-hidden />
      </div>
      {/* data-slug: product-data (다건 — 전제품 A~Z 목록). where=product.is_visible=001, orderBy product.product_name ASC.
          A~Z 레터 그룹핑은 product_name 기준 클라이언트 파생. href = 제품 상세 정적 라우팅(데이터 필드 아님) */}
      <ul className="devices_explore__list" data-slug="product-data" data-slug-repeat="true">
        {group.items.map((item) => (
          <li key={item.id} data-slug-item>
            {item.discontinued ? (
              // href = 정적 라우팅(정적 유지). discontinued 표기는 product.is_visible 파생 가능성 있음 — 확인 필요
              <Link
                href={item.href}
                prefetch={false}
                className="devices_explore__link devices_explore__link--discontinued"
              >
                <span className="devices_explore__link-text" data-slugkey="product.product_name">
                  {renderProductLabel(item.label, item.id)}
                </span>
                <span className="devices_explore__status" aria-hidden />
              </Link>
            ) : (
              <Link href={item.href} prefetch={false} className="devices_explore__link" data-slugkey="product.product_name">
                {renderProductLabel(item.label, item.id)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type DevicesExploreAllProps = {
  /** product-data 전제품(A~Z). 미지정 시 정적 gnbExploreAllProducts 폴백 */
  products?: GnbExploreProduct[];
};

export default function DevicesExploreAll({
  products: productsData,
}: DevicesExploreAllProps = {}) {
  const [showDiscontinued, setShowDiscontinued] = useState(true);
  const source = productsData ?? gnbExploreAllProducts;

  const letterRows = useMemo(() => {
    const products = showDiscontinued
      ? source
      : source.filter((item) => !item.discontinued);
    return chunkLetterGroups(groupExploreProductsByLetter(products), 3);
  }, [showDiscontinued, source]);

  return (
    <div className="devices_explore__body">
      <DevicesExploreAllToolbar
        showDiscontinued={showDiscontinued}
        onToggle={() => setShowDiscontinued((prev) => !prev)}
      />
      <div className="devices_explore__grid">
        {letterRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="devices_explore__row">
            {row.map((group) => (
              <ExploreLetterColumn key={group.letter} group={group} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
