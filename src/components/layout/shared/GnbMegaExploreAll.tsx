"use client";

import Link from "next/link";
import type { GnbExploreColumn } from "@/data/gnbExploreAllProducts";

type GnbMegaExploreAllProps = {
  columns: GnbExploreColumn[];
  onBack: () => void;
  onLinkClick?: () => void;
};

export default function GnbMegaExploreAll({
  columns,
  onBack,
  onLinkClick,
}: GnbMegaExploreAllProps) {
  return (
    <div className="gnb_mega__inner gnb_mega__inner--explore">
      <Link
        href="#"
        className="gnb_mega__back"
        onClick={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        <span className="gnb_mega__back-icon" aria-hidden />
        Back
      </Link>

      <div className="gnb_mega__explore-grid">
        {columns.map((column) => (
          <div key={column.id} className="gnb_mega__explore-col">
            <h3 className="gnb_mega__explore-col-tit">{column.label}</h3>
            <ul className="gnb_mega__explore-list">
              {column.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="gnb_mega__explore-link"
                    onClick={onLinkClick}
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
        ))}
      </div>
    </div>
  );
}
