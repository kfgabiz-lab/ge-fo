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
  /** product-data 전제품(A~Z, 카테고리 공개 게이트 통과분). 미지정 시 정적 gnbExploreAllProducts 폴백 */
  products?: GnbExploreProduct[];
  /** devices-tree 공개 depth1 목록(Lv1 Category 필터 옵션, 서버에서 조회해 주입) */
  lv1Categories?: { id: string; label: string }[];
  /** 선택 Lv1 rowId별 공개 Lv2 옵션(cascading), 서버에서 조회해 주입 */
  lv2CategoriesByLv1?: Record<string, { id: string; label: string }[]>;
};

export default function DevicesExploreAll({
  products: productsData,
  lv1Categories = [],
  lv2CategoriesByLv1 = {},
}: DevicesExploreAllProps = {}) {
  const [showDiscontinued, setShowDiscontinued] = useState(true);
  const [selectedLv1, setSelectedLv1] = useState("");
  const [selectedLv2, setSelectedLv2] = useState("");
  const source = productsData ?? gnbExploreAllProducts;

  // 선택된 Lv1의 Lv2 옵션(Lv1 미선택 시 빈 배열 → Lv2 비활성)
  const lv2Categories = selectedLv1 ? lv2CategoriesByLv1[selectedLv1] ?? [] : [];

  const letterRows = useMemo(() => {
    let products = source;
    // Lv1 필터 — 제품의 노출 Lv2 집합이 "선택 Lv1 하위 공개 Lv2"와 교집합이 있으면 노출(OR 다중매핑)
    if (selectedLv1) {
      const lv2UnderLv1 = new Set(
        (lv2CategoriesByLv1[selectedLv1] ?? []).map((o) => o.id),
      );
      products = products.filter((item) =>
        (item.lv2Ids ?? []).some((id) => lv2UnderLv1.has(id)),
      );
    }
    // Lv2 필터 — 선택 Lv2가 제품의 노출 Lv2 집합에 포함되면 노출
    if (selectedLv2) {
      products = products.filter((item) =>
        (item.lv2Ids ?? []).includes(selectedLv2),
      );
    }
    // 단종 필터(재정렬 없음) — showDiscontinued off 시 discontinued 제품만 제거
    if (!showDiscontinued) {
      products = products.filter((item) => !item.discontinued);
    }
    return chunkLetterGroups(groupExploreProductsByLetter(products), 3);
  }, [showDiscontinued, selectedLv1, selectedLv2, source, lv2CategoriesByLv1]);

  return (
    <div className="devices_explore__body">
      <DevicesExploreAllToolbar
        showDiscontinued={showDiscontinued}
        onToggle={() => setShowDiscontinued((prev) => !prev)}
        lv1Categories={lv1Categories}
        lv2Categories={lv2Categories}
        selectedLv1={selectedLv1}
        selectedLv2={selectedLv2}
        onLv1Change={(value) => {
          // 상위 변경 시 하위 선택 초기화(ContactUsForm cascading 패턴)
          setSelectedLv1(value);
          setSelectedLv2("");
        }}
        onLv2Change={(value) => setSelectedLv2(value)}
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
