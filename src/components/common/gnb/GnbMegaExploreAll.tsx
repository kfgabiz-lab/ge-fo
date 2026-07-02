"use client";

import Link from "next/link";
import type { GnbExploreLetterGroup } from "@/data/gnbExploreAllProducts";

type GnbMegaExploreAllProps = {
  columns: GnbExploreLetterGroup[][];
  onBack: () => void;
  onLinkClick?: () => void;
};

export default function GnbMegaExploreAll({
  columns,
  onBack,
  onLinkClick,
}: GnbMegaExploreAllProps) {
  return (
    <div className="gnb_mega_explore">
      <button
        type="button"
        className="gnb_mega_explore__back"
        onClick={onBack}
      >
        Back
      </button>

      <div className="gnb_mega_explore__columns">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="gnb_mega_explore__column">
            {column.map((group) => (
              <div key={group.letter} className="gnb_mega_explore__group">
                <h3 className="gnb_mega_explore__letter">{group.letter}</h3>
                <ul className="gnb_mega_explore__list">
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      className={
                        item.discontinued
                          ? "gnb_mega_explore__item is-discontinued"
                          : "gnb_mega_explore__item"
                      }
                    >
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={onLinkClick}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
