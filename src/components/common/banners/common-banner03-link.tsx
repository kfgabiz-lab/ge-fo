"use client";

import Link from "next/link";
import { useState } from "react";

type Banner03LinkItem = {
  title: string;
  description: string;
  href?: string;
};

type CommonBanner03LinkProps = {
  items: Banner03LinkItem[];
};

export default function CommonBanner03Link({ items }: CommonBanner03LinkProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="common_banner_03">
      {items.map((item, index) => {
        const isUnhover =
          hoveredIndex !== null && hoveredIndex !== index;
        const className = ["item", isUnhover && "unhover"].filter(Boolean).join(" ");
        const content = (
          <div className="inner">
            <div className="txt_area">
              <div className="txt_area__text">
                <h2 className="tit">{item.title}</h2>
                <p className="txt">{item.description}</p>
              </div>
              <span className="btn-icon-56 common_banner_03__cta" aria-hidden="true">
                <span className="icon_arrow-20" />
              </span>
            </div>
          </div>
        );

        if (item.href) {
          return (
            <Link
              key={item.title}
              href={item.href}
              className={className}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={item.title}
            className={className}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {content}
          </div>
        );
      })}
    </section>
  );
}
