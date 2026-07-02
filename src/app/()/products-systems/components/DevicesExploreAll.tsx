"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DevicesExploreAllToolbar from "./DevicesExploreAllToolbar";
import {
  chunkLetterGroups,
  gnbExploreAllProducts,
  groupExploreProductsByLetter,
  type GnbExploreLetterGroup,
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
      <ul className="devices_explore__list">
        {group.items.map((item) => (
          <li key={item.id}>
            {item.discontinued ? (
              <Link
                href={item.href}
                prefetch={false}
                className="devices_explore__link devices_explore__link--discontinued"
              >
                <span className="devices_explore__link-text">
                  {renderProductLabel(item.label, item.id)}
                </span>
                <span className="devices_explore__status" aria-hidden />
              </Link>
            ) : (
              <Link href={item.href} prefetch={false} className="devices_explore__link">
                {renderProductLabel(item.label, item.id)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DevicesExploreAll() {
  const [showDiscontinued, setShowDiscontinued] = useState(true);

  const letterRows = useMemo(() => {
    const products = showDiscontinued
      ? gnbExploreAllProducts
      : gnbExploreAllProducts.filter((item) => !item.discontinued);
    return chunkLetterGroups(groupExploreProductsByLetter(products), 3);
  }, [showDiscontinued]);

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
