"use client";

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

        return (
          <a
            key={item.title}
            href={item.href ?? ""}
            className={["item", isUnhover && "unhover"].filter(Boolean).join(" ")}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="inner">
              <div className="txt_area">
                <h2 className="tit">{item.title}</h2>
                <p className="txt">{item.description}</p>
              </div>
            </div>
          </a>
        );
      })}
    </section>
  );
}
