"use client";

import Link from "next/link";
import type { GnbSimpleMegaItem } from "@/data/gnb";

type GnbMegaItemLinkProps = {
  item: GnbSimpleMegaItem;
  isActive: boolean;
  onItemEnter: (itemId: string) => void;
  onItemClick?: () => void;
  descVariant: "grid" | "section";
};

export default function GnbMegaItemLink({
  item,
  isActive,
  onItemEnter,
  onItemClick,
  descVariant,
}: GnbMegaItemLinkProps) {
  const href = item.href || "#";
  const className = ["gnb_mega__item", isActive ? "is-active" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      onMouseEnter={() => onItemEnter(item.id)}
      onFocus={() => onItemEnter(item.id)}
      onClick={(event) => {
        if (!item.href) {
          event.preventDefault();
        }
        onItemClick?.();
      }}
      {...(item.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {descVariant === "section" ? (
        <span className="gnb_mega__item-head">
          <span className="gnb_mega__item-tit">{item.title}</span>
          {item.external ? (
            <span className="gnb_mega__item-external" aria-hidden />
          ) : null}
        </span>
      ) : (
        <span className="gnb_mega__item-tit">{item.title}</span>
      )}
      {descVariant === "grid" && item.descriptionLines?.length ? (
        <span className="gnb_mega__item-desc">
          {item.descriptionLines.map((line) => (
            <span key={line} className="gnb_mega__item-desc-line">
              {line}
            </span>
          ))}
        </span>
      ) : null}
      {descVariant === "section" && item.description ? (
        <span className="gnb_mega__item-desc">{item.description}</span>
      ) : null}
    </Link>
  );
}
