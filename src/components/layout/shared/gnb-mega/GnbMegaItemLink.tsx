"use client";

import Link from "next/link";
import type { GnbSimpleMegaItem } from "@/data/gnb";

type GnbMegaItemLinkProps = {
  item: GnbSimpleMegaItem;
  onItemClick?: () => void;
  descVariant: "grid" | "section";
};

function GnbMegaItemArrow({ external }: { external?: boolean }) {
  if (!external) {
    return null;
  }

  return (
    <span className="gnb_mega__item-arrow" aria-hidden>
      <span className="gnb_mega__item-external" />
    </span>
  );
}

function GnbMegaItemContent({
  item,
  descVariant,
}: {
  item: GnbSimpleMegaItem;
  descVariant: GnbMegaItemLinkProps["descVariant"];
}) {
  return (
    <>
      <span className="gnb_mega__item-head">
        <span className="gnb_mega__item-tit">{item.title}</span>
        <GnbMegaItemArrow external={item.external} />
      </span>
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
    </>
  );
}

export default function GnbMegaItemLink({
  item,
  onItemClick,
  descVariant,
}: GnbMegaItemLinkProps) {
  if (item.disabled) {
    return (
      <span className="gnb_mega__item is-disabled" aria-disabled="true">
        <GnbMegaItemContent item={item} descVariant={descVariant} />
      </span>
    );
  }

  const href = item.href || "#";

  return (
    <Link
      href={href}
      prefetch={false}
      className="gnb_mega__item"
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
      <GnbMegaItemContent item={item} descVariant={descVariant} />
    </Link>
  );
}
