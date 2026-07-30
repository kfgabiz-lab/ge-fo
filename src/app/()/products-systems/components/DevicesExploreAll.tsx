"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DevicesExploreAllToolbar from "./DevicesExploreAllToolbar";
import {
  chunkLetterGroups,
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
      <ul className="devices_explore__list" data-slug="product-data" data-slug-repeat="true">
        {group.items.map((item) => (
          <li key={item.id} data-slug-item>
            {item.discontinued ? (
              <Link
                href={item.href}
                prefetch={false}
                className="devices_explore__link devices_explore__link--discontinued"
                aria-disabled="true"
                onClick={(event) => event.preventDefault()}
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
  products?: GnbExploreProduct[];
  lv1Categories?: { id: string; label: string }[];
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
  const source = productsData ?? [];

  const lv2Categories = selectedLv1 ? lv2CategoriesByLv1[selectedLv1] ?? [] : [];

  const letterRows = useMemo(() => {
    let products = source;
    if (selectedLv1) {
      const lv2UnderLv1 = new Set(
        (lv2CategoriesByLv1[selectedLv1] ?? []).map((o) => o.id),
      );
      products = products.filter((item) =>
        (item.lv2Ids ?? []).some((id) => lv2UnderLv1.has(id)),
      );
    }
    if (selectedLv2) {
      products = products.filter((item) =>
        (item.lv2Ids ?? []).includes(selectedLv2),
      );
    }
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
